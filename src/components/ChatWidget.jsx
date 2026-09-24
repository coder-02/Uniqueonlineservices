import { useState, useRef, useEffect } from 'react'
import { botReply, quickQuestions } from '../data/botBrain.js'
import { formatFee } from '../data/services.js'
import { waLink } from '../config.js'
import { Bot, X, Send, MessageCircle, Landmark } from 'lucide-react'
import Icon, { iconKeyForService } from './Icon.jsx'

let idCounter = 0
const newId = () => ++idCounter

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [typing, setTyping] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: newId(),
      from: 'bot',
      text: 'Namaste! Main Unique Online Services ki assistant hu. Services, fees, documents ya schemes - kuch bhi pooch lo!',
      chips: quickQuestions.slice(0, 4),
    },
  ])
  const bodyRef = useRef(null)
  const inputRef = useRef(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [messages, typing])

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 200)
  }, [open])

  const send = (raw) => {
    const text = (raw ?? '').trim()
    if (!text) return

    // add user message
    setMessages((m) => [...m, { id: newId(), from: 'user', text }])
    setTyping(true)

    // simulate a short "thinking" delay for a natural feel
    setTimeout(() => {
      const reply = botReply(text)
      setTyping(false)
      setMessages((m) => [...m, { id: newId(), from: 'bot', ...reply }])
    }, 550)
  }

  const [draft, setDraft] = useState('')
  const submit = (e) => {
    e.preventDefault()
    send(draft)
    setDraft('')
  }

  return (
    <div className="chat-widget">
      {open && (
        <div className="chat-panel">
          <div className="chat-head">
            <div className="chat-head-info">
              <div className="chat-avatar"><Bot size={22} /></div>
              <div>
                <b>UOS Assistant</b>
                <span className="chat-status"><i className="dot-online" /> Online now</span>
              </div>
            </div>
            <button className="chat-close" onClick={() => setOpen(false)} aria-label="Close"><X size={16} /></button>
          </div>

          <div className="chat-body" ref={bodyRef}>
            {messages.map((m) => (
              <div key={m.id} className={`msg-row ${m.from}`}>
                {m.from === 'bot' && <div className="msg-avatar"><Bot size={16} /></div>}
                <div className="msg-group">
                  <div className={`msg-bubble ${m.from}`}>
                    {m.text.split('\n').map((line, i) => (
                      <span key={i}>{line}<br /></span>
                    ))}
                  </div>

                  {/* Service results */}
                  {m.services?.length > 0 && (
                    <div className="msg-cards">
                      {m.services.map((s) => (
                        <a
                          key={s.name}
                          href={waLink(`Hello, I want help with ${s.name}.`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="msg-card"
                        >
                          <span className="msg-card-icon"><Icon name={iconKeyForService(s.name)} size={18} /></span>
                          <span className="msg-card-info">
                            <b>{s.name}</b>
                            <em>{formatFee(s.fee)}</em>
                          </span>
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Scheme results */}
                  {m.schemes?.length > 0 && (
                    <div className="msg-cards">
                      {m.schemes.map((s) => (
                        <a
                          key={s.id}
                          href={waLink(`Hello, I want to apply for scheme: ${s.name}`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="msg-card scheme"
                        >
                          <span className="msg-card-icon"><Landmark size={18} /></span>
                          <span className="msg-card-info">
                            <b>{s.name}</b>
                            <em>{s.benefit}</em>
                          </span>
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Quick reply chips */}
                  {m.chips?.length > 0 && (
                    <div className="msg-chips">
                      {m.chips.map((c) => (
                        <button key={c} className="msg-chip" onClick={() => send(c)}>{c}</button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {typing && (
              <div className="msg-row bot">
                <div className="msg-avatar"><Bot size={16} /></div>
                <div className="msg-bubble bot typing">
                  <span /><span /><span />
                </div>
              </div>
            )}
          </div>

          <form className="chat-input" onSubmit={submit}>
            <input
              ref={inputRef}
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Type your question..."
              aria-label="Type your message"
            />
            <button type="submit" className="chat-send" aria-label="Send" disabled={!draft.trim()}>
              <Send size={17} />
            </button>
          </form>
          <div className="chat-foot-note">Powered by Unique Online Services</div>
        </div>
      )}

      <button className={`chat-fab ${open ? 'active' : ''}`} onClick={() => setOpen((v) => !v)} aria-label="Chat assistant">
        {open ? <X size={24} /> : <MessageCircle size={26} />}
        {!open && <span className="chat-fab-badge">AI</span>}
      </button>
    </div>
  )
}
