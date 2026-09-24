// Central icon component using lucide-react (clean professional SVG icons).
// Usage: <Icon name="pan" size={24} />
import {
  Fingerprint, CreditCard, Plane, Vote, Car, FileText, Wheat, Landmark,
  GraduationCap, Banknote, Receipt, Bike, Building2, Printer, Camera, Briefcase,
  ShieldCheck, Zap, HeartHandshake, IndianRupee, Smartphone, MapPin, Clock,
  Phone, MessageCircle, Search, Sparkles, CheckCircle2, FileCheck, Send,
  Bot, ArrowUp, Menu, X, Sun, Moon, ChevronRight, Bell, Award, Users,
  ClipboardList, Wallet, ScrollText, Home, LayoutGrid, PhoneCall, Star,
} from 'lucide-react'

const map = {
  // services
  aadhaar: Fingerprint,
  pan: CreditCard,
  passport: Plane,
  voter: Vote,
  driving: Car,
  certificate: FileText,
  ration: ScrollText,
  pension: HeartHandshake,
  scholarship: GraduationCap,
  banking: Banknote,
  bill: Receipt,
  insurance: ShieldCheck,
  fastag: Bike,
  rc: Car,
  exam: GraduationCap,
  job: Briefcase,
  printing: Printer,
  photo: Camera,
  // categories
  identity: Fingerprint,
  government: Landmark,
  bankingCat: Building2,
  vehicle: Car,
  education: GraduationCap,
  digital: Printer,
  // scheme
  scheme: Landmark,
  // ui
  shield: ShieldCheck,
  zap: Zap,
  handshake: HeartHandshake,
  rupee: IndianRupee,
  phoneMobile: Smartphone,
  location: MapPin,
  clock: Clock,
  phone: Phone,
  phoneCall: PhoneCall,
  whatsapp: MessageCircle,
  search: Search,
  sparkles: Sparkles,
  check: CheckCircle2,
  fileCheck: FileCheck,
  send: Send,
  bot: Bot,
  up: ArrowUp,
  menu: Menu,
  close: X,
  sun: Sun,
  moon: Moon,
  chevron: ChevronRight,
  bell: Bell,
  award: Award,
  users: Users,
  clipboard: ClipboardList,
  wallet: Wallet,
  home: Home,
  grid: LayoutGrid,
  star: Star,
}

export default function Icon({ name, size = 22, className = '', strokeWidth = 2, ...rest }) {
  const Cmp = map[name] || FileText
  return <Cmp size={size} className={className} strokeWidth={strokeWidth} {...rest} />
}

// Map a service name to an icon key
export function iconKeyForService(serviceName = '') {
  const n = serviceName.toLowerCase()
  if (n.includes('aadhaar')) return 'aadhaar'
  if (n.includes('pan')) return 'pan'
  if (n.includes('passport')) return 'passport'
  if (n.includes('voter')) return 'voter'
  if (n.includes('driving')) return 'driving'
  if (n.includes('certificate')) return 'certificate'
  if (n.includes('ration')) return 'ration'
  if (n.includes('pension')) return 'pension'
  if (n.includes('scholarship')) return 'scholarship'
  if (n.includes('banking') || n.includes('bc point')) return 'banking'
  if (n.includes('bill') || n.includes('recharge')) return 'bill'
  if (n.includes('insurance')) return 'insurance'
  if (n.includes('fastag')) return 'fastag'
  if (n.includes('rc') || n.includes('challan')) return 'rc'
  if (n.includes('exam') || n.includes('admission')) return 'exam'
  if (n.includes('job')) return 'job'
  if (n.includes('print') || n.includes('xerox')) return 'printing'
  if (n.includes('photo')) return 'photo'
  return 'certificate'
}

// Category id -> icon key
export const categoryIconKey = {
  identity: 'identity',
  government: 'government',
  banking: 'bankingCat',
  vehicle: 'vehicle',
  education: 'education',
  digital: 'digital',
}
