import { useState, useEffect } from 'react'
import { api } from '../../lib/api.js'
import {
  ReceiptText, IndianRupee, Users, Layers, TrendingUp, Hourglass,
  Wallet, PlusCircle, ListChecks, Briefcase, Loader2, RefreshCw,
} from 'lucide-react'

const money = (n) => '\u20B9' + Number(n || 0).toLocaleString('en-IN')

function StatCard({ icon: I, label, value, sub, tone }) {
  return (
    <div className={`stat-card tone-${tone || 'blue'}`}>
      <div className="stat-icon"><I size={20} /></div>
      <div className="stat-body">
        <span className="stat-label">{label}</span>
        <b className="stat-value">{value}</b>
        {sub && <span className="stat-sub">{sub}</span>}
      </div>
    </div>
  )
}

export default function Dashboard({ go }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  const load = () => {
    setLoading(true)
    setErr('')
    api
      .stats()
      .then(setData)
      .catch((e) => setErr(e.message || 'Failed to load'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  if (loading) {
    return <div className="admin-loading"><Loader2 size={30} className="spin" /><p>Loading data...</p></div>
  }

  if (err) {
    return (
      <div className="admin-empty-state">
        <p>{err}</p>
        <p className="muted">Agar aap local par ho aur D1 setup nahi hai to ye normal hai. Deploy ke baad live data aayega.</p>
        <button className="btn btn-primary btn-sm" onClick={load}><RefreshCw size={15} /> Retry</button>
      </div>
    )
  }

  const s = data.stats
  return (
    <div className="dash">
      {/* Welcome */}
      <div className="dash-welcome">
        <div>
          <h2>Welcome back, Operator!</h2>
          <p className="muted">Aaj ka overview - aapke shop ki live activity.</p>
        </div>
        <button className="btn btn-outline btn-sm" onClick={load}><RefreshCw size={15} /> Refresh</button>
      </div>

      {/* Stats grid */}
      <div className="stat-grid">
        <StatCard icon={ReceiptText} label="Today's Bills" value={s.todayBills} tone="blue" />
        <StatCard icon={IndianRupee} label="Today's Income" value={money(s.todayIncome)} tone="green" />
        <StatCard icon={Users} label="Customers" value={s.customers} tone="violet" />
        <StatCard icon={Layers} label="New Enquiries" value={s.newEnquiries} tone="gold" />
        <StatCard icon={TrendingUp} label="Monthly Income" value={money(s.monthlyIncome)} tone="green" />
        <StatCard icon={Hourglass} label="Pending Work" value={s.pendingWork} tone="orange" />
        <StatCard icon={Wallet} label="Monthly Expense" value={money(s.monthlyExpense)} tone="red" />
        <StatCard icon={TrendingUp} label="Net Profit (Month)" value={money(s.netProfit)} tone="blue" />
      </div>

      <div className="dash-columns">
        <div className="dash-left">
          {/* Quick actions */}
          <div className="admin-card">
            <h3 className="admin-card-title"><PlusCircle size={18} /> Quick Actions</h3>
            <div className="quick-actions">
              <button className="quick-action" onClick={() => go('newbill')}>
                <span className="qa-icon qa-blue"><ReceiptText size={20} /></span> New Bill
              </button>
              <button className="quick-action" onClick={() => go('enquiries')}>
                <span className="qa-icon qa-violet"><ListChecks size={20} /></span> Enquiries
              </button>
              <button className="quick-action" onClick={() => go('work')}>
                <span className="qa-icon qa-orange"><Briefcase size={20} /></span> New Work Order
              </button>
              <button className="quick-action" onClick={() => go('expenses')}>
                <span className="qa-icon qa-red"><Wallet size={20} /></span> Add Expense
              </button>
            </div>
          </div>

          {/* Recent bills */}
          <div className="admin-card">
            <h3 className="admin-card-title"><ReceiptText size={18} /> Recent Bills</h3>
            {data.recentBills.length === 0 ? (
              <p className="admin-muted">No bills generated yet.</p>
            ) : (
              <table className="admin-table">
                <thead><tr><th>Bill No</th><th>Customer</th><th>Mode</th><th>Total</th></tr></thead>
                <tbody>
                  {data.recentBills.map((b) => (
                    <tr key={b.bill_no}>
                      <td>{b.bill_no}</td>
                      <td>{b.customer_name || 'Walk-in'}</td>
                      <td><span className="pill">{b.payment_mode}</span></td>
                      <td><b>{money(b.total)}</b></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Recent work orders */}
          <div className="admin-card">
            <h3 className="admin-card-title"><Briefcase size={18} /> Recent Work Orders</h3>
            {data.recentWork.length === 0 ? (
              <p className="admin-muted">No work orders yet.</p>
            ) : (
              <table className="admin-table">
                <thead><tr><th>Ref</th><th>Customer</th><th>Service</th><th>Status</th></tr></thead>
                <tbody>
                  {data.recentWork.map((w) => (
                    <tr key={w.ref}>
                      <td>{w.ref}</td>
                      <td>{w.customer_name}</td>
                      <td>{w.service}</td>
                      <td><span className={`status-pill status-${w.status}`}>{w.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="dash-right">
          {/* Payment summary */}
          <div className="admin-card payment-card">
            <h3 className="admin-card-title">Today's Payment Summary</h3>
            <div className="pay-row"><span>Cash</span><b>{money(s.payments.cash)}</b></div>
            <div className="pay-row"><span>UPI</span><b>{money(s.payments.upi)}</b></div>
            <div className="pay-row"><span>Card</span><b>{money(s.payments.card)}</b></div>
            <div className="pay-total"><span>Total</span><b>{money(s.payments.cash + s.payments.upi + s.payments.card)}</b></div>
          </div>

          {/* Top services */}
          <div className="admin-card">
            <h3 className="admin-card-title"><Layers size={18} /> Top Services</h3>
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

          {/* Recent customers */}
          <div className="admin-card">
            <h3 className="admin-card-title"><Users size={18} /> Recent Customers</h3>
            {data.recentCustomers.length === 0 ? (
              <p className="admin-muted">No customers yet.</p>
            ) : (
              <ul className="cust-list">
                {data.recentCustomers.map((c, i) => (
                  <li key={i}><b>{c.name}</b><span>{c.mobile}</span></li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
