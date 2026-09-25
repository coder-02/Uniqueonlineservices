import { json, bad, readJson, requireAuth, requireDb, makeRef, nextCounter } from '../_lib.js'

// GET  /api/bills   -> recent bills (admin)
// POST /api/bills   -> create bill (admin)
export async function onRequestGet({ request, env }) {
  const dbErr = requireDb(env)
  if (dbErr) return dbErr
  const unauth = await requireAuth(request, env)
  if (unauth) return unauth

  const url = new URL(request.url)
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '100', 10), 500)
  const { results } = await env.DB.prepare('SELECT * FROM bills ORDER BY created_at DESC LIMIT ?')
    .bind(limit)
    .all()
  return json({ ok: true, data: results })
}

export async function onRequestPost({ request, env }) {
  const dbErr = requireDb(env)
  if (dbErr) return dbErr
  const unauth = await requireAuth(request, env)
  if (unauth) return unauth

  const body = await readJson(request)
  if (!body) return bad('Invalid body')
  const items = Array.isArray(body.items) ? body.items : []
  if (items.length === 0) return bad('Add at least one item')

  const subtotal = items.reduce((s, it) => s + (Number(it.price) || 0) * (Number(it.qty) || 1), 0)
  const discount = Number(body.discount) || 0
  const total = Math.max(0, subtotal - discount)

  const n = await nextCounter(env.DB, 'bill_counter')
  const billNo = makeRef('BILL', n)

  await env.DB.prepare(
    'INSERT INTO bills (bill_no, customer_name, customer_mobile, items, subtotal, discount, total, payment_mode) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  )
    .bind(
      billNo,
      body.customer_name || 'Walk-in',
      body.customer_mobile || '',
      JSON.stringify(items),
      subtotal,
      discount,
      total,
      body.payment_mode || 'cash'
    )
    .run()

  return json({ ok: true, bill_no: billNo, total })
}
