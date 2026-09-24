import { useState } from 'react'
import { newSchemes } from '../data/schemes.js'
import { Sparkles, X } from 'lucide-react'
import Icon from './Icon.jsx'

// Auto banner: jab bhi koi scheme isNew:true ho, homepage par highlight ho jati hai.
export default function NewSchemeBanner({ navigate }) {
  const [closed, setClosed] = useState(false)
  if (closed || newSchemes.length === 0) return null

  const latest = newSchemes[0]
  const extra = newSchemes.length - 1

  return (
    <div className="new-scheme-banner" role="status">
      <div className="nsb-inner container">
        <span className="nsb-pulse"><Sparkles size={16} /></span>
        <span className="nsb-text">
          <b>New Scheme:</b> {latest.name}
          {extra > 0 && <span className="nsb-extra"> +{extra} more</span>}
        </span>
        <button className="nsb-cta" onClick={() => navigate('schemes')}>View Schemes <Icon name="chevron" size={14} /></button>
        <button className="nsb-close" onClick={() => setClosed(true)} aria-label="Close"><X size={14} /></button>
      </div>
    </div>
  )
}
