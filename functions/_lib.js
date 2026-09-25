// Shared helpers for all Cloudflare Pages Functions.

// Business details for server-built WhatsApp messages.
// Keep in sync with src/config.js
export const BIZ = {
  name: 'Unique Online Services',
  tagline: 'Aapki Har Online Zarurat, Ek Hi Jagah',
  operatorName: 'Sayed Saifurehman',
  address: 'Aziz Chowk, Marul, Maharashtra',
  timing: 'Monday - Sunday | 9:00 AM - 9:00 PM',
  phoneDisplay: '+91 77589 52601',
}

// Build the professional enquiry-confirmation WhatsApp message (with the ID).
export function buildEnquiryMessage({ name, service, ref, details }) {
  const d = details || {}
  const line = '\u2501'.repeat(20)
  const docs = Array.isArray(d.documents) ? d.documents : []
  const docLines = docs.length ? docs.map((x, i) => `${i + 1}. ${x}`).join('\n') : 'Koi special document nahi.'
  const feeText = d.fees ? `\u20B9${Number(d.fees).toLocaleString('en-IN')}/-` : 'Shop par confirm hoga'
  const svcLine = `${service}${d.category ? ` \u2013 ${d.category}` : ''}`
  const operator = d.operatorName || BIZ.operatorName

  return (
`*${BIZ.name.toUpperCase()}*
*${BIZ.tagline}*
${line}

*SERVICE ENQUIRY CONFIRMATION*

Hello *${name} Ji*,

Aapki *${service}* enquiry successfully receive ho gayi hai.

*ENQUIRY DETAILS*
${line}
*Enquiry ID:* ${ref}
*Service:* ${svcLine}

*REQUIRED DOCUMENTS*

${docLines}

*SERVICE CHARGES:* ${feeText}

*IMPORTANT INFORMATION*
Please original documents ke saath photocopies bhi lekar aayein.
Application process se pehle documents aur details ki verification ki jayegi.${d.notes ? `\n\n*NOTE:* ${d.notes}` : ''}

${line}

*OFFICE DETAILS*

\u{1F4CD} ${BIZ.address}
\u{1F550} ${BIZ.timing}
\u{1F4DE} ${BIZ.phoneDisplay}

${line}

*AUTHORIZED SERVICE DESK*
\u{1F464} *${operator}*
*${BIZ.name}*

${line}
*${BIZ.name.toUpperCase()}*
*${BIZ.tagline}*`
  )
}

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

// ---------------------------------------------------------------------------
// WhatsApp auto-send (server side, no window needed)
// ---------------------------------------------------------------------------
// Configure ONE provider in Cloudflare env vars. Supported presets:
//
//  WA_PROVIDER = "aisensy"   (recommended for India, easy)
//    WA_API_TOKEN     -> your AiSensy API key
//    WA_CAMPAIGN      -> your AiSensy campaign name (template)
//
//  WA_PROVIDER = "meta"      (WhatsApp Cloud API, official)
//    WA_PHONE_ID      -> your WhatsApp phone number ID
//    WA_API_TOKEN     -> permanent access token
//    WA_TEMPLATE      -> approved template name (for out-of-session sends)
//
//  WA_PROVIDER = "generic"   (any custom endpoint)
//    WA_API_URL       -> POST endpoint, receives { to, message }
//    WA_API_TOKEN     -> bearer token
//
// If nothing is configured, sending is skipped (returns { sent:false }).
// `to` should be a full number with country code, e.g. 917758952601

export async function sendWhatsApp(env, to, text) {
  const provider = (env.WA_PROVIDER || '').toLowerCase()
  const number = String(to || '').replace(/\D/g, '')
  if (!number) return { sent: false, reason: 'no-number' }

  try {
    if (provider === 'aisensy' && env.WA_API_TOKEN && env.WA_CAMPAIGN) {
      const res = await fetch('https://backend.aisensy.com/campaign/t1/api/v2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: env.WA_API_TOKEN,
          campaignName: env.WA_CAMPAIGN,
          destination: number,
          userName: 'Customer',
          templateParams: [text],
        }),
      })
      return { sent: res.ok }
    }

    if (provider === 'meta' && env.WA_PHONE_ID && env.WA_API_TOKEN) {
      const res = await fetch(`https://graph.facebook.com/v20.0/${env.WA_PHONE_ID}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${env.WA_API_TOKEN}`,
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: number,
          type: 'text',
          text: { body: text },
        }),
      })
      return { sent: res.ok }
    }

    if (env.WA_API_URL && env.WA_API_TOKEN) {
      const res = await fetch(env.WA_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.WA_API_TOKEN}` },
        body: JSON.stringify({ to: number, message: text }),
      })
      return { sent: res.ok }
    }
  } catch {
    return { sent: false, reason: 'error' }
  }
  return { sent: false, reason: 'not-configured' }
}

// Notify the shop owner (uses OWNER_WHATSAPP).
export async function notifyOwner(env, text) {
  if (!env.OWNER_WHATSAPP) return { sent: false }
  return sendWhatsApp(env, env.OWNER_WHATSAPP, text)
}
