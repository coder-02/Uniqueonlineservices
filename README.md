# Unique Online Services

A modern React (Vite) website + real admin dashboard for **Unique Online Services** - a digital
service center offering Aadhaar, PAN, Passport, Banking, Insurance, FASTag, Government Schemes and
more. Includes an AI assistant, scheme eligibility checker, fee estimator, official portals hub,
and a **Cloudflare D1-backed owner dashboard** (bills/POS, customers, work orders, enquiries,
expenses, reports).

## Tech stack
- React 18 + Vite (frontend)
- Cloudflare Pages Functions (backend API in `/functions`)
- Cloudflare D1 (SQLite database)
- lucide-react icons, PWA-ready

---

## 1. Run the website locally
```bash
npm install
npm run dev
```
Open http://localhost:5173/

> On Windows PowerShell, if `npm` is blocked, use `& npm.cmd run dev`.

The public site works fully offline. The **admin dashboard** (`/#admin`) needs the D1 backend,
which runs on Cloudflare (or locally via `wrangler pages dev`).

---

## 2. Set up the database (one time)

Install Wrangler and log in:
```bash
npm install -g wrangler
wrangler login
```

Create the D1 database:
```bash
wrangler d1 create uos-db
```
Copy the returned `database_id` into **wrangler.toml** (replace `REPLACE_WITH_YOUR_D1_DATABASE_ID`).

Create the tables:
```bash
wrangler d1 execute uos-db --file=./schema.sql --remote
```

---

## 3. Deploy to Cloudflare Pages
1. Push this repo to GitHub (already connected).
2. Cloudflare dashboard -> **Workers & Pages** -> **Create** -> **Pages** -> **Connect to Git**.
3. Select the repository. Build settings:
   - **Framework preset:** Vite
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. After the first deploy, open the project **Settings**:
   - **Functions -> D1 database bindings:** add binding **`DB`** -> database **`uos-db`**.
   - **Environment variables** (Production):
     - `ADMIN_PASSWORD` = a strong password for the dashboard login
     - `OWNER_WHATSAPP` = `917758952601` (optional, for notifications)
     - `WA_API_URL` and `WA_API_TOKEN` = optional, only if you connect a WhatsApp API
5. Redeploy. Done.

---

## 4. Using the dashboard
- Open your site and click **"Owner Login"** in the footer, or go to `yoursite.com/#admin`.
- Enter the `ADMIN_PASSWORD`.
- Sections: Dashboard, New Bill (POS), Enquiry List, Work Manager, Customers, Expenses & Finance, Reports.
- Every request a customer submits on **"Request a Service"** is saved to the database and shows up
  instantly in **Enquiry List** (and, if configured, sends a WhatsApp notification).

### SMS notifications (bank-style text messages)
Customers get short SMS (like bank messages) for: enquiry confirmation, reminders, and thank-you
after a bill/work is done. This needs an SMS gateway. Set these env vars in Cloudflare:

**Fast2SMS (India, easy):**
- `SMS_PROVIDER` = `fast2sms`
- `SMS_API_KEY` = your Fast2SMS API key

**MSG91 (DLT template based):**
- `SMS_PROVIDER` = `msg91`
- `SMS_API_KEY` = MSG91 auth key
- `SMS_SENDER` = 6-char sender/header id
- `SMS_TEMPLATE` = approved DLT template id

**Generic gateway:**
- `SMS_API_URL` = POST endpoint receiving `{ to, message }`
- `SMS_API_KEY` = bearer token

> India: SMS requires DLT registration + approved templates (TRAI rule). Until an SMS gateway is
> configured, the dashboard falls back to opening WhatsApp with the message. All data is still saved.

---

## Local full-stack testing (optional)
Run the site + functions + local D1 together:
```bash
npm run build
wrangler pages dev dist --d1 DB=uos-db
```
Apply schema locally first: `wrangler d1 execute uos-db --file=./schema.sql --local`

---

## Editing content
- Business details (phone, address, timing): `src/config.js`
- Services, fees, documents, process: `src/data/services.js`
- Government schemes: `src/data/schemes.js`
- Official portals: `src/data/portals.js`
- Reviews: `src/data/reviews.js`
- UI translations (EN/HI/MR): `src/data/translations.js`
- Database schema: `schema.sql`
- Backend API: `functions/api/*.js`
