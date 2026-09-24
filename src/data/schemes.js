/* =====================================================================
   GOVERNMENT SCHEMES  —  यहीं से manage करें
   =====================================================================
   जब भी कोई नई सरकारी योजना आए, बस नीचे "schemes" list में एक नया block
   copy-paste करके भर दो और save कर दो — website पर अपने आप दिख जाएगी।

   हर scheme में ये fields होते हैं:
     id          : unique short name (english, no spaces) - जैसे "pm-awas"
     name        : योजना का नाम (कोई भी भाषा)
     department  : विभाग का नाम
     category    : इनमें से एक -> Student / Farmer / Women / Senior Citizen /
                   Job Seeker / Small Business / Animal Husbandry / General
     benefit     : क्या फायदा मिलेगा
     eligibility : पात्रता (short line)
     documents   : ज़रूरी कागज़ (list)
     lastDate    : आखिरी तारीख (खाली छोड़ सकते हो)
     district    : जैसे "All Maharashtra" / "All India"
     status      : "open" (चालू) / "coming" (जल्द) / "closed" (बंद)
     officialUrl : सरकारी website का link (खाली छोड़ सकते हो)
     isNew       : true रखो अगर नई है (NEW badge + banner दिखेगा)

   ELIGIBILITY CHECKER के लिए (optional, न भरो तो सबको दिखेगी):
     minAge, maxAge : उम्र की range (number)
     gender         : "any" / "male" / "female"
     incomeMax      : सालाना income की limit (₹). 0 = कोई limit नहीं

   ⚠️ हमेशा योजना की जानकारी सरकारी source से verify करके ही डालो।
   ===================================================================== */

export const schemes = [
  {
    id: "mahamesh",
    name: "राजे यशवंतराव होळकर महामेष योजना",
    department: "Animal Husbandry Dept., Maharashtra",
    category: "Animal Husbandry",
    benefit: "Up to 75% subsidy for sheep rearing",
    eligibility: "Shepherd / eligible beneficiaries (as per govt norms)",
    documents: ["Aadhaar Card", "Bank Passbook", "Caste Certificate", "Photograph"],
    lastDate: "",
    district: "All Maharashtra",
    status: "open",
    officialUrl: "",
    isNew: true,
    minAge: 18, maxAge: 60, gender: "any", incomeMax: 0,
  },
  {
    id: "scholarship",
    name: "Post-Matric Scholarship",
    department: "Social Welfare Dept.",
    category: "Student",
    benefit: "Tuition fee & maintenance allowance",
    eligibility: "Students of eligible categories with income limit",
    documents: ["Aadhaar Card", "Marksheet", "Income Certificate", "Bank Passbook"],
    lastDate: "",
    district: "All",
    status: "open",
    officialUrl: "",
    isNew: true,
    minAge: 15, maxAge: 30, gender: "any", incomeMax: 250000,
  },
  {
    id: "pmkisan",
    name: "PM Kisan Samman Nidhi",
    department: "Ministry of Agriculture, Govt. of India",
    category: "Farmer",
    benefit: "\u20B96,000 per year in 3 installments",
    eligibility: "Small & marginal farmer families",
    documents: ["Aadhaar Card", "Bank Passbook", "Land Records"],
    lastDate: "",
    district: "All India",
    status: "open",
    officialUrl: "",
    isNew: false,
    minAge: 18, maxAge: 100, gender: "any", incomeMax: 0,
  },
  {
    id: "ladki-bahin",
    name: "Mukhyamantri Majhi Ladki Bahin Yojana",
    department: "Women & Child Development, Maharashtra",
    category: "Women",
    benefit: "Monthly financial assistance to eligible women",
    eligibility: "Eligible women residents of Maharashtra (as per norms)",
    documents: ["Aadhaar Card", "Bank Passbook", "Domicile", "Ration Card"],
    lastDate: "",
    district: "All Maharashtra",
    status: "open",
    officialUrl: "",
    isNew: true,
    minAge: 21, maxAge: 65, gender: "female", incomeMax: 250000,
  },
  {
    id: "pension",
    name: "Sanjay Gandhi Niradhar Pension",
    department: "Social Justice Dept., Maharashtra",
    category: "Senior Citizen",
    benefit: "Monthly pension for eligible beneficiaries",
    eligibility: "Destitute / senior citizens as per govt norms",
    documents: ["Aadhaar Card", "Age Proof", "Income Certificate", "Bank Passbook"],
    lastDate: "",
    district: "All Maharashtra",
    status: "coming",
    officialUrl: "",
    isNew: false,
    minAge: 60, maxAge: 120, gender: "any", incomeMax: 100000,
  },
]

export const schemeCategories = [
  "Student",
  "Farmer",
  "Women",
  "Senior Citizen",
  "Job Seeker",
  "Small Business",
  "Animal Husbandry",
  "General",
]

// Latest update headlines for the homepage ticker.
// Add a new line here whenever there is any news/update.
export const latestUpdates = [
  { text: "New Government Scheme available - Ladki Bahin Yojana", isNew: true },
  { text: "Scholarship application started for this year", isNew: true },
  { text: "Aadhaar update service available in-store", isNew: false },
  { text: "FASTag new issue & recharge available", isNew: false },
  { text: "Vehicle insurance renewal assistance", isNew: false },
]

// Schemes marked isNew - used for the auto "New Scheme" banner on the homepage.
export const newSchemes = schemes.filter((s) => s.isNew)

// Eligibility checker: given user answers, return matching schemes.
export function checkEligibility({ age, gender, income, category }) {
  const a = Number(age) || 0
  const inc = Number(income) || 0
  return schemes.filter((s) => {
    if (s.status === "closed") return false
    if (category && category !== "Any" && s.category !== category) return false
    if (a) {
      if (s.minAge && a < s.minAge) return false
      if (s.maxAge && a > s.maxAge) return false
    }
    if (gender && gender !== "any" && s.gender && s.gender !== "any" && s.gender !== gender) return false
    if (s.incomeMax && inc && inc > s.incomeMax) return false
    return true
  })
}
