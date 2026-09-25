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
