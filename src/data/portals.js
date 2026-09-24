/* =====================================================================
   OFFICIAL GOVERNMENT PORTALS  —  Quick Access Hub
   =====================================================================
   Ye official sarkari websites ke DIRECT links hai. Ye naye tab me
   official site par hi khulti hai (secure). Hum sirf ek jagah quick
   access + apni help dete hai.

   Naya portal add karna ho to niche list me ek block copy-paste kardo.
     name        : portal ka naam
     org         : kaunsa department/organization
     desc        : kya kaam hota hai
     url         : official website ka link (https)
     icon        : Icon.jsx me se ek key (aadhaar/pan/insurance/scheme...)
     tags        : search/filter ke liye words
     color       : card accent - "indigo" | "blue" | "green" | "gold" | "violet"
   ===================================================================== */

export const portals = [
  {
    name: "PAN Card (Protean / NSDL)",
    org: "Protean eGov (NSDL) - Income Tax Dept.",
    desc: "Naya PAN, correction, reprint aur PAN-Aadhaar linking - official portal.",
    url: "https://www.protean-tinpan.com/",
    icon: "pan",
    tags: ["pan", "nsdl", "protean", "income tax"],
    color: "blue",
  },
  {
    name: "myAadhaar (UIDAI)",
    org: "UIDAI - Govt. of India",
    desc: "Aadhaar download, update, PVC order, status aur appointment.",
    url: "https://myaadhaar.uidai.gov.in/",
    icon: "aadhaar",
    tags: ["aadhaar", "uidai", "myaadhaar", "update"],
    color: "indigo",
  },
  {
    name: "Ayushman Bharat (PMJAY)",
    org: "National Health Authority",
    desc: "PMJAY beneficiary check aur Ayushman card - health scheme.",
    url: "https://beneficiary.nha.gov.in/",
    icon: "insurance",
    tags: ["pmjay", "ayushman", "health", "beneficiary", "card"],
    color: "green",
  },
  {
    name: "e-Shram Card",
    org: "Ministry of Labour & Employment",
    desc: "Unorganised workers ke liye e-Shram registration aur card.",
    url: "https://eshram.gov.in/",
    icon: "job",
    tags: ["eshram", "e-shram", "labour", "worker", "shram"],
    color: "gold",
  },
  {
    name: "ABHA Health ID (ABDM)",
    org: "Ayushman Bharat Digital Mission",
    desc: "ABHA (health) ID banao aur apne health records manage karo.",
    url: "https://abha.abdm.gov.in/",
    icon: "insurance",
    tags: ["abha", "abdm", "health id", "digital health"],
    color: "violet",
  },
  {
    name: "Aaple Sarkar (Maharashtra)",
    org: "Government of Maharashtra",
    desc: "Maharashtra ki sarkari sevaayein, certificates aur schemes.",
    url: "https://aaplesarkar.mahaonline.gov.in/",
    icon: "government",
    tags: ["maharashtra", "aaple sarkar", "mahaonline", "certificate"],
    color: "blue",
  },
  {
    name: "PM Kisan",
    org: "Ministry of Agriculture, Govt. of India",
    desc: "Kisan Samman Nidhi - registration, status aur beneficiary list.",
    url: "https://pmkisan.gov.in/",
    icon: "certificate",
    tags: ["pm kisan", "farmer", "kisan", "agriculture"],
    color: "green",
  },
  {
    name: "Passport Seva",
    org: "Ministry of External Affairs",
    desc: "Passport apply, appointment aur application status.",
    url: "https://www.passportindia.gov.in/",
    icon: "passport",
    tags: ["passport", "psk", "visa", "travel"],
    color: "indigo",
  },
]
