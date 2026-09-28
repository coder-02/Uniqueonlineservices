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

// Short document list (max 4, comma separated)
function shortDocs(documents) {
  if (!documents || !documents.length) return ''
  return documents.slice(0, 4).join(', ')
}

// Bilingual (Hindi + English) enquiry message - short, bank style
export function shortEnquiryMsg({ name, service, ref, fees, documents }) {
  const fee = fees ? `Rs.${fees}/-` : 'shop par confirm hoga'
  const feeEn = fees ? `Rs.${fees}/-` : 'confirmed at shop'
  const docs = shortDocs(documents)
  const docHi = docs ? `\u091C\u0930\u0942\u0930\u0940 \u0926\u0938\u094D\u0924\u093E\u0935\u0947\u091C़: ${docs}. ` : ''
  const docEn = docs ? `Required documents: ${docs}. ` : ''
  return (
`\u092A\u094D\u0930\u093F\u092F ${name}, \u0906\u092A\u0915\u0940 ${service} \u090F\u0902\u0915\u094D\u0935\u093E\u092F\u0930\u0940 (${ref}) \u092A\u094D\u0930\u093E\u092A\u094D\u0924 \u0939\u094B \u0917\u092F\u0940 \u0939\u0948\u0964 \u0936\u0941\u0932\u094D\u0915: ${fee}\u0964 ${docHi}\u0915\u0943\u092A\u092F\u093E \u0926\u0938\u094D\u0924\u093E\u0935\u0947\u091C़ \u0932\u0947\u0915\u0930 \u0939\u092E\u093E\u0930\u0940 \u0926\u0941\u0915\u093E\u0928 \u092A\u0930 \u0906\u090F\u0902\u0964

Dear ${name}, your ${service} enquiry (${ref}) has been received. Charge: ${feeEn}. ${docEn}Please visit our shop with the documents. -${business.name}`
  )
}

// Bilingual reminder message
export function shortReminderMsg({ name, service, ref, documents }) {
  const docs = shortDocs(documents)
  const docHi = docs ? ` \u0926\u0938\u094D\u0924\u093E\u0935\u0947\u091C़: ${docs}\u0964` : ''
  const docEn = docs ? ` Documents: ${docs}.` : ''
  return (
`\u092A\u094D\u0930\u093F\u092F ${name}, \u0906\u092A\u0915\u0940 ${service} \u090F\u0902\u0915\u094D\u0935\u093E\u092F\u0930\u0940 (${ref}) \u0905\u092D\u0940 \u092A\u0947\u0902\u0921\u093F\u0902\u0917 \u0939\u0948\u0964 \u0915\u0943\u092A\u092F\u093E \u0926\u0938\u094D\u0924\u093E\u0935\u0947\u091C़ \u0932\u0947\u0915\u0930 \u0926\u0941\u0915\u093E\u0928 \u092A\u0930 \u0906\u090F\u0902\u0964${docHi}

Dear ${name}, your ${service} enquiry (${ref}) is still pending. Please visit our shop with the documents.${docEn} -${business.name}`
  )
}

// Bilingual thank-you message
export function shortThankYouMsg({ name, billNo }) {
  const idHi = billNo ? ` (${billNo})` : ''
  const idEn = billNo ? ` (${billNo})` : ''
  return (
`\u092A\u094D\u0930\u093F\u092F ${name}, \u0906\u092A\u0915\u093E \u0915\u093E\u092E \u092A\u0942\u0930\u093E \u0939\u094B \u0917\u092F\u093E${idHi}\u0964 \u0939\u092E\u093E\u0930\u0940 \u0926\u0941\u0915\u093E\u0928 \u092A\u0930 \u0906\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0927\u0928\u094D\u092F\u0935\u093E\u0926! \u092B\u093F\u0930 \u0906\u090F\u0902\u0964

Dear ${name}, your work is complete${idEn}. Thank you for visiting us! Please visit again. -${business.name}`
  )
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
