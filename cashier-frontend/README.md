<div align="center">

# Cashier Frontend · Hardware Retail POS

Modern, blazing-fast billing for Aasha Hardware — built with React 19, Vite 7, Tailwind CSS 4, Chart.js, and jsPDF.

[![Built with Vite](https://img.shields.io/badge/Built%20with-Vite-646CFF?logo=vite&logoColor=fff)](https://vitejs.dev/) [![React](https://img.shields.io/badge/React-19-00D8FF?logo=react&logoColor=fff)](https://react.dev/) [![Tailwind](https://img.shields.io/badge/Tailwind-4.x-38bdf8?logo=tailwindcss&logoColor=fff)](https://tailwindcss.com/) [![Chart.js](https://img.shields.io/badge/Charts-Chart.js-f87171?logo=chartdotjs&logoColor=fff)](https://www.chartjs.org/) [![jsPDF](https://img.shields.io/badge/PDF-jsPDF-111827)](https://github.com/parallax/jsPDF)

</div>

## ✨ Highlights

- Sales flow that feels like a real counter: search by custom product ID, tap-to-add cart, live totals, GST slider, and one-click Estimation/Tax Invoice PDFs.
- Inventory cockpit: add/update by Product ID, auto-detect existing items, stock deltas, low-stock badges, and quick refresh.
- Cashier productivity: keyboard-friendly inputs, persistent GST rate, customer capture (name/phone/email/address), and printable receipts sized for A5.
- Insights ready: dashboard tiles plus sales, transactions, and custom reports backed by the API; Chart.js visuals for snapshots.
- Secure by default: login powered by the backend `Bearer` token; Axios interceptor keeps requests authenticated.

## 🚀 Quickstart

```bash
# 1) Install deps (Node 18+ recommended)
npm install

# 2) Run dev server
npm run dev

# 3) Build for production
npm run build
```

Open the dev URL shown in the terminal. The app expects the backend to be running at `http://localhost:9090/api` (see API config below).

## 🧭 What you can do

- **Bill faster:** Search by Product ID, add to cart, tweak quantities, capture customer details, and generate Estimation or Tax Invoice PDFs via jsPDF.
- **Control inventory:** Add new SKUs, auto-merge stock when an ID already exists, edit products, and delete items with confirmation.
- **Watch the floor:** See total/available/low/out-of-stock counts at a glance; refresh inventory with one click.
- **See the story:** Navigate tabs for Sales/Billing, Inventory, Sales Reports, and Custom Reports from the dashboard shell.

## 🛠️ Stack

- React 19 + Vite 7
- Tailwind CSS 4
- React Router DOM 7
- Chart.js 4 via React-Chartjs-2
- jsPDF for A5 Estimation/Invoice exports
- Axios with auth interceptor

## ⚙️ API & configuration

- Backend base URL lives in [src/api/api.js](src/api/api.js) (`API_BASE_URL`). Change it if your server runs elsewhere.
- Auth: `POST /auth/login` should return `{ token, name, ... }`; the token is stored in `localStorage` and sent as `Authorization: Bearer <token>` for every request.
- Core endpoints used:
	- `GET/POST/PUT/DELETE /items` (plus `/items/by-custom/:id`, `/items/low-stock`, `/items/category/:category`)
	- `POST /bills`, `POST /bills/from-cart`, `GET /bills`, `GET /bills/date-range`
	- `POST /bills/:id/refund`, `POST /bills/:billId/refund-items`
	- `GET/POST/PUT/DELETE /customers`, `GET /customers/search`, `GET /customers/phone/:phone`

## 🧪 Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build |
| `npm run preview` | Serve the build locally |
| `npm run lint` | ESLint (React/Tailwind aware) |

## 🗂️ Project layout

```
src/
	api/            # Axios client + endpoints
	components/     # Reusable UI (e.g., ProtectedRoute)
	pages/          # Login, Dashboard, Sales, Products, Reports, CustomReport
	hooks/          # Auth state management
	utils/          # Helpers (categories, formatting)
	App.jsx         # Routing shell
	main.jsx        # Entry point
```

## 🧭 Feature tour (fast)

- **Dashboard shell:** Auth-gated routes, welcome banner, logout button, and tabbed navigation for all modules.
- **Sales/Billing:** Cart with quantity controls, subtotal + GST calculation, customer capture, Estimation/Tax Invoice A5 PDFs sized for thermal/desk printers.
- **Inventory:** Product cards showing total/available/low/out-of-stock; smart add/update by Product ID to avoid duplicates; edit/delete with confirmations.
- **Reports:** Sales/transactions/custom reports hitting backend endpoints; chart-ready data with Chart.js.

## 🎨 Make it yours

- Update shop branding and footer text inside the PDF generators in [src/pages/SalesPage.jsx](src/pages/SalesPage.jsx).
- Tweak colors/spacing in [src/index.css](src/index.css) and any Tailwind classes inside the page components.

## 🤝 Contributing / forking

- Fork, install, and point `API_BASE_URL` to your backend.
- Keep PRs small: UI-only, data, or PDF template changes are great starters.

## ✅ Checklist before you ship

- Backend running on `localhost:9090/api` (or update `API_BASE_URL`).
- Can login with valid creds.
- Add an item, add to cart, generate both Estimation and Tax Invoice PDFs.
- Run `npm run build` and `npm run preview` to smoke-test the production bundle.
