import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Terminal, ExternalLink, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 mt-20 text-slate-400 text-sm">
      {/* Safety Banner */}
      <div className="bg-slate-900/60 border-b border-slate-800/80 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-start sm:items-center gap-3 text-xs text-amber-300/90 font-mono">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
          <p>
            <strong className="text-amber-200">ETHICAL NOTICE:</strong> WebSecLab is strictly an educational cyber training platform. All vulnerability scenarios run inside browser simulations and isolated mock endpoints. Performing unauthorized attacks against systems you do not own is illegal under international computer misuse laws.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Terminal className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white">
                Web<span className="text-cyan-400">Sec</span>Lab
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Interactive Web Application Security Virtual Lab engineered for university students and security engineers to master modern application defense.
            </p>
            <div className="text-xs font-mono text-cyan-500/80">
              v1.0.0 • Open Source Educational Lab
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 mb-3 font-semibold">
              Lab Modules
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/lab/cross-site-scripting" className="hover:text-cyan-400 transition">Cross-Site Scripting (XSS)</Link></li>
              <li><Link to="/lab/sql-injection" className="hover:text-cyan-400 transition">SQL Injection (SQLi)</Link></li>
              <li><Link to="/lab/cross-site-request-forgery" className="hover:text-cyan-400 transition">CSRF Protection</Link></li>
              <li><Link to="/lab/authentication-and-session-security" className="hover:text-cyan-400 transition">Session & Cookie Security</Link></li>
              <li><Link to="/lab/broken-access-control-idor" className="hover:text-cyan-400 transition">IDOR & Access Control</Link></li>
              <li><Link to="/lab/web-server-scanning-tools" className="hover:text-cyan-400 transition">Nikto, ZAP & Burp Suite</Link></li>
            </ul>
          </div>

          {/* AppSec Standards */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 mb-3 font-semibold">
              Standards & Resources
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="https://owasp.org/Top10/" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition flex items-center gap-1">
                  <span>OWASP Top 10 (2021)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://cwe.mitre.org/top25/" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition flex items-center gap-1">
                  <span>CWE Top 25 Most Dangerous</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://cheatsheetseries.owasp.org/" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition flex items-center gap-1">
                  <span>OWASP Cheat Sheet Series</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://portswigger.net/web-security" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition flex items-center gap-1">
                  <span>Web Security Academy</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Access */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 mb-3 font-semibold">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/dashboard" className="hover:text-cyan-400 transition">Student Dashboard</Link></li>
              <li><Link to="/labs" className="hover:text-cyan-400 transition">All Labs Catalogue</Link></li>
              <li><Link to="/quiz" className="hover:text-cyan-400 transition">Practice Quizzes</Link></li>
              <li><Link to="/final-assessment" className="hover:text-cyan-400 transition">Final Certification Exam</Link></li>
              <li><Link to="/instructor" className="hover:text-cyan-400 transition">Instructor Analytics</Link></li>
              <li><Link to="/profile" className="hover:text-cyan-400 transition">Student Badges & Profile</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-900 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <div>
            © 2026 WebSecLab. Built for cybersecurity education.
          </div>
          <div className="flex items-center gap-1 mt-2 sm:mt-0">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for the next generation of cybersecurity defenders.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
