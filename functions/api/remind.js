import { json, bad, readJson, requireAuth, requireDb, sendSMS, smsReminder } from '../_lib.js'

// POST /api/remind   { id }   -> send a reminder SMS to the enquiry's customer (admin)
export async function onRequestPost({ request, env }) {
  const dbErr = requireDb(env)
  if (dbErr) return dbErr
  const unauth = await requireAuth(request, env)
  if (unauth) return unauth

  const body = await readJson(request)
  if (!body || !body.id) return bad('id required')

  const row = await env.DB.prepare('SELECT * FROM enquiries WHERE id = ?').bind(body.id).first()
  if (!row) return bad('Enquiry not found', 404)

  const text = smsReminder({ name: row.name, service: row.service, ref: row.ref })
  const result = await sendSMS(env, row.mobile, text)
  return json({ ok: true, sent: result.sent, reason: result.reason })
}
