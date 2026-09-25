import { json, bad, readJson, requireAuth, requireDb, sendWhatsApp } from '../_lib.js'

// POST /api/remind   { id }   -> send a reminder WhatsApp to the enquiry's customer (admin)
export async function onRequestPost({ request, env }) {
  const dbErr = requireDb(env)
  if (dbErr) return dbErr
  const unauth = await requireAuth(request, env)
  if (unauth) return unauth

  const body = await readJson(request)
  if (!body || !body.id) return bad('id required')

  const row = await env.DB.prepare('SELECT * FROM enquiries WHERE id = ?').bind(body.id).first()
  if (!row) return bad('Enquiry not found', 404)

  const text =
    body.text ||
    `Namaste ${row.name} ji, yaad dilana chahte hai - aapki *${row.service}* enquiry (${row.ref}) abhi pending hai.\n\n` +
    `Kripya zaroori documents lekar hamari shop par aayein. Koi bhi help chahiye to reply karein.\n\n` +
    `- Unique Online Services`

  const result = await sendWhatsApp(env, `91${row.mobile}`, text)
  return json({ ok: true, sent: result.sent, reason: result.reason })
}
