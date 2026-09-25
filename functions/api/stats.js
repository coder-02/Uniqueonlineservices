import { json, requireAuth, requireDb } from '../_lib.js'

// GET /api/stats  -> dashboard summary (admin)
export async function onRequestGet({ request, env }) {
  const dbErr = requireDb(env)
  if (dbErr) return dbErr
  const unauth = await requireAuth(request, env)
  if (unauth) return unauth

  const db = env.DB
  const num = (r, k = 'v') => (r && r[k] != null ? Number(r[k]) : 0)

  // Today (server UTC date). Good enough for a small shop.
  const [
    todayBills,
    todayIncome,
    todayPayments,
    customersCount,
    pendingWork,
    monthIncome,
    monthExpense,
    recentBills,
    recentCustomers,
    recentWork,
    newEnquiries,
    topServices,
  ] = await Promise.all([
    db.prepare("SELECT COUNT(*) v FROM bills WHERE date(created_at) = date('now')").first(),
    db.prepare("SELECT COALESCE(SUM(total),0) v FROM bills WHERE date(created_at) = date('now')").first(),
    db
      .prepare(
        "SELECT payment_mode, COALESCE(SUM(total),0) v FROM bills WHERE date(created_at) = date('now') GROUP BY payment_mode"
      )
      .all(),
    db.prepare('SELECT COUNT(*) v FROM customers').first(),
    db.prepare("SELECT COUNT(*) v FROM work_orders WHERE status IN ('pending','processing')").first(),
    db
      .prepare("SELECT COALESCE(SUM(total),0) v FROM bills WHERE strftime('%Y-%m', created_at) = strftime('%Y-%m','now')")
      .first(),
    db
      .prepare(
        "SELECT COALESCE(SUM(amount),0) v FROM expenses WHERE strftime('%Y-%m', created_at) = strftime('%Y-%m','now')"
      )
      .first(),
    db.prepare('SELECT bill_no, customer_name, total, payment_mode, created_at FROM bills ORDER BY created_at DESC LIMIT 5').all(),
    db.prepare('SELECT name, mobile, created_at FROM customers ORDER BY created_at DESC LIMIT 5').all(),
    db.prepare('SELECT ref, customer_name, service, status, created_at FROM work_orders ORDER BY created_at DESC LIMIT 5').all(),
    db.prepare("SELECT COUNT(*) v FROM enquiries WHERE status = 'new'").first(),
    db
      .prepare(
        'SELECT service, COUNT(*) v FROM work_orders GROUP BY service ORDER BY v DESC LIMIT 5'
      )
      .all(),
  ])

  const payments = { cash: 0, upi: 0, card: 0 }
  for (const row of todayPayments.results || []) {
    if (payments[row.payment_mode] != null) payments[row.payment_mode] = Number(row.v)
  }

  const monthlyIncome = num(monthIncome)
  const monthlyExpense = num(monthExpense)

  return json({
    ok: true,
    stats: {
      todayBills: num(todayBills),
      todayIncome: num(todayIncome),
      customers: num(customersCount),
      pendingWork: num(pendingWork),
      monthlyIncome,
      monthlyExpense,
      netProfit: monthlyIncome - monthlyExpense,
      newEnquiries: num(newEnquiries),
      payments,
    },
    recentBills: recentBills.results || [],
    recentCustomers: recentCustomers.results || [],
    recentWork: recentWork.results || [],
    topServices: (topServices.results || []).map((r) => ({ service: r.service, count: Number(r.v) })),
  })
}
