import React, { useState } from 'react';
import { ShieldCheck, Play, RotateCcw, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';

interface SecurityHeadersSandboxProps {
  onComplete: (score: number) => void;
}

export const SecurityHeadersSandbox: React.FC<SecurityHeadersSandboxProps> = ({ onComplete }) => {
  const [headers, setHeaders] = useState({
    hsts: false,
    csp: false,
    xContentType: false,
    xFrameOptions: false,
    referrerPolicy: false
  });

  const [hasEvaluatedWeak, setHasEvaluatedWeak] = useState(false);
  const [hasAchievedAPlus, setHasAchievedAPlus] = useState(false);

  // Compute security score & grade
  const calculateScore = () => {
    let score = 20; // baseline F
    if (headers.hsts) score += 20;
    if (headers.csp) score += 25;
    if (headers.xContentType) score += 15;
    if (headers.xFrameOptions) score += 15;
    if (headers.referrerPolicy) score += 5;
    return score;
  };

  const currentScore = calculateScore();

  const getGrade = (pts: number) => {
    if (pts >= 95) return { grade: 'A+', color: 'text-emerald-400 bg-emerald-950 border-emerald-500' };
    if (pts >= 80) return { grade: 'A', color: 'text-emerald-300 bg-emerald-950/80 border-emerald-600' };
    if (pts >= 60) return { grade: 'B', color: 'text-cyan-400 bg-cyan-950 border-cyan-600' };
    if (pts >= 40) return { grade: 'C', color: 'text-amber-400 bg-amber-950 border-amber-600' };
    return { grade: 'F', color: 'text-rose-400 bg-rose-950 border-rose-600' };
  };

  const gradeInfo = getGrade(currentScore);

  const toggleHeader = (key: keyof typeof headers) => {
    setHeaders(prev => {
      const next = { ...prev, [key]: !prev[key] };
      const newScore = (next.hsts ? 20 : 0) + (next.csp ? 25 : 0) + (next.xContentType ? 15 : 0) + (next.xFrameOptions ? 15 : 0) + (next.referrerPolicy ? 5 : 0) + 20;
      if (newScore >= 95 && hasEvaluatedWeak) {
        setHasAchievedAPlus(true);
        onComplete(95);
      }
      return next;
    });
  };

  const handleTestHeaders = () => {
    if (currentScore <= 40) {
      setHasEvaluatedWeak(true);
    } else if (currentScore >= 95 && hasEvaluatedWeak) {
      setHasAchievedAPlus(true);
      onComplete(95);
    }
  };

  const handleReset = () => {
    setHeaders({
      hsts: false,
      csp: false,
      xContentType: false,
      xFrameOptions: false,
      referrerPolicy: false
    });
    setHasEvaluatedWeak(false);
  };

  return (
    <div className="space-y-6">
      {/* Exercise Instructions */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
        <h3 className="text-base font-semibold text-white flex items-center gap-2 mb-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          <span>Interactive Task: Audit HTTP Response Headers & Achieve Security Grade A+</span>
        </h3>
        <p className="text-sm text-slate-300 mb-2">
          1. <strong>Step 1:</strong> Click <em>Analyze Current Header Configuration</em> with default settings to inspect the initial failing Grade F.
        </p>
        <p className="text-sm text-slate-300 mb-3">
          2. <strong>Step 2:</strong> Configure all modern security headers (HSTS, CSP, nosniff, frame-ancestors, strict referrer) to reach Grade A+ and eliminate Clickjacking.
        </p>

        {/* Progress Tracker */}
        <div className="flex items-center gap-4 text-xs font-mono pt-2 border-t border-slate-800/80">
          <span className={`flex items-center gap-1.5 ${hasEvaluatedWeak ? 'text-emerald-400' : 'text-slate-500'}`}>
            <span className={`w-2 h-2 rounded-full ${hasEvaluatedWeak ? 'bg-emerald-400' : 'bg-slate-600'}`}></span>
            1. Audit Baseline Grade F
          </span>
          <span className={`flex items-center gap-1.5 ${hasAchievedAPlus ? 'text-emerald-400' : 'text-slate-500'}`}>
            <span className={`w-2 h-2 rounded-full ${hasAchievedAPlus ? 'bg-emerald-400' : 'bg-slate-600'}`}></span>
            2. Achieve Hardened Grade A+
          </span>
        </div>
      </div>

      {/* Header Configurator & Live Grade */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Headers Checklist */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-mono text-cyan-400 uppercase font-semibold">HTTP Response Header Directives</span>
            <button
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          <div className="space-y-3">
            {/* HSTS */}
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white block">Strict-Transport-Security (HSTS)</span>
                <span className="text-[11px] text-slate-400 font-mono">max-age=31536000; includeSubDomains</span>
              </div>
              <button
                onClick={() => toggleHeader('hsts')}
                className={`px-3 py-1 rounded text-xs font-mono font-bold transition ${
                  headers.hsts ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {headers.hsts ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* CSP */}
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white block">Content-Security-Policy (CSP)</span>
                <span className="text-[11px] text-slate-400 font-mono">default-src &apos;self&apos;; script-src &apos;self&apos;</span>
              </div>
              <button
                onClick={() => toggleHeader('csp')}
                className={`px-3 py-1 rounded text-xs font-mono font-bold transition ${
                  headers.csp ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {headers.csp ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* nosniff */}
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white block">X-Content-Type-Options</span>
                <span className="text-[11px] text-slate-400 font-mono">nosniff (blocks MIME-sniffing)</span>
              </div>
              <button
                onClick={() => toggleHeader('xContentType')}
                className={`px-3 py-1 rounded text-xs font-mono font-bold transition ${
                  headers.xContentType ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {headers.xContentType ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Clickjacking / X-Frame-Options */}
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white block">X-Frame-Options / frame-ancestors</span>
                <span className="text-[11px] text-slate-400 font-mono">DENY (blocks Clickjacking iframes)</span>
              </div>
              <button
                onClick={() => toggleHeader('xFrameOptions')}
                className={`px-3 py-1 rounded text-xs font-mono font-bold transition ${
                  headers.xFrameOptions ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {headers.xFrameOptions ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Referrer-Policy */}
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white block">Referrer-Policy</span>
                <span className="text-[11px] text-slate-400 font-mono">strict-origin-when-cross-origin</span>
              </div>
              <button
                onClick={() => toggleHeader('referrerPolicy')}
                className={`px-3 py-1 rounded text-xs font-mono font-bold transition ${
                  headers.referrerPolicy ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {headers.referrerPolicy ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          <button
            onClick={handleTestHeaders}
            className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition mt-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Analyze Current Header Configuration</span>
          </button>
        </div>

        {/* Right: Security Grade Card & Clickjacking Tester */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <span className="text-xs font-mono text-cyan-400 uppercase font-semibold">Mozilla Observatory Scorecard</span>
              <span className="text-xs font-mono text-slate-400">{currentScore} / 100 PTS</span>
            </div>

            {/* Big Grade Badge */}
            <div className="flex items-center gap-5 p-4 rounded-xl bg-slate-900 border border-slate-800 mb-4">
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl font-black font-mono border-2 ${gradeInfo.color} shadow-lg`}>
                {gradeInfo.grade}
              </div>
              <div>
                <h4 className="text-base font-bold text-white">
                  {currentScore >= 95 ? 'Hardened Production Grade' : currentScore >= 60 ? 'Moderate Protection' : 'Severely Insecure'}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {currentScore >= 95
                    ? 'All critical browser security mechanisms active. Safe from Clickjacking, MIME confusion, and HTTP downgrades.'
                    : 'Missing critical security headers. Browser is operating in permissive legacy mode.'}
                </p>
              </div>
            </div>

            {/* Clickjacking Exploit Live Sandbox Preview */}
            <div className="border border-slate-800 rounded-lg p-3 bg-slate-900/60 font-mono text-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300 font-semibold">Clickjacking Iframe Test:</span>
                <span className={`text-[10px] px-2 py-0.5 rounded ${
                  headers.xFrameOptions ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
                }`}>
                  {headers.xFrameOptions ? 'IFRAME BLOCKED' : 'IFRAME VULNERABLE'}
                </span>
              </div>

              <div className="h-28 rounded bg-slate-950 border border-slate-800 flex items-center justify-center p-3 text-center">
                {headers.xFrameOptions ? (
                  <div className="text-emerald-400 text-xs flex flex-col items-center gap-1">
                    <ShieldCheck className="w-6 h-6 text-emerald-400" />
                    <span>Browser Error: Refused to display document in iframe because X-Frame-Options is set to &apos;DENY&apos;.</span>
                  </div>
                ) : (
                  <div className="text-rose-400 text-xs flex flex-col items-center gap-1">
                    <AlertTriangle className="w-6 h-6 text-rose-400" />
                    <span>Malicious attacker overlay successfully framed target website! User clicks can be hijacked.</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 border-t border-slate-800/80 pt-3">
            Industry Standard: Modern web applications use Helmet.js in Express or security header policies in Nginx/Cloudflare.
          </div>
        </div>
      </div>

      {/* Completion Banner */}
      {hasAchievedAPlus && (
        <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-xl p-5 flex items-center gap-4 text-emerald-300">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
          <div>
            <h4 className="font-bold text-white text-base">Lab Challenge Solved! (+95 Points)</h4>
            <p className="text-xs text-emerald-200/90 leading-relaxed">
              You analyzed missing browser defense directives, configured HSTS, CSP, nosniff, and anti-clickjacking frame protections, and achieved a hardened security grade A+!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
