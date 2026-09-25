// Shared helpers for all Cloudflare Pages Functions.

export function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      ...extraHeaders,
    },
  })
}

export function bad(message, status = 400) {
  return json({ ok: false, error: message }, status)
}

// Read JSON body safely
export async function readJson(request) {
  try {
    return await request.json()
  } catch {
    return null
  }
}

// Generate a reference like UOS-2026-000123
export function makeRef(prefix, n) {
  const year = new Date().getFullYear()
  return `${prefix}-${year}-${String(n).padStart(6, '0')}`
}

// Get next counter value from settings table (atomic-ish)
export async function nextCounter(db, key) {
  const row = await db.prepare('SELECT value FROM settings WHERE key = ?').bind(key).first()
  const current = row ? parseInt(row.value, 10) || 0 : 0
  const next = current + 1
  await db
    .prepare('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = ?')
    .bind(key, String(next), String(next))
    .run()
  return next
}

// --- Auth: simple signed token in a cookie ------------------------------

const encoder = new TextEncoder()

async function hmac(secret, data) {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(data))
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

// Create a session token valid for ~7 days
export async function createToken(env) {
  const secret = env.ADMIN_PASSWORD || 'change-me'
  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000
  const payload = `admin.${exp}`
  const sig = await hmac(secret, payload)
  return `${payload}.${sig}`
}

export async function verifyToken(env, token) {
  if (!token) return false
  const parts = token.split('.')
  if (parts.length !== 3) return false
  const [role, exp, sig] = parts
  if (Date.now() > Number(exp)) return false
  const secret = env.ADMIN_PASSWORD || 'change-me'
  const expected = await hmac(secret, `${role}.${exp}`)
  return sig === expected
}

export function getCookie(request, name) {
  const cookie = request.headers.get('Cookie') || ''
  const match = cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'))
  return match ? decodeURIComponent(match[1]) : null
}

// Guard: return null if authorized, or a 401 response if not
export async function requireAuth(request, env) {
  const token = getCookie(request, 'uos_admin')
  const ok = await verifyToken(env, token)
  if (!ok) return json({ ok: false, error: 'Unauthorized' }, 401)
  return null
}

// Ensure DB binding exists
export function requireDb(env) {
  if (!env.DB) return json({ ok: false, error: 'Database not configured' }, 500)
  return null
}

// Try to send a WhatsApp notification to the owner (best-effort, optional).
// Works only if WA_API_URL + WA_API_TOKEN are configured. Otherwise no-op.
export async function notifyOwner(env, text) {
  try {
    if (!env.WA_API_URL || !env.WA_API_TOKEN || !env.OWNER_WHATSAPP) return
    await fetch(env.WA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.WA_API_TOKEN}`,
      },
      body: JSON.stringify({ to: env.OWNER_WHATSAPP, message: text }),
    })
  } catch {
    // ignore - notification is best effort
  }
}
