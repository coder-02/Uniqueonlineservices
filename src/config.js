// Business details - change these anytime in one place
export const business = {
  name: "Unique Online Services",
  tagline: "Aapki Har Online Zarurat, Ek Hi Jagah",
  subtitle: "Government Services • Banking • Insurance • Documents • Online Applications",
  operatorName: "Sayed Saifur Rehman", // shown in the WhatsApp message as the service desk person
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

// Professional "Thank You" / service completion message.
// kind: "bill" | "work"
export function buildThankYou({ name, kind, service, billNo, ref, amount }) {
  const line = '\u2501'.repeat(20)
  const amt = amount ? `\u20B9${Number(amount).toLocaleString('en-IN')}/-` : ''
  const details =
    kind === 'bill'
      ? `*BILL DETAILS*\n${line}\n${billNo ? `*Bill No.:* ${billNo}\n` : ''}${amt ? `*Amount Paid:* ${amt}\n` : ''}\n*SERVICE STATUS:* \u2705 Completed`
      : `*SERVICE DETAILS*\n${line}\n${ref ? `*Order Ref:* ${ref}\n` : ''}${service ? `*Service:* ${service}\n` : ''}${amt ? `*Amount:* ${amt}\n` : ''}\n*SERVICE STATUS:* \u2705 Completed`

  return (
`*${business.name.toUpperCase()}*
*${business.tagline}*
${line}

*SERVICE COMPLETION CONFIRMATION*

Hello *${name} Ji*,

Aapka service request successfully complete ho gaya hai.
Hamari shop par visit karne ke liye *Thank You*! \u{1F64F}

${details}

${line}

Aapko agar future mein kisi bhi *Online / Government Service* ki zarurat ho, to aap humse contact kar sakte hain.

Aapke trust aur support ke liye hum aabhari hain.
Apne friends aur family ko bhi *${business.name}* ke baare mein zaroor batayein. \u{1F91D}

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
