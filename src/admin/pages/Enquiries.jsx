import { useState, useEffect } from 'react'
import { api } from '../../lib/api.js'
import { business } from '../../config.js'
import { Loader2, RefreshCw, Phone, MessageCircle } from 'lucide-react'

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

  const setStatus = async (id, status) => {
    await api.updateEnquiry(id, status)
    load()
  }

  const wa = (r) =>
    `https://wa.me/91${r.mobile}?text=` +
    encodeURIComponent(`Namaste ${r.name}, ${business.name} se. Aapki ${r.service} request (${r.ref}) ke baare me baat karni hai.`)

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
              <tr><th>Ref</th><th>Name</th><th>Mobile</th><th>Service</th><th>Message</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>{r.ref}</td>
                  <td>{r.name}</td>
                  <td className="nowrap">
                    <a href={`tel:+91${r.mobile}`} className="icon-link"><Phone size={14} /> {r.mobile}</a>
                  </td>
                  <td>{r.service}</td>
                  <td className="msg-cell">{r.message || '-'}</td>
                  <td><span className={`status-pill status-${r.status}`}>{r.status}</span></td>
                  <td className="nowrap">
                    <select value={r.status} onChange={(e) => setStatus(r.id, e.target.value)} className="mini-select">
                      <option value="new">New</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <a href={wa(r)} target="_blank" rel="noopener noreferrer" className="mini-wa" title="WhatsApp"><MessageCircle size={16} /></a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
