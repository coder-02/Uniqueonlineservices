// Simple on-site AI assistant "brain".
// It understands the user's message (English / Hindi / Marathi-ish keywords) and
// answers from the website's own data - services, fees, documents, schemes, timing, location.
// No external API needed. Fully offline / free.

import { allServices, findServices, formatFee } from './services.js'
import { schemes, checkEligibility } from './schemes.js'
import { business } from '../config.js'

// Small helper to detect if the text contains any of the given words
const has = (text, words) => words.some((w) => text.includes(w))

// Suggested quick questions shown as chips
export const quickQuestions = [
  'PAN card kaise banega?',
  'Aadhaar ke liye documents?',
  'FASTag ka charge kitna hai?',
  'Kaunsi scheme milegi mujhe?',
  'Dukan kab khulti hai?',
  'Aap kahan ho?',
]

// The bot's reply is an object: { text, chips?, services?, schemes? }
export function botReply(raw) {
  const text = (raw || '').toLowerCase().trim()
  if (!text) {
    return { text: "Namaste! Main aapki kaise madad karu? Aap koi bhi service, fees ya scheme ke baare me pooch sakte ho." }
  }

  // Greetings
  if (has(text, ['hi', 'hello', 'hey', 'namaste', 'namaskar', 'hii', 'hola'])) {
    return {
      text: `Namaste! ${business.name} me aapka swagat hai. Aap kya jaanna chahte ho?`,
      chips: quickQuestions.slice(0, 4),
    }
  }

  // Timing
  if (has(text, ['time', 'timing', 'open', 'khul', 'kab', 'band', 'close', 'hours', 'vel'])) {
    return { text: `Hamari dukan ${business.timing} khuli rehti hai. \u{1F552}` }
  }

  // Location / address
  if (has(text, ['where', 'kahan', 'address', 'location', 'pata', 'kuthe', 'reach', 'map', 'directions'])) {
    return {
      text: `Hum yahan hai: \u{1F4CD} ${business.address}. Aap "Get Directions" se map khol sakte ho.`,
      chips: ['Aap kab khulte ho?', 'Phone number?'],
    }
  }

  // Phone / contact
  if (has(text, ['phone', 'number', 'call', 'contact', 'mobile', 'sampark'])) {
    return { text: `Aap humein call kar sakte ho: \u{1F4DE} ${business.phoneDisplay}. WhatsApp bhi isi number par hai.` }
  }

  // Fees / charges / price
  if (has(text, ['fee', 'fees', 'charge', 'price', 'cost', 'kitna', 'paisa', 'rupay', 'rate', 'kimat', 'shulk'])) {
    // Try to detect a specific service in the same question
    const matched = findServices(text)
    if (matched.length > 0) {
      const s = matched[0]
      return {
        text: `${s.name} ka approx charge: ${formatFee(s.fee)}. Final price kaam ke hisaab se thoda alag ho sakta hai.`,
        services: [s],
      }
    }
    return {
      text: 'Har service ka charge alag hai. Aap service ka naam batao (jaise "PAN fees", "FASTag charge") ya Fee Estimator dekho.',
      chips: ['PAN fees', 'Aadhaar fees', 'Passport fees'],
    }
  }

  // Documents needed
  if (has(text, ['document', 'documents', 'kagaj', 'kagz', 'paper', 'chahiye', 'required', 'lagta', 'lagega', 'kagdपत्र'])) {
    const matched = findServices(text)
    if (matched.length > 0 && matched[0].documents?.length) {
      const s = matched[0]
      return {
        text: `${s.name} ke liye ye documents chahiye:\n\u2022 ${s.documents.join('\n\u2022 ')}`,
        services: [s],
      }
    }
    return {
      text: 'Kis service ke documents chahiye? Service ka naam batao, jaise "PAN documents" ya "passport ke documents".',
      chips: ['PAN documents', 'Aadhaar documents', 'Passport documents'],
    }
  }

  // Scheme eligibility (age based)
  if (has(text, ['eligib', 'eligible', 'patra', 'milegi', 'milega', 'kaunsi scheme', 'which scheme', 'yojana milegi'])) {
    return {
      text: 'Main dekh sakti hu aapke liye kaunsi yojana hai. Homepage par "Am I Eligible?" tool bharo, ya mujhe apni age batao (jaise "meri age 35 hai").',
      chips: ['Meri age 35 hai', 'Student scheme', 'Women scheme', 'Farmer scheme'],
    }
  }

  // Age-based quick eligibility ("meri age 35 hai" / "age 60")
  const ageMatch = text.match(/(\d{1,3})\s*(saal|years|year|age|umar|varsh)?/)
  if (ageMatch && has(text, ['age', 'saal', 'umar', 'year', 'varsh']) ) {
    const age = parseInt(ageMatch[1], 10)
    const eligible = checkEligibility({ age, gender: 'any', income: 0, category: 'Any' })
    if (eligible.length > 0) {
      return {
        text: `Age ${age} ke hisaab se ye schemes mil sakti hai (basic guide):`,
        schemes: eligible.slice(0, 4),
      }
    }
    return { text: `Age ${age} ke liye abhi seedhi matching scheme nahi mili. Aap "Am I Eligible?" tool me full details bharo ya humse poocho.` }
  }

  // Schemes / yojana (general)
  if (has(text, ['scheme', 'schemes', 'yojana', 'yojna', 'sarkari', 'government', 'subsidy', 'sarkar'])) {
    const openS = schemes.filter((s) => s.status === 'open')
    return {
      text: `Abhi ye sarkari yojanaayein chal rahi hai. Kisi bhi par tap karke details dekho:`,
      schemes: openS.slice(0, 4),
    }
  }

  // Services / general list
  if (has(text, ['service', 'services', 'seva', 'kya karte', 'what do you', 'kaam', 'list'])) {
    return {
      text: 'Hum bahut si services dete hai - Aadhaar, PAN, Passport, Banking, Insurance, FASTag, Certificates, Printing aur bahut kuch. Aap kya karwana chahte ho?',
      chips: ['PAN card', 'Aadhaar', 'FASTag', 'Insurance'],
    }
  }

  // Fallback: try to match a service by keywords
  const matched = findServices(text)
  if (matched.length > 0) {
    const s = matched[0]
    return {
      text: `${s.name}: ${s.desc}\nCharge: ${formatFee(s.fee)}. Aap tap karke help le sakte ho ya documents dekh sakte ho.`,
      services: matched.slice(0, 3),
    }
  }

  // Nothing matched
  return {
    text: "Sorry, main ye theek se samajh nahi payi. \u{1F615} Aap in me se koi cheez pooch sakte ho, ya seedha humse WhatsApp/call par baat karo.",
    chips: quickQuestions.slice(0, 4),
  }
}
