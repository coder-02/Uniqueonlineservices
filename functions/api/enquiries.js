import { json, bad, readJson, requireAuth, requireDb, makeRef, nextCounter, notifyOwner, sendWhatsApp, buildEnquiryMessage } from '../_lib.js'

// GET  /api/enquiries        -> list (admin only)
// POST /api/enquiries        -> create (public - from website form)
// PATCH /api/enquiries        { id, status }  -> update status (admin only)

export async function onRequestGet({ request, env }) {
  const dbErr = requireDb(env)
  if (dbErr) return dbErr
  const unauth = await requireAuth(request, env)
  if (unauth) return unauth

  const url = new URL(request.url)
  const status = url.searchParams.get('status')
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '100', 10), 500)

  let query = 'SELECT * FROM enquiries'
  const binds = []
  if (status && status !== 'all') {
    query += ' WHERE status = ?'
    binds.push(status)
  }
  query += ' ORDER BY created_at DESC LIMIT ?'
  binds.push(limit)

  const { results } = await env.DB.prepare(query).bind(...binds).all()
  return json({ ok: true, data: results })
}

export async function onRequestPost({ request, env }) {
  const dbErr = requireDb(env)
  if (dbErr) return dbErr
  const body = await readJson(request)
  if (!body) return bad('Invalid body')

  const name = (body.name || '').trim()
  const mobile = (body.mobile || '').trim()
  const service = (body.service || '').trim()
  const message = (body.message || '').trim()

  if (!name || !mobile || !service) return bad('Name, mobile and service are required')
  if (!/^\d{10}$/.test(mobile)) return bad('Enter a valid 10-digit mobile number')

  const n = await nextCounter(env.DB, 'enquiry_counter')
  const ref = makeRef('UOS', n)

  await env.DB.prepare(
    'INSERT INTO enquiries (ref, name, mobile, service, message, status, source) VALUES (?, ?, ?, ?, ?, ?, ?)'
  )
    .bind(ref, name, mobile, service, message, 'new', 'website')
    .run()

  // Also upsert as a customer record (best-effort)
  try {
    const existing = await env.DB.prepare('SELECT id FROM customers WHERE mobile = ?').bind(mobile).first()
    if (!existing) {
      await env.DB.prepare('INSERT INTO customers (name, mobile) VALUES (?, ?)').bind(name, mobile).run()
    }
  } catch {
    // ignore
  }

  // Build the professional confirmation message (with the generated ID) and,
  // if autoSend is requested, send it to the CUSTOMER's WhatsApp automatically
  // (only works when a WhatsApp API provider is configured).
  let waResult = { sent: false }
  if (body.autoSend) {
    const customerText = buildEnquiryMessage({ name, service, ref, details: body.details })
    waResult = await sendWhatsApp(env, `91${mobile}`, customerText)
  }

  // Notify owner on WhatsApp (best effort, only if configured)
  await notifyOwner(
    env,
    `New Service Request ${ref}\nName: ${name}\nMobile: ${mobile}\nService: ${service}\nMessage: ${message || '-'}`
  )

  return json({ ok: true, ref, whatsappSent: waResult.sent })
}

export async function onRequestPatch({ request, env }) {
  const dbErr = requireDb(env)
  if (dbErr) return dbErr
  const unauth = await requireAuth(request, env)
  if (unauth) return unauth

  const body = await readJson(request)
  if (!body || !body.id) return bad('id is required')
  const allowed = ['new', 'processing', 'completed', 'cancelled']
  if (!allowed.includes(body.status)) return bad('Invalid status')

  await env.DB.prepare('UPDATE enquiries SET status = ? WHERE id = ?').bind(body.status, body.id).run()
  return json({ ok: true })
}
