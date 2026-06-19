# 📊 JobTrack — Track Your Job Search

A full-stack job application tracker with **AI-powered Gmail sync** —
automatically detects job-related emails and logs them to your dashboard.

🌐 **Live:** Coming soon

---

## ✨ Features

- 🔐 Google Sign-In authentication (NextAuth)
- ➕ Add job applications manually (company, role, date, source, status)
- 📊 Live dashboard with stats — total applications, response rate, offers
- 🥧 Status breakdown pie chart (Recharts)
- 🎯 Inline status updates — click and change status instantly, no page reload
- 🤖 **AI Gmail Sync** — scans your inbox for job-related emails and
  automatically extracts company name, role, and application status
  using Google's Gemini AI
- 🎨 Clean, modern UI built with Tailwind CSS

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), React, TypeScript, Tailwind CSS |
| Backend | Next.js Server Actions |
| Database | PostgreSQL (Neon) |
| ORM | Prisma 5 |
| Auth | NextAuth.js (Google OAuth) |
| AI | Google Gemini API (gemini-2.5-flash-lite) |
| Email | Gmail API |
| Charts | Recharts |
| Hosting | Vercel |

---

## 🤖 How the AI Gmail Sync Works

User clicks "Sync Gmail"

↓

Gmail API searches inbox for job-related keywords

("thank you for applying", "interview", "unfortunately", etc.)

↓

Each matching email is sent to Gemini AI with a structured prompt

↓

Gemini extracts: company name, role title, and application status

↓

New applications are saved to the database

(duplicates are automatically skipped)

↓

Dashboard updates instantly with the new entries

---

## 🚀 How to Run Locally

```bash
# Clone the repo
git clone https://github.com/cheenusrinivas/JobTracker.git
cd JobTracker

# Install dependencies
npm install

# Set up environment variables (see below)
cp .env.example .env

# Push the database schema
npx prisma db push

# Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables Required
DATABASE_URL=

AUTH_GOOGLE_ID=

AUTH_GOOGLE_SECRET=

AUTH_SECRET=

GEMINI_API_KEY=

---

## 📁 Project Structure

jobtrack/

├── app/

│   ├── page.tsx                  # Landing page

│   ├── signin/page.tsx           # Custom sign-in page

│   ├── dashboard/

│   │   ├── page.tsx              # Main dashboard

│   │   ├── actions/              # Server actions (DB writes, Gmail sync)

│   │   └── components/           # Chart, status dropdown, sync button

│   └── api/auth/[...nextauth]/   # NextAuth handler

├── components/                   # Shared Navbar, Footer

├── lib/auth.ts                   # NextAuth configuration

└── prisma/schema.prisma          # Database schema

---

## 📚 What I Learned

- Building full-stack apps with Next.js Server Actions (no separate API needed)
- Database-backed authentication with NextAuth + Prisma
- Integrating third-party APIs (Gmail) with OAuth scopes
- Prompt engineering for structured data extraction with LLMs
- Handling AI API rate limits and retry logic
- Data visualization with Recharts

---

## 👨‍💻 Author

**Srinivas Udhayasankar**
- 🌐 [Portfolio](https://srinivasudhayasankarportfolio.netlify.app)
- 💼 [LinkedIn](https://linkedin.com/in/srinivas-udhayasankar)
- 🐙 [GitHub](https://github.com/cheenusrinivas)
