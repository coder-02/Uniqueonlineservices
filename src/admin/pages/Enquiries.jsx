import { useState, useEffect } from 'react'
import { api } from '../../lib/api.js'
import { Loader2, RefreshCw, Phone, BellRing, Trash2 } from 'lucide-react'

// Days since a date string
const daysAgo = (dateStr) => {
  if (!dateStr) return 0
  const d = new Date(dateStr.replace(' ', 'T') + 'Z')
  return Math.floor((Date.now() - d.getTime()) / 86400000)
}

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'new', label: 'New' },
  { id: 'processing', label: 'Processing' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
]

export default function Enquiries() {
  const [rows, setRows] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [reminding, setReminding] = useState(null)
  const [toast, setToast] = useState('')

  const load = () => {
    setLoading(true)
    setErr('')
    api
      .enquiries(filter)
      .then((r) => setRows(r.data || []))
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [filter])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 4000)
  }

  const setStatus = async (id, status) => {
    await api.updateEnquiry(id, status)
    load()
  }

  const remove = async (r) => {
    if (!window.confirm(`Delete enquiry ${r.ref} (${r.name})? Ye wapas nahi aayegi.`)) return
    await api.deleteEnquiry(r.id)
    load()
  }

  // Send a reminder SMS to the customer.
  const remind = async (r) => {
    setReminding(r.id)
    try {
      const res = await api.remindEnquiry(r.id)
      showToast(res.sent ? `Reminder SMS ${r.name} ko bhej diya gaya.` : `SMS nahi gaya: ${res.reason || 'SMS gateway set nahi hai'}`)
    } catch {
      showToast('Reminder bhejne me dikkat aayi.')
    } finally {
      setReminding(null)
    }
  }

  return (
    <div className="admin-card">
      <div className="admin-card-head">
        <h3 className="admin-card-title">Customer Enquiries / Requests</h3>
        <button className="btn btn-outline btn-sm" onClick={load}><RefreshCw size={15} /> Refresh</button>
      </div>

      <div className="admin-filters">
        {FILTERS.map((f) => (
          <button key={f.id} className={`chip-btn ${filter === f.id ? 'active' : ''}`} onClick={() => setFilter(f.id)}>
            {f.label}
          </button>
        ))}
      </div>

      {toast && <div className="admin-toast">{toast}</div>}

      {loading ? (
        <div className="admin-loading"><Loader2 size={26} className="spin" /><p>Loading...</p></div>
      ) : err ? (
        <p className="admin-muted">{err}</p>
      ) : rows.length === 0 ? (
        <p className="admin-muted">No enquiries in this list.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Ref</th><th>Name</th><th>Mobile</th><th>Service</th><th>Age</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const age = daysAgo(r.created_at)
                const isPending = r.status === 'new' || r.status === 'processing'
                return (
                <tr key={r.id}>
                  <td>{r.ref}</td>
                  <td>{r.name}</td>
                  <td className="nowrap">
                    <a href={`tel:+91${r.mobile}`} className="icon-link"><Phone size={14} /> {r.mobile}</a>
                  </td>
                  <td>{r.service}</td>
                  <td className="nowrap">
                    {age === 0 ? 'Today' : `${age}d ago`}
                    {isPending && age >= 1 && <span className="age-warn" title="Pending - reminder bhejo">!</span>}
                  </td>
                  <td><span className={`status-pill status-${r.status}`}>{r.status}</span></td>
                  <td className="nowrap enq-actions">
                    <select value={r.status} onChange={(e) => setStatus(r.id, e.target.value)} className="mini-select">
                      <option value="new">New</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    {isPending && (
                      <button className="mini-remind" title="Send Reminder SMS" onClick={() => remind(r)} disabled={reminding === r.id}>
                        {reminding === r.id ? <Loader2 size={15} className="spin" /> : <BellRing size={15} />}
                      </button>
                    )}
                    <button className="mini-delete" title="Delete" onClick={() => remove(r)}><Trash2 size={15} /></button>
                  </td>
                </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
