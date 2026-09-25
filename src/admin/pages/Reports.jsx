import { useState, useEffect } from 'react'
import { api } from '../../lib/api.js'
import { Loader2, RefreshCw, TrendingUp, TrendingDown, IndianRupee, BarChart3 } from 'lucide-react'

const money = (n) => '\u20B9' + Number(n || 0).toLocaleString('en-IN')

export default function Reports() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  const load = () => {
    setLoading(true)
    setErr('')
    api.stats().then(setData).catch((e) => setErr(e.message)).finally(() => setLoading(false))
  }
  useEffect(load, [])

  if (loading) return <div className="admin-loading"><Loader2 size={28} className="spin" /><p>Loading...</p></div>
  if (err) return <div className="admin-card"><p className="admin-muted">{err}</p></div>

  const s = data.stats
  return (
    <div className="dash">
      <div className="admin-card-head">
        <h3 className="admin-card-title"><BarChart3 size={18} /> Business Report (This Month)</h3>
        <button className="btn btn-outline btn-sm" onClick={load}><RefreshCw size={15} /> Refresh</button>
      </div>

      <div className="report-grid">
        <div className="report-box tone-green">
          <TrendingUp size={22} />
          <span>Monthly Income</span>
          <b>{money(s.monthlyIncome)}</b>
        </div>
        <div className="report-box tone-red">
          <TrendingDown size={22} />
          <span>Monthly Expense</span>
          <b>{money(s.monthlyExpense)}</b>
        </div>
        <div className="report-box tone-blue">
          <IndianRupee size={22} />
          <span>Net Profit</span>
          <b>{money(s.netProfit)}</b>
        </div>
      </div>

      <div className="admin-card">
        <h3 className="admin-card-title">Today's Snapshot</h3>
        <div className="report-lines">
          <div><span>Today's Bills</span><b>{s.todayBills}</b></div>
          <div><span>Today's Income</span><b>{money(s.todayIncome)}</b></div>
          <div><span>Cash</span><b>{money(s.payments.cash)}</b></div>
          <div><span>UPI</span><b>{money(s.payments.upi)}</b></div>
          <div><span>Card</span><b>{money(s.payments.card)}</b></div>
          <div><span>Total Customers</span><b>{s.customers}</b></div>
          <div><span>Pending Work</span><b>{s.pendingWork}</b></div>
          <div><span>New Enquiries</span><b>{s.newEnquiries}</b></div>
        </div>
      </div>

      <div className="admin-card">
        <h3 className="admin-card-title">Top Services</h3>
        {data.topServices.length === 0 ? (
          <p className="admin-muted">No data yet.</p>
        ) : (
          <ul className="top-list">
            {data.topServices.map((t, i) => (
              <li key={t.service}><span className="top-rank">{i + 1}</span> {t.service} <b>{t.count}</b></li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
