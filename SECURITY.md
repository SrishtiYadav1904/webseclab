# Security Policy: WebSecLab

## 1. Educational Safety & Containment Policy

WebSecLab is engineered as an interactive cybersecurity educational virtual laboratory for college students, educators, and application security learners.

### Containment Principles
- **Browser-Sandboxed Simulations:** All default public exercises (XSS, SQL Injection, CSRF, Cookie Tampering, IDOR, File Upload, Headers, Scanner Tools) run strictly within the client browser context or localized mock endpoints.
- **Zero Real Target Scanning:** The Nikto and OWASP ZAP exercises use curated sample outputs and deterministic heuristics. The application never performs arbitrary external scans or executes unrestricted command execution APIs.
- **No Production Database Injection:** Simulated SQL injection exercises test query string concatenation parsing using in-memory mock datasets. Deliberately vulnerable queries are never connected to the Supabase PostgreSQL production database.
- **Synthetic Data:** All users, records, patient files, and sessions used in educational exercises are completely fictional. Never submit real personal information or sensitive credentials.

---

## 2. Ethical Usage Agreement

By accessing and utilizing WebSecLab, you agree to:
1. Use the knowledge gained strictly for defensive purposes, academic research, and authorized security assessments.
2. Never employ these techniques, payloads, or automated tools against computer systems, networks, or applications without explicit written permission from the owner.
3. Respect international computer crime legislation (e.g., Computer Fraud and Abuse Act, UK Computer Misuse Act, and equivalent global statutes).

---

## 3. WebSecLab Application Security

WebSecLab itself follows rigorous secure development standards:
- **Authentication & RLS:** Enforced via Supabase Row Level Security (RLS) policies. Students can only read and modify their own records.
- **Safe Output Handling:** Framework-level JSX escaping and strict DOM APIs prevent self-XSS.
- **Environment Isolation:** Secrets and service-role keys are never included in frontend bundles. Only public anon keys are exposed.
- **Input Validation:** Strict typing and sanitization on all client-submitted forms.

---

## 4. Reporting Vulnerabilities

If you identify a genuine security vulnerability within WebSecLab's codebase, infrastructure, or deployment configuration, please report it responsibly:
- **Email:** `security@webseclab.internal` or open a private GitHub Security Advisory.
- **Response SLA:** The maintainers will acknowledge receipt within 48 hours and provide a remediation plan within 5 business days.
- Please do not disclose vulnerabilities publicly until an official patch has been deployed.
