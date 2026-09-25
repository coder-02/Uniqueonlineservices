import { useState, useEffect } from 'react'
import { api } from '../../lib/api.js'
import { Loader2, RefreshCw, Plus, Wallet } from 'lucide-react'

const money = (n) => '\u20B9' + Number(n || 0).toLocaleString('en-IN')
const CATS = ['general', 'rent', 'electricity', 'internet', 'stationery', 'salary', 'other']

export default function Expenses() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [form, setForm] = useState({ title: '', category: 'general', amount: '', note: '' })
  const [adding, setAdding] = useState(false)

  const load = () => {
    setLoading(true)
    setErr('')
    api.expenses().then((r) => setRows(r.data || [])).catch((e) => setErr(e.message)).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const total = rows.reduce((s, r) => s + Number(r.amount || 0), 0)

  const add = async (e) => {
    e.preventDefault()
    if (!form.title || !form.amount) return
    setAdding(true)
    try {
      await api.addExpense(form)
      setForm({ title: '', category: 'general', amount: '', note: '' })
      load()
    } catch (er) { setErr(er.message) } finally { setAdding(false) }
  }

  return (
    <div className="admin-grid-2">
      <div className="admin-card">
        <div className="admin-card-head">
          <h3 className="admin-card-title"><Wallet size={18} /> Expenses</h3>
          <button className="btn btn-outline btn-sm" onClick={load}><RefreshCw size={15} /></button>
        </div>
        <div className="expense-total">Total: <b>{money(total)}</b></div>
        {loading ? (
          <div className="admin-loading"><Loader2 size={24} className="spin" /></div>
        ) : err ? (
          <p className="admin-muted">{err}</p>
        ) : rows.length === 0 ? (
          <p className="admin-muted">No expenses recorded.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Title</th><th>Category</th><th>Amount</th></tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}><td>{r.title}</td><td><span className="pill">{r.category}</span></td><td><b>{money(r.amount)}</b></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="admin-card admin-card-narrow">
        <h3 className="admin-card-title"><Plus size={18} /> Add Expense</h3>
        <form onSubmit={add} className="admin-form">
          <label>Title *</label>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <label>Category</label>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {CATS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <label>Amount *</label>
          <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
          <label>Note</label>
          <input value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
          <button className="btn btn-primary btn-block" disabled={adding}>{adding ? <Loader2 size={16} className="spin" /> : 'Add Expense'}</button>
        </form>
      </div>
    </div>
  )
}
