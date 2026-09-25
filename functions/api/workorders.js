import { json, bad, readJson, requireAuth, requireDb, makeRef, nextCounter, sendWhatsApp, buildThankYouMessage } from '../_lib.js'

// GET   /api/workorders?status=  -> list (admin)
// POST  /api/workorders           -> create (admin)
// PATCH /api/workorders           { id, status } -> update (admin)
export async function onRequestGet({ request, env }) {
  const dbErr = requireDb(env)
  if (dbErr) return dbErr
  const unauth = await requireAuth(request, env)
  if (unauth) return unauth

  const url = new URL(request.url)
  const status = url.searchParams.get('status')
  let query = 'SELECT * FROM work_orders'
  const binds = []
  if (status && status !== 'all') {
    query += ' WHERE status = ?'
    binds.push(status)
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
  const name = (body.customer_name || '').trim()
  const service = (body.service || '').trim()
  if (!name || !service) return bad('Customer name and service required')

  const n = await nextCounter(env.DB, 'work_counter')
  const ref = makeRef('WO', n)

  await env.DB.prepare(
    'INSERT INTO work_orders (ref, customer_name, customer_mobile, service, details, amount, status) VALUES (?, ?, ?, ?, ?, ?, ?)'
  )
    .bind(ref, name, body.customer_mobile || '', service, body.details || '', Number(body.amount) || 0, 'pending')
    .run()

  return json({ ok: true, ref })
}

export async function onRequestPatch({ request, env }) {
  const dbErr = requireDb(env)
  if (dbErr) return dbErr
  const unauth = await requireAuth(request, env)
  if (unauth) return unauth

  const body = await readJson(request)
  if (!body || !body.id) return bad('id required')
  const allowed = ['pending', 'processing', 'completed', 'delivered']
  if (!allowed.includes(body.status)) return bad('Invalid status')

  await env.DB.prepare("UPDATE work_orders SET status = ?, updated_at = datetime('now') WHERE id = ?")
    .bind(body.status, body.id)
    .run()

  // When work is completed/delivered, send a thank-you message to the customer
  // (only if a WhatsApp API is configured). Frontend passes notify:true.
  let waResult = { sent: false }
  if (body.notify && (body.status === 'completed' || body.status === 'delivered')) {
    const row = await env.DB.prepare('SELECT * FROM work_orders WHERE id = ?').bind(body.id).first()
    if (row && row.customer_mobile && /^\d{10}$/.test(row.customer_mobile)) {
      const text = buildThankYouMessage({
        name: row.customer_name,
        kind: 'work',
        service: row.service,
        ref: row.ref,
        amount: row.amount,
      })
      waResult = await sendWhatsApp(env, `91${row.customer_mobile}`, text)
    }
  }

  return json({ ok: true, whatsappSent: waResult.sent })
}
