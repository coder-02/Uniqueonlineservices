import { useState } from 'react'
import { checkEligibility, schemeCategories } from '../data/schemes.js'
import { waLink } from '../config.js'
import Icon from './Icon.jsx'
import { BrainCircuit, CheckCircle2 } from 'lucide-react'

// Unique feature: user apni details bhare, website batayegi kaunsi scheme mil sakti hai.
export default function EligibilityChecker() {
  const [form, setForm] = useState({ age: '', gender: 'any', income: '', category: 'Any' })
  const [results, setResults] = useState(null)

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const check = (e) => {
    e.preventDefault()
    setResults(checkEligibility(form))
  }

  return (
    <div className="elig card">
      <div className="elig-head">
        <span className="elig-emoji"><BrainCircuit size={26} /></span>
        <div>
          <h3>Scheme Eligibility Checker</h3>
          <p className="muted">Apni details bharo, dekho kaunsi sarkari yojana mil sakti hai.</p>
        </div>
      </div>

      <form className="elig-form" onSubmit={check}>
        <div className="elig-field">
          <label>Age / उम्र</label>
          <input type="number" min="0" max="120" placeholder="e.g. 35" value={form.age} onChange={update('age')} />
        </div>
        <div className="elig-field">
          <label>Gender / लिंग</label>
          <select value={form.gender} onChange={update('gender')}>
            <option value="any">Any</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div className="elig-field">
          <label>Yearly Income (₹)</label>
          <input type="number" min="0" placeholder="e.g. 150000" value={form.income} onChange={update('income')} />
        </div>
        <div className="elig-field">
          <label>Category / वर्ग</label>
          <select value={form.category} onChange={update('category')}>
            <option value="Any">Any</option>
            {schemeCategories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary elig-btn"><Icon name="search" size={17} /> Check Schemes</button>
      </form>

      {results && (
        <div className="elig-results">
          {results.length > 0 ? (
            <>
              <p className="elig-count"><CheckCircle2 size={16} /> {results.length} scheme(s) you may be eligible for:</p>
              {results.map((s) => (
                <div className="elig-item" key={s.id}>
                  <div>
                    <b>{s.name}</b>
                    <span className="muted">{s.benefit}</span>
                  </div>
                  <a
                    href={waLink(`Hello, I want to check eligibility & apply for: ${s.name}`)}
                    className="btn btn-whatsapp btn-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon name="whatsapp" size={15} /> Apply
                  </a>
                </div>
              ))}
              <p className="elig-note">This is a basic guide only. Final eligibility is decided by the government. We will help you apply.</p>
            </>
          ) : (
            <div className="elig-empty">
              <p>No matching scheme found for these details right now.</p>
              <a href={waLink('Hello, please help me find a suitable government scheme.')} className="btn btn-whatsapp btn-sm" target="_blank" rel="noopener noreferrer">
                <Icon name="whatsapp" size={15} /> Ask us anyway
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
