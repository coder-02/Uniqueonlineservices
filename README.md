# Unique Online Services

A modern React (Vite) website for **Unique Online Services** - a digital service center offering
Aadhaar, PAN, Passport, Banking, Insurance, FASTag, Government Schemes and more, with a built-in
AI assistant, scheme eligibility checker, fee estimator and an official government portals hub.

## Tech stack
- React 18 + Vite
- lucide-react icons
- Fully client-side (no backend), PWA-ready

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:5173/

> On Windows PowerShell, if `npm` is blocked by execution policy, use `& npm.cmd run dev`.

## Build for production
```bash
npm run build
```
Output goes to the `dist/` folder.

## Deploy to Cloudflare Pages
1. Push this repo to GitHub.
2. In the Cloudflare dashboard: **Workers & Pages -> Create -> Pages -> Connect to Git**.
3. Select this repository.
4. Set build settings:
   - **Framework preset:** Vite
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
5. Deploy. Cloudflare will build and host the site.

SPA routing and caching are handled by `public/_redirects` and `public/_headers`.

## Editing content
- Business details (phone, address, timing): `src/config.js`
- Services, fees, documents, process: `src/data/services.js`
- Government schemes: `src/data/schemes.js`
- Official portals: `src/data/portals.js`
- Reviews: `src/data/reviews.js`
- UI translations (EN/HI/MR): `src/data/translations.js`
