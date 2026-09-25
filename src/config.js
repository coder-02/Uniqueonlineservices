// Business details - change these anytime in one place
export const business = {
  name: "Unique Online Services",
  tagline: "Aapki Har Online Zarurat, Ek Hi Jagah",
  subtitle: "Government Services • Banking • Insurance • Documents • Online Applications",
  operatorName: "Sayed Saifurehman", // shown in the WhatsApp message as the service desk person
  phone: "7758952601",
  phoneDisplay: "+91 77589 52601",
  whatsapp: "917758952601", // country code + number, no + or spaces
  address: "Aziz Chowk, Marul, Maharashtra",
  timing: "Monday - Sunday | 9:00 AM - 9:00 PM",
  email: "",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Aziz+Chowk+Marul+Maharashtra",
}

export const callLink = `tel:+91${business.phone}`

// Build a WhatsApp link with an optional custom message
export function waLink(message) {
  const text = message || "Hello Unique Online Services, I want help with your services."
  return `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(text)}`
}

// Direct WhatsApp link to a specific customer number (10-digit) with a message
export function waTo(mobile10, message) {
  return `https://wa.me/91${mobile10}?text=${encodeURIComponent(message)}`
}

// Professional "Thank You" message (used as fallback when WhatsApp API not set up).
// kind: "bill" | "work"
export function buildThankYou({ name, kind, service, billNo, ref, amount }) {
  const line = '\u2501'.repeat(20)
  const amt = amount ? `\u20B9${Number(amount).toLocaleString('en-IN')}/-` : ''
  const middle =
    kind === 'bill'
      ? `Aapka kaam successfully complete ho gaya hai. Hamari shop par aane ke liye *dhanyawaad*! \u{1F64F}\n\n*BILL DETAILS*\n${line}\n${billNo ? `*Bill No:* ${billNo}\n` : ''}${amt ? `*Amount:* ${amt}\n` : ''}`
      : `Aapki *${service || 'service'}* ka kaam *complete* ho gaya hai. Hamari service choose karne ke liye *dhanyawaad*! \u{1F64F}\n\n*WORK DETAILS*\n${line}\n${ref ? `*Order Ref:* ${ref}\n` : ''}${service ? `*Service:* ${service}\n` : ''}`

  return (
`*${business.name.toUpperCase()}*
*${business.tagline}*
${line}

*THANK YOU*

Hello *${name} Ji*,

${middle}
${line}

Agar aapko aur koi online / government service chahiye ho, to hum hamesha aapki seva me hai.
Kripya apne dost aur family ko bhi hamari shop batayein. \u{1F31F}

${line}

*VISIT AGAIN*
\u{1F4CD} ${business.address}
\u{1F550} ${business.timing}
\u{1F4DE} ${business.phoneDisplay}

${line}
\u{1F464} *${business.operatorName}*
*${business.name}*`
  )
}
