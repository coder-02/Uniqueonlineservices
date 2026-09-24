// Central services catalog.
// Each category has an id, title, icon and a list of services.
// Each service can have documents (checklist), a fee (approx), and keywords (for smart search).
// NOTE: fees are approximate/indicative - change them anytime here in one place.

export const serviceCategories = [
  {
    id: "identity",
    title: "Identity & Documents",
    icon: "\u{1FAAA}", // ID card
    services: [
      {
        name: "Aadhaar Card",
        popular: true,
        desc: "Download, update guidance, PVC card, status & appointment.",
        items: ["Aadhaar Download", "Aadhaar Update Guidance", "Aadhaar PVC", "Aadhaar Status", "Aadhaar Appointment"],
        documents: ["Existing Aadhaar / Enrolment No.", "Registered Mobile Number", "Supporting Document (for update)"],
        fee: 50,
        time: "Same day (download/PVC), update as per UIDAI",
        process: ["Aap apni details & document lekar aao", "Hum online form/request bharte hai", "OTP / verification hota hai", "Download ya PVC card ready"],
        keywords: ["aadhar", "aadhaar", "adhar", "uid", "update", "pvc", "biometric"],
      },
      {
        name: "PAN Card",
        popular: true,
        desc: "New PAN, correction, reprint, status and Aadhaar linking guidance.",
        items: ["New PAN", "PAN Correction", "PAN Reprint", "PAN Status", "PAN-Aadhaar Guidance"],
        documents: ["Aadhaar Card", "Passport-size Photograph", "Signature (white paper par)", "Mobile Number linked with Aadhaar", "Date of Birth proof"],
        fee: 150,
        time: "e-PAN 1-2 din, physical card 10-15 din",
        process: ["Aadhaar + photo + signature lekar aao", "Hum NSDL/UTI par online form bharte hai", "Aadhaar OTP se e-KYC / verification", "Fees pay karke acknowledgement milta hai", "e-PAN 1-2 din me, card 10-15 din me ghar aata hai"],
        keywords: ["pan", "pancard", "tan", "income tax", "e-pan"],
      },
      {
        name: "Passport",
        popular: true,
        desc: "New passport, renewal, appointment assistance & status.",
        items: ["New Passport", "Passport Renewal", "Appointment Assistance", "Application Status"],
        documents: ["Aadhaar Card", "Birth Certificate / 10th Marksheet", "Address Proof (bijli bill/bank passbook)", "Photograph", "Old Passport (renewal ke liye)"],
        fee: 300,
        time: "Appointment ke baad police verification par depend",
        process: ["Documents lekar aao", "Passport Seva portal par form bharte hai", "Fees pay & appointment slot book", "PSK/POPSK par visit + verification", "Police verification ke baad passport milta hai"],
        keywords: ["passport", "visa", "travel", "psk", "renewal"],
      },
      {
        name: "Voter ID",
        desc: "New voter ID, correction and status check.",
        items: ["New Voter ID", "Correction", "Status Check", "Download"],
        documents: ["Aadhaar Card", "Age Proof", "Address Proof", "Photograph"],
        fee: 100,
        keywords: ["voter", "voter id", "election", "epic", "matdan"],
      },
      {
        name: "Driving Licence",
        desc: "Learner licence, DL application and RC-related online help.",
        items: ["Learner Licence", "New DL", "Renewal", "Status"],
        documents: ["Aadhaar Card", "Address Proof", "Age Proof", "Photograph"],
        fee: 200,
        keywords: ["driving", "licence", "license", "dl", "learner", "rto", "gadi"],
      },
    ],
  },
  {
    id: "government",
    title: "Government Services",
    icon: "\u{1F3DB}", // building
    services: [
      {
        name: "Certificates",
        desc: "Income, caste, domicile, birth & death certificate applications.",
        items: ["Income Certificate", "Caste Certificate", "Domicile", "Birth Certificate", "Death Certificate"],
        documents: ["Aadhaar Card", "Address Proof", "Supporting Documents"],
        fee: 100,
        keywords: ["certificate", "income", "caste", "domicile", "birth", "death", "praman patra", "dakhla"],
      },
      {
        name: "Ration Card",
        desc: "New ration card, member add/remove and corrections.",
        items: ["New Ration Card", "Add Member", "Remove Member", "Correction"],
        documents: ["Aadhaar Card (all members)", "Address Proof", "Photograph"],
        fee: 100,
        keywords: ["ration", "ration card", "rashan", "food"],
      },
      {
        name: "Pension & Schemes",
        desc: "Pension applications and government scheme assistance.",
        items: ["Old Age Pension", "Widow Pension", "Scheme Applications"],
        documents: ["Aadhaar Card", "Bank Passbook", "Photograph"],
        fee: 100,
        keywords: ["pension", "scheme", "yojana", "old age", "widow", "sarkari"],
      },
      {
        name: "Scholarships",
        desc: "Student scholarship forms and status.",
        items: ["New Scholarship", "Renewal", "Status"],
        documents: ["Aadhaar Card", "Marksheet", "Bank Passbook", "Income Certificate"],
        fee: 100,
        keywords: ["scholarship", "student", "shishyavrutti", "chatravrutti", "education fund"],
      },
    ],
  },
  {
    id: "banking",
    title: "Banking & Financial",
    icon: "\u{1F3E6}", // bank
    services: [
      {
        name: "Banking / BC Point",
        popular: true,
        desc: "Cash withdrawal, deposit, money transfer & balance enquiry.",
        items: ["Cash Withdrawal", "Money Transfer", "Balance Enquiry", "Banking Assistance"],
        documents: ["Aadhaar Card", "Registered Mobile Number"],
        fee: 0,
        keywords: ["bank", "banking", "aeps", "cash", "withdrawal", "money transfer", "paise", "bc point", "deposit"],
      },
      {
        name: "Bill Payment & Recharge",
        desc: "Electricity, water, gas, mobile & DTH recharge.",
        items: ["Electricity Bill", "Mobile Recharge", "DTH Recharge", "Gas/Water Bill"],
        documents: ["Consumer Number / Mobile Number"],
        fee: 10,
        keywords: ["bill", "recharge", "electricity", "light bill", "mobile", "dth", "gas", "water", "payment"],
      },
    ],
  },
  {
    id: "vehicle",
    title: "Vehicle Services",
    icon: "\u{1F697}", // car
    services: [
      {
        name: "Vehicle Insurance",
        popular: true,
        desc: "Two-wheeler, car & commercial vehicle insurance and renewal.",
        items: ["Two Wheeler Insurance", "Car Insurance", "Commercial Vehicle", "Renewal", "Policy Status"],
        documents: ["RC Book", "Previous Policy (for renewal)", "Aadhaar Card"],
        fee: 100,
        keywords: ["insurance", "bima", "vehicle", "bike", "car", "two wheeler", "policy", "renew"],
      },
      {
        name: "FASTag",
        popular: true,
        desc: "New FASTag, recharge, replacement & KYC assistance.",
        items: ["New FASTag", "FASTag Recharge", "Replacement", "KYC Assistance"],
        documents: ["RC Book", "Vehicle Photo", "Aadhaar Card"],
        fee: 100,
        keywords: ["fastag", "fast tag", "toll", "recharge", "kyc"],
      },
      {
        name: "RC & Challan",
        desc: "RC-related online services, challan status and PUC info.",
        items: ["RC Services", "Challan Status", "PUC Information"],
        documents: ["RC Book", "Vehicle Number"],
        fee: 100,
        keywords: ["rc", "challan", "puc", "vehicle", "traffic", "fine", "registration"],
      },
    ],
  },
  {
    id: "education",
    title: "Education & Employment",
    icon: "\u{1F393}", // grad cap
    services: [
      {
        name: "Exam & Admission Forms",
        desc: "Online exam forms, admission forms and results.",
        items: ["Exam Forms", "Admission Forms", "Results", "Certificates"],
        documents: ["Aadhaar Card", "Marksheet", "Photograph", "Signature"],
        fee: 50,
        keywords: ["exam", "form", "admission", "result", "college", "school", "pariksha"],
      },
      {
        name: "Job Applications",
        desc: "Government & private job forms and resume creation.",
        items: ["Government Jobs", "Private Jobs", "Resume Creation", "Online Applications"],
        documents: ["Aadhaar Card", "Qualification Documents", "Photograph"],
        fee: 50,
        keywords: ["job", "naukri", "resume", "cv", "application", "vacancy", "bharti", "government job"],
      },
    ],
  },
  {
    id: "digital",
    title: "Digital Services",
    icon: "\u{1F5A8}", // printer
    services: [
      {
        name: "Printing & Xerox",
        popular: true,
        desc: "Color / B&W printing, scanning, lamination & photocopy.",
        items: ["Printing", "Photocopy / Xerox", "Scanning", "Lamination"],
        documents: ["Document / File to print"],
        fee: 5,
        keywords: ["print", "printing", "xerox", "photocopy", "scan", "lamination", "copy"],
      },
      {
        name: "Photo & Documents",
        desc: "Passport photos, document upload & email assistance.",
        items: ["Passport Photo", "Document Upload", "Email Assistance", "Online Forms"],
        documents: ["Your details / documents"],
        fee: 30,
        keywords: ["photo", "passport photo", "document", "upload", "email", "form fill"],
      },
    ],
  },
]

// Flat list of all services (handy for search)
export const allServices = serviceCategories.flatMap((cat) =>
  cat.services.map((s) => ({ ...s, category: cat.title, categoryId: cat.id, catIcon: cat.icon }))
)

// Popular services for the homepage
export const popularServices = allServices.filter((s) => s.popular)

// Format a fee for display
export function formatFee(fee) {
  if (fee === 0) return "Free / As per bank"
  return `\u20B9${fee} onwards`
}

// Smart finder: match a free-text query to the best services.
// Scores by keyword hits, name match and item match. Returns sorted matches.
export function findServices(query) {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const words = q.split(/\s+/).filter(Boolean)

  const scored = allServices.map((s) => {
    let score = 0
    const name = s.name.toLowerCase()
    const hay = [s.name, s.desc, s.category, ...(s.items || []), ...(s.keywords || [])]
      .join(" ")
      .toLowerCase()

    // Direct substring of full query in name = strong match
    if (name.includes(q)) score += 10

    words.forEach((w) => {
      if (w.length < 2) return
      if ((s.keywords || []).some((k) => k.includes(w) || w.includes(k))) score += 5
      if (name.includes(w)) score += 4
      if (hay.includes(w)) score += 1
    })

    return { service: s, score }
  })

  return scored
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.service)
}
