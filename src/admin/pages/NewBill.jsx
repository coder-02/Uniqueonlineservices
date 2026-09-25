import { useState } from 'react'
import { api } from '../../lib/api.js'
import { allServices } from '../../data/services.js'
import { Plus, Trash2, Loader2, CheckCircle2, Receipt } from 'lucide-react'

const money = (n) => '\u20B9' + Number(n || 0).toLocaleString('en-IN')

export default function NewBill() {
  const [customer, setCustomer] = useState({ name: '', mobile: '' })
  const [items, setItems] = useState([{ name: '', price: '', qty: 1 }])
  const [discount, setDiscount] = useState('')
  const [mode, setMode] = useState('cash')
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(null)
  const [err, setErr] = useState('')

  const setItem = (i, k, v) => {
    const next = [...items]
    next[i] = { ...next[i], [k]: v }
    setItems(next)
  }
  const addItem = () => setItems([...items, { name: '', price: '', qty: 1 }])
  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i))

  const subtotal = items.reduce((s, it) => s + (Number(it.price) || 0) * (Number(it.qty) || 1), 0)
  const total = Math.max(0, subtotal - (Number(discount) || 0))

  const save = async () => {
    setErr('')
    const clean = items.filter((it) => it.name.trim() && Number(it.price) > 0)
    if (clean.length === 0) { setErr('Kam se kam ek item add karo (naam + price).'); return }
    setSaving(true)
    try {
      const res = await api.createBill({
        customer_name: customer.name || 'Walk-in',
        customer_mobile: customer.mobile,
        items: clean.map((it) => ({ name: it.name, price: Number(it.price), qty: Number(it.qty) || 1 })),
        discount: Number(discount) || 0,
        payment_mode: mode,
      })
      setDone(res)
    } catch (e) {
      setErr(e.message)
    } finally {
      setSaving(false)
    }
  }

  const reset = () => {
    setDone(null)
    setCustomer({ name: '', mobile: '' })
    setItems([{ name: '', price: '', qty: 1 }])
    setDiscount('')
    setMode('cash')
  }

  if (done) {
    return (
      <div className="admin-card success-box">
        <div className="success-icon"><CheckCircle2 size={50} /></div>
        <h3>Bill Created!</h3>
        <p className="req-ref">Bill No: <b>{done.bill_no}</b></p>
        <p className="muted">Total: <b>{money(done.total)}</b></p>
        <button className="btn btn-primary btn-sm" onClick={reset}><Receipt size={15} /> New Bill</button>
      </div>
    )
  }

  return (
    <div className="admin-card">
      <h3 className="admin-card-title"><Receipt size={18} /> New Bill (POS)</h3>

      <div className="bill-customer">
        <input placeholder="Customer name (optional)" value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} />
        <input placeholder="Mobile (optional)" value={customer.mobile} onChange={(e) => setCustomer({ ...customer, mobile: e.target.value })} />
      </div>

      <div className="bill-items">
        {items.map((it, i) => (
          <div className="bill-item" key={i}>
            <input list="svc-list" placeholder="Service / item" value={it.name} onChange={(e) => setItem(i, 'name', e.target.value)} className="bi-name" />
            <input type="number" placeholder="Price" value={it.price} onChange={(e) => setItem(i, 'price', e.target.value)} className="bi-price" />
            <input type="number" placeholder="Qty" value={it.qty} min="1" onChange={(e) => setItem(i, 'qty', e.target.value)} className="bi-qty" />
            <span className="bi-line">{money((Number(it.price) || 0) * (Number(it.qty) || 1))}</span>
            <button className="bi-del" onClick={() => removeItem(i)} disabled={items.length === 1}><Trash2 size={16} /></button>
          </div>
        ))}
        <datalist id="svc-list">
          {allServices.map((s) => <option key={s.name} value={s.name} />)}
        </datalist>
        <button className="btn btn-ghost btn-sm" onClick={addItem}><Plus size={15} /> Add Item</button>
      </div>

      <div className="bill-summary">
        <div className="bs-row"><span>Subtotal</span><b>{money(subtotal)}</b></div>
        <div className="bs-row">
          <span>Discount</span>
          <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder="0" className="bs-discount" />
        </div>
        <div className="bs-row bs-total"><span>Total</span><b>{money(total)}</b></div>
        <div className="bs-modes">
          {['cash', 'upi', 'card'].map((m) => (
            <button key={m} className={`chip-btn ${mode === m ? 'active' : ''}`} onClick={() => setMode(m)}>{m.toUpperCase()}</button>
          ))}
        </div>
        {err && <p className="admin-error">{err}</p>}
        <button className="btn btn-primary btn-block" onClick={save} disabled={saving}>
          {saving ? <><Loader2 size={17} className="spin" /> Saving...</> : <>Create Bill - {money(total)}</>}
        </button>
      </div>
    </div>
  )
}
