import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Terminal, 
  Award, 
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { LABS } from '../data/labs';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const { loginDemoStudent } = useAuth();
  const featuredLabs = LABS.slice(0, 4);

  return (
    <div className="space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-16 overflow-hidden">
        {/* Glow Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-cyan-500/10 via-blue-600/10 to-violet-600/10 blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-800/40 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>Next-Gen Cybersecurity Virtual Training Platform</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
              Master Web Application Security Through <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">Interactive Hands-On Labs</span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Designed specifically for college students and aspiring penetration testers. Understand vulnerability mechanics, test realistic attack vectors, and implement verified secure remediations in browser-sandboxed virtual environments.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/labs"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition"
              >
                <Terminal className="w-4 h-4 fill-current" />
                <span>Explore All Virtual Labs</span>
              </Link>

              <button
                onClick={loginDemoStudent}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-white font-semibold text-sm flex items-center justify-center gap-2 transition"
              >
                <span>Instant Demo Mode (No Setup)</span>
                <ArrowRight className="w-4 h-4 text-cyan-400" />
              </button>
            </div>
          </div>

          {/* Hero Visual Mockup: Simulated Security Operations Console */}
          <div className="mt-16 max-w-5xl mx-auto rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden">
            {/* Console Header */}
            <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                <span className="text-xs font-mono text-slate-400 ml-2">webseclab-v2.0-virtual-engine</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono text-cyan-400">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  SANDBOX: ISOLATED
                </span>
                <span className="text-slate-600">|</span>
                <span>STATUS: READY</span>
              </div>
            </div>

            {/* Console Code Preview */}
            <div className="p-6 font-mono text-xs text-slate-300 space-y-3 bg-black/60">
              <div className="flex items-center gap-2 text-cyan-400">
                <span className="text-slate-500">appsec@webseclab:~$</span>
                <span>curl -s -X POST https://lab.target/api/login -d &quot;user=admin&apos; --&quot;</span>
              </div>
              <div className="text-amber-300">
                [*] Intercepted SQL token stream: Tokenizer detected premature quote termination
              </div>
              <div className="text-rose-400 bg-rose-950/30 p-2.5 rounded border border-rose-900/40">
                [-] VULNERABILITY DETECTED: String Concatenation in query builder allowed authentication bypass.
              </div>
              <div className="text-emerald-400 bg-emerald-950/30 p-2.5 rounded border border-emerald-900/40">
                [+] DEFENSE VERIFIED: Parameterized query ($1, $2) compiled successfully. Attack negated.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Statistics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 sm:p-8">
          <div className="space-y-1 text-center sm:text-left">
            <div className="text-3xl font-black font-mono text-cyan-400">8 Labs</div>
            <div className="text-xs text-slate-400">Full Interactive Modules</div>
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <div className="text-3xl font-black font-mono text-blue-400">100%</div>
            <div className="text-xs text-slate-400">Client-Side Sandboxed</div>
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <div className="text-3xl font-black font-mono text-violet-400">OWASP Top 10</div>
            <div className="text-xs text-slate-400">Industry-Standard Coverage</div>
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <div className="text-3xl font-black font-mono text-emerald-400">Zero Risk</div>
            <div className="text-xs text-slate-400">Safe Educational Simulations</div>
          </div>
        </div>
      </section>

      {/* Featured Labs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">Hands-On Practice</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">Featured Virtual Lab Scenarios</h2>
          </div>
          <Link to="/labs" className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
            <span>Browse All 8 Labs</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredLabs.map(lab => (
            <div
              key={lab.id}
              className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-xl p-5 flex flex-col justify-between space-y-4 transition group hover:shadow-xl hover:shadow-cyan-500/5"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-cyan-400">{lab.category}</span>
                  <span className="text-slate-500">{lab.difficulty}</span>
                </div>
                <h3 className="font-bold text-white text-base group-hover:text-cyan-300 transition">{lab.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">{lab.summary}</p>
              </div>

              <Link
                to={`/lab/${lab.slug}`}
                className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-white text-xs font-semibold text-center block transition"
              >
                Start Lab (+{lab.points} XP)
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Learning Roadmap */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">Structured Curriculum</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">The WebSecLab Learning Roadmap</h2>
          <p className="text-xs text-slate-400">Step through beginner fundamentals to advanced penetration testing tool exercises.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Phase 1 */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold font-mono">
              01
            </div>
            <h3 className="text-lg font-bold text-white">Foundations & Injections</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Explore how unescaped inputs break execution semantics. Master Cross-Site Scripting (XSS) and SQL Injection (SQLi) with prepared statements.
            </p>
            <ul className="text-xs text-slate-300 space-y-1 font-mono pt-2 border-t border-slate-800">
              <li>✓ Reflected & DOM XSS</li>
              <li>✓ SQL Query Concatenation</li>
              <li>✓ Contextual Output Encoding</li>
            </ul>
          </div>

          {/* Phase 2 */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold font-mono">
              02
            </div>
            <h3 className="text-lg font-bold text-white">Authentication & Access Control</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Understand session cookies, HttpOnly flags, CSRF tokens, and Insecure Direct Object References (IDOR) in modern multi-tenant REST APIs.
            </p>
            <ul className="text-xs text-slate-300 space-y-1 font-mono pt-2 border-t border-slate-800">
              <li>✓ CSRF Synchronizer Tokens</li>
              <li>✓ Cookie Security Flags</li>
              <li>✓ Object-Level Authorization</li>
            </ul>
          </div>

          {/* Phase 3 */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center font-bold font-mono">
              03
            </div>
            <h3 className="text-lg font-bold text-white">Headers & Scanner Tools</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enforce CSP and HSTS headers, harden file uploads against web shells, and practice vulnerability scanning with Nikto, OWASP ZAP, and Burp Suite.
            </p>
            <ul className="text-xs text-slate-300 space-y-1 font-mono pt-2 border-t border-slate-800">
              <li>✓ CSP & Anti-Clickjacking</li>
              <li>✓ File Magic Bytes Validation</li>
              <li>✓ Automated Scanning & Interception</li>
            </ul>
          </div>
        </div>
      </section>

      {/* How the Virtual Lab Engine Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 sm:p-12 space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">Under The Hood</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Safe, Isolated, and Deterministic Virtual Labs</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Traditional vulnerable VMs consume massive resources and present severe network security hazards. WebSecLab runs completely contained within the student&apos;s browser using client-side execution mocks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800/80 space-y-3">
              <ShieldCheck className="w-6 h-6 text-cyan-400" />
              <h4 className="text-sm font-bold text-white">No Public Exposure</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Vulnerable endpoints are simulated locally. No real databases or servers are exposed to the public internet.
              </p>
            </div>

            <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800/80 space-y-3">
              <RotateCcw className="w-6 h-6 text-blue-400" />
              <h4 className="text-sm font-bold text-white">Deterministic & Repeatable</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Made a mistake? Reset any exercise to its pristine state with a single click. Retry without breaking environments.
              </p>
            </div>

            <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800/80 space-y-3">
              <Award className="w-6 h-6 text-violet-400" />
              <h4 className="text-sm font-bold text-white">Granular Validation & Scoring</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Points are awarded based on actual challenge validation rather than dummy button clicks. Earn badges for genuine mastery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-cyan-950/60 via-slate-900 to-violet-950/60 border border-cyan-500/30 rounded-3xl p-8 sm:p-12 text-center space-y-6">
          <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
            Start Your AppSec Defense Journey Today
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Join students learning web application security. Explore 8 interactive labs, take practice quizzes, and earn your certificate of completion.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/25 transition"
            >
              Create Free Account
            </Link>
            <Link
              to="/dashboard"
              className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-semibold text-sm transition"
            >
              Continue as Guest
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
