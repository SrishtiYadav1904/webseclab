# WebSecLab — Interactive Web Application Security Virtual Lab

[![Build Status](https://img.shields.io/badge/Build-Passing-emerald?style=flat-square)](https://github.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-cyan?style=flat-square&logo=react)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20%2B%20RLS-3ecf8e?style=flat-square&logo=supabase)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-violet?style=flat-square)](LICENSE)

**WebSecLab** is a cybersecurity education platform and virtual laboratory designed for university students, educators, and application security engineers. It features 8 interactive, browser-sandboxed security laboratories, deterministic challenge validators, side-by-side code comparisons, automated scanner simulations (Nikto, OWASP ZAP, Burp Suite), practice quizzes, an instructor cohort portal, and a final certification examination.

---

## Table of Contents

1. [Features](#features)
2. [Virtual Laboratory Modules](#virtual-laboratory-modules)
3. [Architecture & Technology Stack](#architecture--technology-stack)
4. [Quick Start (Local Development)](#quick-start-local-development)
5. [Automatic Demo Mode](#automatic-demo-mode)
6. [Supabase Database & Authentication Setup](#supabase-database--authentication-setup)
7. [Running Automated Tests](#running-automated-tests)
8. [Free Deployment Guide (Vercel + Supabase)](#free-deployment-guide-vercel--supabase)
9. [Optional Local Docker Practice Lab](#optional-local-docker-practice-lab)
10. [Security & Ethical Guidelines](#security--ethical-guidelines)
11. [Troubleshooting & FAQ](#troubleshooting--faq)

---

## 1. Features

- **8 Interactive Hands-On Labs:** Step through real-world scenarios covering the OWASP Top 10.
- **Deterministic Challenge Validation:** Points and completions are awarded only when students verify intended mitigations.
- **Dual Mode State (Supabase + Zero-Config Demo Mode):** Run completely offline or with LocalStorage persistence without needing any API keys, or connect Supabase for cross-device cloud persistence.
- **Interactive Security Tool Simulator:** Run commands in an allowlisted terminal using Nikto and OWASP ZAP, and inspect/tamper with HTTP parameters in a simulated Burp Suite proxy.
- **Side-by-Side Code Diffs:** Inspect vulnerable vs secure source code with line-by-line syntax explanations.
- **Contextual Hint System:** Tiered hints with point penalties to foster independent problem solving.
- **Gamification & Badges:** Earn XP and unlock badges (*First Blood*, *SQL Defender*, *XSS Slayer*, *Session Sentinel*, *Tool Master*, *Pentester Elite*).
- **Practice Quizzes & Final Exam:** Topic-wise assessments plus a 15-minute timed certification exam generating a printable certificate of completion.
- **Instructor & Faculty Portal:** Monitor cohort progress, analyze topic deficiencies, and export aggregate CSV reports.

---

## 2. Virtual Laboratory Modules

| # | Lab Module | Category | Difficulty | XP Points | Primary Defenses Taught |
|---|---|---|---|---|---|
| **01** | **Cross-Site Scripting (XSS)** | XSS | Beginner | 100 | Reflected/DOM XSS, `textContent`, Contextual Output Encoding, CSP |
| **02** | **SQL Injection (SQLi)** | SQL Injection | Intermediate | 125 | String Concatenation Breakdown, Parameterized Queries (`$1, $2`), Prepared Statements |
| **03** | **Cross-Site Request Forgery (CSRF)** | CSRF | Intermediate | 110 | Synchronizer Anti-CSRF Tokens, `SameSite=Strict/Lax`, Origin Validation |
| **04** | **Authentication & Session Security** | Authentication | Intermediate | 110 | `HttpOnly`, `Secure`, `SameSite`, Session Expiration, Argon2id Password Hashing |
| **05** | **Broken Access Control & IDOR** | Access Control | Intermediate | 120 | Direct Object References, Server-Side Tenant Authorization, Horizontal Escalation |
| **06** | **File Upload Security** | File Security | Intermediate | 115 | Extension Allowlists, Binary Magic Byte Verification, UUID Renaming, Isolated Storage |
| **07** | **Security Headers & HTTPS** | Security Headers | Beginner | 95 | HSTS (`max-age=31536000`), CSP Directives, `X-Content-Type-Options: nosniff`, Frame Protections |
| **08** | **Scanning with Nikto, ZAP & Burp** | Security Tools | Advanced | 130 | CLI Scanning, True vs False Positive Triage, HTTP Interception & Parameter Tampering |

---

## 3. Architecture & Technology Stack

```
WebSecLab/
├── src/
│   ├── components/        # Reusable UI & Navbar/Footer
│   │   └── sandboxes/     # 8 Isolated virtual laboratory engines
│   ├── context/           # AuthContext (Supabase + Demo) & ProgressContext (XP + Badges)
│   ├── data/              # Curated lab definitions, hints, code diffs & quiz questions
│   ├── lib/               # Supabase client initializer with demo fallback detection
│   ├── pages/             # Landing, Catalogue, Workspace, Dashboard, Quizzes, Instructor
│   ├── test/              # Vitest & React Testing Library automated test suites
│   └── types/             # Strict TypeScript domain interfaces
├── supabase/
│   ├── migrations/        # PostgreSQL schema with Row Level Security (RLS)
│   └── seed.sql           # Database initial seeds
├── docker-compose.yml     # Optional local isolated Juice Shop & DVWA containers
└── vercel.json            # Free hosting SPA rewrite fallback configuration
```

### Stack Details
- **Frontend:** React 19, TypeScript, Vite, React Router, Tailwind CSS v4, Lucide React, Canvas Confetti.
- **Backend / Persistence:** Supabase PostgreSQL with Row Level Security (RLS) policies + LocalStorage fallback.
- **Testing:** Vitest, React Testing Library, JSDOM.

---

## 4. Quick Start (Local Development)

### Prerequisites
- **Node.js:** v18.0.0 or higher (v22+ recommended)
- **npm:** v9.0.0 or higher

### Installation Commands

#### Windows (PowerShell)
```powershell
# Clone the repository
git clone https://github.com/<your-username>/webseclab.git
cd webseclab

# Install dependencies
npm install

# Start local Vite development server
npm run dev
```

#### macOS / Linux (Bash)
```bash
# Clone the repository
git clone https://github.com/<your-username>/webseclab.git
cd webseclab

# Install dependencies
npm install

# Start local Vite development server
npm run dev
```

Open your browser to `http://localhost:5173`. The application will immediately launch in **Demo Mode** with full interactivity!

---

## 5. Automatic Demo Mode

WebSecLab does **not** force users or evaluators to create external cloud accounts before testing.

- If `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are not provided in `.env`, WebSecLab automatically activates **Local Demo Mode**.
- Progress, completed labs, earned badges, and quiz attempts are persisted reliably to your browser's `localStorage`.
- Includes one-click demo personas:
  - **Demo Student:** Alex Vance (Security Apprentice, 210 XP)
  - **Demo Instructor:** Dr. Evelyn Reed, CISSP (Lead AppSec Faculty, access to student roster and export tools)

---

## 6. Supabase Database & Authentication Setup

To enable multi-user cloud authentication and PostgreSQL persistence:

1. Create a free project at [supabase.com](https://supabase.com).
2. In the Supabase Dashboard, go to **SQL Editor** and run the migration script:
   - File: `supabase/migrations/20261020000000_initial_schema.sql`
3. In the SQL Editor, run the seed script:
   - File: `supabase/seed.sql`
4. Copy your project credentials from **Project Settings -> API**:
   - `Project URL`
   - `anon public key`
5. Create a `.env` file in the project root:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
6. Restart the development server (`npm run dev`). WebSecLab will automatically detect the credentials and switch to cloud-persisted mode with full Row Level Security (RLS) enforcement.

---

## 7. Running Automated Tests

WebSecLab includes automated test coverage for lab definitions, assessment questions, interactive sandboxes, and application navigation:

```bash
# Run complete automated test suite
npm run test

# Run tests in watch mode
npm run test:watch

# Validate TypeScript and production build
npm run build
```

---

## 8. Free Deployment Guide (Vercel + Supabase)

WebSecLab can be deployed on 100% free hosting tiers:

### Frontend on Vercel Free Tier
1. Push your repository to GitHub.
2. Sign in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your `webseclab` GitHub repository.
4. Framework Preset: **Vite** (auto-detected).
5. (Optional) In **Environment Variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   *(If omitted, Vercel will deploy WebSecLab in full Local Demo Mode).*
6. Click **Deploy**. Vercel will build and assign a free HTTPS URL (e.g., `https://webseclab.vercel.app`).
   *Note: `vercel.json` is pre-configured to ensure clean client-side routing across all lab paths.*

---

## 9. Optional Local Docker Practice Lab

For advanced students wanting hands-on practice with intentionally vulnerable enterprise applications (OWASP Juice Shop & DVWA) in an isolated local container:

```bash
# Start isolated containers (bound exclusively to loopback 127.0.0.1)
docker compose up -d

# Verify running containers
docker compose ps
```
- **OWASP Juice Shop:** `http://127.0.0.1:3000`
- **DVWA:** `http://127.0.0.1:8080` (Default credentials: `admin` / `password`)

To shut down and remove containers:
```bash
docker compose down
```

---

## 10. Security & Ethical Guidelines

- **Strict Educational Isolation:** Public browser exercises simulate vulnerabilities locally without connecting to live databases or executing external shell scripts.
- **No Real Targeting:** Never use automated scanners or payloads against unauthorized targets.
- See [SECURITY.md](SECURITY.md) for full isolation boundary documentation and responsible disclosure policies.

---

## 11. Troubleshooting & FAQ

**Q: Why does the app say "DEMO MODE ACTIVE"?**  
A: This is an intended feature! When Supabase keys are not present, WebSecLab uses `localStorage` so students can test every lab and feature without setup delays.

**Q: How do I test the Instructor Portal?**  
A: Click **"Demo Instructor"** in the top navigation bar or log in with role `instructor` to access cohort analytics, student roster, and CSV export tools.

**Q: How do I reset my progress to replay exercises?**  
A: Go to **Profile** (`/profile`) and click **"Reset Progress"**, or click **"Reset Lab"** inside any individual lab workspace.

---

## License

Distributed under the MIT License. Built for university cybersecurity education.
