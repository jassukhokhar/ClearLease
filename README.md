<div align="center">

# 🛡️ ClearLease

**Understand Your Lease Before You Sign**

AI-powered lease risk analysis — surfaces hidden fees, unfair clauses, and landlord-favored language so you never sign blind.

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-44cc11?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini-4285F4?style=flat-square&logo=google)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

**🌐 Live Demo:** _[Coming Soon](#)_

</div>

---

## ✨ Features

- **📤 PDF Upload** — Drag-and-drop lease upload (PDF, up to 10 MB) with animated processing states
- **🤖 AI Clause Analysis** — Google Gemini flags risky clauses with plain-English translations and actionable recommendations
- **🧮 Risk Scoring** — Weighted 0–100 risk score with `SAFE` / `MODERATE RISK` / `HIGH RISK` labels
- **📄 Split-Screen Review** — PDF viewer alongside the analysis panel with clause-to-page navigation and severity filters
- **💬 AI Lease Assistant** — Chat with your lease — ask what any clause means, with full conversation memory
- **📝 Negotiation Letters** — Generate ready-to-send emails to your landlord in multiple tones (polite, formal, friendly, assertive)
- **⚖️ Lease Comparison** — Compare two leases side by side across 7 dimensions with an AI verdict on which is safer
- **📊 Analytics Dashboard** — Risk trends, common risk categories, recent conversations, and comparison history
- **📥 PDF Report Export** — Download a professional branded risk report with executive summary and recommendations
- **🔐 Secure Auth** — JWT in HTTP-only cookies, bcrypt password hashing, rate limiting, Helmet security headers
- **🎨 Dark Mode & Responsive** — Fully responsive UI with dark mode, Framer Motion animations, and code-split routes

> ⚖️ **Disclaimer:** ClearLease provides informational analysis, **not legal advice**. Consult a licensed attorney for binding legal decisions.

---

## 🧰 Tech Stack

**Frontend:** React 18 · Vite · Tailwind CSS · Zustand · React Router DOM · Framer Motion · React PDF · React Dropzone · React Hook Form · Axios · Lucide Icons

**Backend:** Node.js · Express · MongoDB · Mongoose · Google Gemini (`@google/genai`) · JWT · bcryptjs · Multer · pdf-parse · PDFKit · Helmet · express-rate-limit · express-validator

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or [Atlas](https://www.mongodb.com/atlas))
- [Google Gemini API Key](https://aistudio.google.com/app/apikey)

### Install & Run

```bash
# Clone & install
git clone https://github.com/yourusername/clearlease.git
cd clearlease
npm run install:all

# Set up environment variables
# Copy .env.example → .env in both /backend and /frontend, then fill in your values

# Run (two terminals)
npm run dev:backend    # http://localhost:5000
npm run dev:frontend   # http://localhost:5173
```

> Vite proxies `/api` and `/uploads` to the backend so cookies stay same-origin in development.

---

## 🧠 How It Works

```
Upload PDF → Extract text → AI analysis (Gemini) → Risk scoring → Save to DB → Review & act
```

1. **Upload** — Multer validates and stores the PDF
2. **Extract** — `pdf-parse` pulls plain text from the document
3. **Analyze** — Gemini identifies risky clauses and returns structured JSON
4. **Score** — Weighted scoring (HIGH=10, MEDIUM=5, LOW=1), normalized to 0–100
5. **Review** — Split-screen PDF + analysis, chat with AI, compare leases, generate negotiation letters, export reports

---

## 🚀 Deployment

**Backend** (Render / Railway): Set env vars, use `NODE_ENV=production`, `CLIENT_URL=<frontend-origin>`, start with `npm start`.

**Frontend** (Vercel / Netlify): Build with `npm run build`, output dir `dist`, set `VITE_API_URL` to your backend API URL.

> ⚠️ Uploaded PDFs use local disk storage. For production, swap to S3 or Cloudinary.

---

## 🔮 Roadmap

- [ ] OCR for scanned PDFs
- [ ] Jurisdiction-aware legal rules
- [ ] Cloud file storage (S3)
- [ ] Stripe billing for Pro tier
- [ ] Multi-language support

---

<div align="center">

Built with MERN + Google Gemini · **© ClearLease**

</div>
