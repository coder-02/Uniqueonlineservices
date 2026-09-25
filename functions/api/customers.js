import { json, bad, readJson, requireAuth, requireDb } from '../_lib.js'

// GET  /api/customers?q=search   -> list/search (admin)
// POST /api/customers            -> add (admin)
export async function onRequestGet({ request, env }) {
  const dbErr = requireDb(env)
  if (dbErr) return dbErr
  const unauth = await requireAuth(request, env)
  if (unauth) return unauth

  const url = new URL(request.url)
  const q = (url.searchParams.get('q') || '').trim()
  let query = 'SELECT * FROM customers'
  const binds = []
  if (q) {
    query += ' WHERE name LIKE ? OR mobile LIKE ?'
    binds.push(`%${q}%`, `%${q}%`)
  }
  query += ' ORDER BY created_at DESC LIMIT 300'
  const { results } = await env.DB.prepare(query).bind(...binds).all()
  return json({ ok: true, data: results })
}

export async function onRequestPost({ request, env }) {
  const dbErr = requireDb(env)
  if (dbErr) return dbErr
  const unauth = await requireAuth(request, env)
  if (unauth) return unauth

  const body = await readJson(request)
  if (!body) return bad('Invalid body')
  const name = (body.name || '').trim()
  const mobile = (body.mobile || '').trim()
  if (!name || !mobile) return bad('Name and mobile required')

  const existing = await env.DB.prepare('SELECT id FROM customers WHERE mobile = ?').bind(mobile).first()
  if (existing) return json({ ok: true, id: existing.id, existed: true })

  const res = await env.DB.prepare('INSERT INTO customers (name, mobile, address, notes) VALUES (?, ?, ?, ?)')
    .bind(name, mobile, body.address || '', body.notes || '')
    .run()
  return json({ ok: true, id: res.meta.last_row_id })
}
