import { useState, useEffect } from 'react'
import { api } from '../../lib/api.js'
import { allServices } from '../../data/services.js'
import { buildThankYou } from '../../config.js'
import { Loader2, RefreshCw, Plus, Briefcase } from 'lucide-react'

const money = (n) => '\u20B9' + Number(n || 0).toLocaleString('en-IN')
const FILTERS = ['all', 'pending', 'processing', 'completed', 'delivered']

export default function WorkManager() {
  const [rows, setRows] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [form, setForm] = useState({ customer_name: '', customer_mobile: '', service: '', details: '', amount: '' })
  const [adding, setAdding] = useState(false)

  const load = () => {
    setLoading(true)
    setErr('')
    api.workorders(filter).then((r) => setRows(r.data || [])).catch((e) => setErr(e.message)).finally(() => setLoading(false))
  }

  useEffect(load, [filter])

  const add = async (e) => {
    e.preventDefault()
    if (!form.customer_name || !form.service) return
    setAdding(true)
    try {
      await api.createWorkOrder(form)
      setForm({ customer_name: '', customer_mobile: '', service: '', details: '', amount: '' })
      setFilter('all')
      load()
    } catch (er) { setErr(er.message) } finally { setAdding(false) }
  }

  const setStatus = async (id, status) => {
    const row = rows.find((r) => r.id === id)
    // When marking done, ask whether to send a thank-you WhatsApp
    let notify = false
    if ((status === 'completed' || status === 'delivered') && row?.customer_mobile && /^\d{10}$/.test(row.customer_mobile)) {
      notify = window.confirm(`${row.customer_name} ko "Thank You" WhatsApp bhejein?`)
    }
    const res = await api.updateWorkOrder(id, status, notify)
    // If thank-you was wanted but API not configured, open WhatsApp as fallback
    if (notify && row && !res.whatsappSent) {
      const msg = buildThankYou({ name: row.customer_name, kind: 'work', service: row.service, ref: row.ref, amount: row.amount })
      window.open(`https://wa.me/91${row.customer_mobile}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener')
    }
    load()
  }

  return (
    <div className="admin-grid-2">
      <div className="admin-card">
        <div className="admin-card-head">
          <h3 className="admin-card-title"><Briefcase size={18} /> Work Manager</h3>
          <button className="btn btn-outline btn-sm" onClick={load}><RefreshCw size={15} /></button>
        </div>
        <div className="admin-filters">
          {FILTERS.map((f) => (
            <button key={f} className={`chip-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
        {loading ? (
          <div className="admin-loading"><Loader2 size={24} className="spin" /></div>
        ) : err ? (
          <p className="admin-muted">{err}</p>
        ) : rows.length === 0 ? (
          <p className="admin-muted">No work orders.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Ref</th><th>Customer</th><th>Service</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                {rows.map((w) => (
                  <tr key={w.id}>
                    <td>{w.ref}</td>
                    <td>{w.customer_name}</td>
                    <td>{w.service}</td>
                    <td>{money(w.amount)}</td>
                    <td>
                      <select value={w.status} onChange={(e) => setStatus(w.id, e.target.value)} className="mini-select">
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="admin-card admin-card-narrow">
        <h3 className="admin-card-title"><Plus size={18} /> New Work Order</h3>
        <form onSubmit={add} className="admin-form">
          <label>Customer Name *</label>
          <input value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} required />
          <label>Mobile</label>
          <input value={form.customer_mobile} onChange={(e) => setForm({ ...form, customer_mobile: e.target.value })} />
          <label>Service *</label>
          <input list="wo-svc" value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} required />
          <datalist id="wo-svc">{allServices.map((s) => <option key={s.name} value={s.name} />)}</datalist>
          <label>Details</label>
          <textarea rows="2" value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} />
          <label>Amount</label>
          <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          <button className="btn btn-primary btn-block" disabled={adding}>{adding ? <Loader2 size={16} className="spin" /> : 'Create Work Order'}</button>
        </form>
      </div>
    </div>
  )
}
