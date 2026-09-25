import { json, bad, readJson, createToken, requireAuth } from '../_lib.js'

// POST /api/auth  { action: 'login', password } | { action: 'logout' }
// GET  /api/auth  -> checks current session
export async function onRequestGet({ request, env }) {
  const unauth = await requireAuth(request, env)
  if (unauth) return json({ ok: true, authed: false })
  return json({ ok: true, authed: true })
}

export async function onRequestPost({ request, env }) {
  const body = await readJson(request)
  if (!body) return bad('Invalid body')

  if (body.action === 'logout') {
    return json({ ok: true }, 200, {
      'Set-Cookie': 'uos_admin=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0',
    })
  }

  if (body.action === 'login') {
    const expected = env.ADMIN_PASSWORD || 'admin123'
    if (!body.password || body.password !== expected) {
      return bad('Wrong password', 401)
    }
    const token = await createToken(env)
    return json({ ok: true }, 200, {
      'Set-Cookie': `uos_admin=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`,
    })
  }

  return bad('Unknown action')
}
