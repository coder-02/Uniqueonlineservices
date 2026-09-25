import { useState, useEffect } from 'react'
import { api } from '../../lib/api.js'
import { Loader2, RefreshCw, Search, UserPlus, Phone, MessageCircle } from 'lucide-react'

export default function Customers() {
  const [rows, setRows] = useState([])
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [form, setForm] = useState({ name: '', mobile: '', address: '' })
  const [adding, setAdding] = useState(false)

  const load = () => {
    setLoading(true)
    setErr('')
    api.customers(q).then((r) => setRows(r.data || [])).catch((e) => setErr(e.message)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const add = async (e) => {
    e.preventDefault()
    if (!form.name || !form.mobile) return
    setAdding(true)
    try {
      await api.addCustomer(form)
      setForm({ name: '', mobile: '', address: '' })
      load()
    } catch (er) { setErr(er.message) } finally { setAdding(false) }
  }

  return (
    <div className="admin-grid-2">
      <div className="admin-card">
        <div className="admin-card-head">
          <h3 className="admin-card-title">Customers</h3>
          <button className="btn btn-outline btn-sm" onClick={load}><RefreshCw size={15} /></button>
        </div>
        <div className="admin-search">
          <Search size={16} />
          <input placeholder="Search name or mobile" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && load()} />
          <button className="btn btn-primary btn-sm" onClick={load}>Search</button>
        </div>
        {loading ? (
          <div className="admin-loading"><Loader2 size={24} className="spin" /></div>
        ) : err ? (
          <p className="admin-muted">{err}</p>
        ) : rows.length === 0 ? (
          <p className="admin-muted">No customers found.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Name</th><th>Mobile</th><th>Address</th><th></th></tr></thead>
              <tbody>
                {rows.map((c) => (
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td className="nowrap"><a href={`tel:+91${c.mobile}`} className="icon-link"><Phone size={13} /> {c.mobile}</a></td>
                    <td>{c.address || '-'}</td>
                    <td><a href={`https://wa.me/91${c.mobile}`} target="_blank" rel="noopener noreferrer" className="mini-wa"><MessageCircle size={16} /></a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="admin-card admin-card-narrow">
        <h3 className="admin-card-title"><UserPlus size={18} /> Add Customer</h3>
        <form onSubmit={add} className="admin-form">
          <label>Name *</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <label>Mobile *</label>
          <input value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} required />
          <label>Address</label>
          <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <button className="btn btn-primary btn-block" disabled={adding}>{adding ? <Loader2 size={16} className="spin" /> : 'Add Customer'}</button>
        </form>
      </div>
    </div>
  )
}
