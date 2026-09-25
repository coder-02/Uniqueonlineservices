import { json, bad, readJson, requireAuth, requireDb } from '../_lib.js'

// GET  /api/expenses  -> list (admin)
// POST /api/expenses  -> add (admin)
export async function onRequestGet({ request, env }) {
  const dbErr = requireDb(env)
  if (dbErr) return dbErr
  const unauth = await requireAuth(request, env)
  if (unauth) return unauth

  const { results } = await env.DB.prepare('SELECT * FROM expenses ORDER BY created_at DESC LIMIT 300').all()
  return json({ ok: true, data: results })
}

export async function onRequestPost({ request, env }) {
  const dbErr = requireDb(env)
  if (dbErr) return dbErr
  const unauth = await requireAuth(request, env)
  if (unauth) return unauth

  const body = await readJson(request)
  if (!body) return bad('Invalid body')
  const title = (body.title || '').trim()
  const amount = Number(body.amount) || 0
  if (!title || amount <= 0) return bad('Title and amount required')

  const res = await env.DB.prepare('INSERT INTO expenses (title, category, amount, note) VALUES (?, ?, ?, ?)')
    .bind(title, body.category || 'general', amount, body.note || '')
    .run()
  return json({ ok: true, id: res.meta.last_row_id })
}
