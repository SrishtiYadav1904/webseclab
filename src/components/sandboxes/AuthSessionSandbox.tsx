import React, { useState } from 'react';
import { Lock, Play, RotateCcw, CheckCircle2, Key, Cookie } from 'lucide-react';

interface AuthSessionSandboxProps {
  onComplete: (score: number) => void;
}

export const AuthSessionSandbox: React.FC<AuthSessionSandboxProps> = ({ onComplete }) => {
  const [httpOnly, setHttpOnly] = useState(false);
  const [secureFlag, setSecureFlag] = useState(false);
  const [sameSite, setSameSite] = useState<'None' | 'Lax' | 'Strict'>('None');
  const [sessionTtl, setSessionTtl] = useState<'infinite' | '3600'>('infinite');

  const [cookieTheftResult, setCookieTheftResult] = useState<{
    success: boolean;
    message: string;
    stolenToken?: string;
  } | null>(null);

  const testPassword = 'P@ssword123!';
  const [hasExploited, setHasExploited] = useState(false);
  const [hasHardened, setHasHardened] = useState(false);

  const handleTestCookieTheft = () => {
    if (!httpOnly) {
      setHasExploited(true);
      setCookieTheftResult({
        success: true,
        message: 'VULNERABILITY DETECTED: Because HttpOnly is disabled, injected client-side JavaScript accessed document.cookie and stole your active session token!',
        stolenToken: 'sess_99fa81bc32e987aa12'
      });
    } else {
      if (hasExploited && secureFlag && sameSite !== 'None' && sessionTtl === '3600') {
        setHasHardened(true);
        onComplete(110);
      }
      setCookieTheftResult({
        success: false,
        message: 'PROTECTED: The HttpOnly flag prevented document.cookie from exposing the session token. Client-side scripts cannot read this cookie.'
      });
    }
  };

  const handleReset = () => {
    setHttpOnly(false);
    setSecureFlag(false);
    setSameSite('None');
    setSessionTtl('infinite');
    setCookieTheftResult(null);
    setHasExploited(false);
  };

  return (
    <div className="space-y-6">
      {/* Exercise Instructions */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
        <h3 className="text-base font-semibold text-white flex items-center gap-2 mb-2">
          <Lock className="w-5 h-5 text-cyan-400" />
          <span>Interactive Task: Harden Session Cookies & Prevent Token Hijacking</span>
        </h3>
        <p className="text-sm text-slate-300 mb-2">
          1. <strong>Step 1:</strong> With default settings (HttpOnly=false), click <em>Simulate XSS Cookie Hijack</em> to observe how client-side scripts steal session tokens.
        </p>
        <p className="text-sm text-slate-300 mb-3">
          2. <strong>Step 2:</strong> Configure defense-in-depth flags: turn on <em>HttpOnly</em>, enable <em>Secure</em>, set <em>SameSite=Strict</em>, and enforce <em>1 Hour Expiration</em>.
        </p>

        {/* Progress Tracker */}
        <div className="flex items-center gap-4 text-xs font-mono pt-2 border-t border-slate-800/80">
          <span className={`flex items-center gap-1.5 ${hasExploited ? 'text-emerald-400' : 'text-slate-500'}`}>
            <span className={`w-2 h-2 rounded-full ${hasExploited ? 'bg-emerald-400' : 'bg-slate-600'}`}></span>
            1. Demonstrate Cookie Theft
          </span>
          <span className={`flex items-center gap-1.5 ${hasHardened ? 'text-emerald-400' : 'text-slate-500'}`}>
            <span className={`w-2 h-2 rounded-full ${hasHardened ? 'bg-emerald-400' : 'bg-slate-600'}`}></span>
            2. Fully Harden Cookie Policy
          </span>
        </div>
      </div>

      {/* Grid: Cookie Inspector Controls vs Live Attack Simulation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Cookie Configuration Checklist */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <Cookie className="w-4 h-4 text-cyan-400" />
              <span>Session Cookie Configuration Flags</span>
            </h4>
            <button
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 px-2.5 py-1 rounded border border-slate-800 hover:bg-slate-800 transition"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* HttpOnly Switch */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
            <div>
              <span className="text-xs font-semibold text-white block">HttpOnly Attribute</span>
              <span className="text-[11px] text-slate-400">Blocks JavaScript (document.cookie) from reading token</span>
            </div>
            <button
              onClick={() => setHttpOnly(!httpOnly)}
              className={`px-3 py-1 rounded text-xs font-mono font-bold transition ${
                httpOnly ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              }`}
            >
              {httpOnly ? 'TRUE (Secure)' : 'FALSE (Vulnerable)'}
            </button>
          </div>

          {/* Secure Flag Switch */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
            <div>
              <span className="text-xs font-semibold text-white block">Secure Attribute</span>
              <span className="text-[11px] text-slate-400">Restricts cookie transmission strictly to HTTPS</span>
            </div>
            <button
              onClick={() => setSecureFlag(!secureFlag)}
              className={`px-3 py-1 rounded text-xs font-mono font-bold transition ${
                secureFlag ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              }`}
            >
              {secureFlag ? 'TRUE (HTTPS Only)' : 'FALSE (Cleartext HTTP)'}
            </button>
          </div>

          {/* SameSite Select */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
            <div>
              <span className="text-xs font-semibold text-white block">SameSite Attribute</span>
              <span className="text-[11px] text-slate-400">Controls cross-site cookie transmission</span>
            </div>
            <select
              value={sameSite}
              onChange={(e) => setSameSite(e.target.value as 'None' | 'Lax' | 'Strict')}
              className="bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-300 px-2.5 py-1 rounded"
            >
              <option value="None">None</option>
              <option value="Lax">Lax</option>
              <option value="Strict">Strict (Recommended)</option>
            </select>
          </div>

          {/* Max-Age */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
            <div>
              <span className="text-xs font-semibold text-white block">Session Expiration (Max-Age)</span>
              <span className="text-[11px] text-slate-400">Enforces absolute session lifetime</span>
            </div>
            <select
              value={sessionTtl}
              onChange={(e) => setSessionTtl(e.target.value as 'infinite' | '3600')}
              className="bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-300 px-2.5 py-1 rounded"
            >
              <option value="infinite">No Expiration (Indefinite)</option>
              <option value="3600">3600 seconds (1 Hour)</option>
            </select>
          </div>

          {/* Attack Action Button */}
          <button
            onClick={handleTestCookieTheft}
            className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition mt-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Simulate XSS Cookie Hijack (document.cookie)</span>
          </button>
        </div>

        {/* Right: Simulated Cookie Storage & Exploit Feedback */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-800 pb-2 mb-3 flex items-center justify-between">
              <span className="text-xs font-mono text-cyan-400 uppercase font-semibold">Active Browser Cookie Jar</span>
              <span className="text-[10px] font-mono text-slate-500">Domain: auth-api.local</span>
            </div>

            {/* Cookie Object View */}
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 space-y-1 mb-3">
              <div><span className="text-slate-500">Name:</span> <span className="text-cyan-400">session_token</span></div>
              <div><span className="text-slate-500">Value:</span> sess_99fa81bc32e987aa12</div>
              <div><span className="text-slate-500">HttpOnly:</span> <span className={httpOnly ? 'text-emerald-400' : 'text-rose-400'}>{String(httpOnly)}</span></div>
              <div><span className="text-slate-500">Secure:</span> <span className={secureFlag ? 'text-emerald-400' : 'text-rose-400'}>{String(secureFlag)}</span></div>
              <div><span className="text-slate-500">SameSite:</span> <span className={sameSite === 'Strict' ? 'text-emerald-400' : 'text-amber-400'}>{sameSite}</span></div>
              <div><span className="text-slate-500">Max-Age:</span> {sessionTtl}</div>
            </div>

            {/* Cookie Theft Result */}
            {cookieTheftResult && (
              <div className={`p-4 rounded-xl border text-xs ${
                cookieTheftResult.success
                  ? 'bg-rose-950/60 border-rose-500/40 text-rose-200'
                  : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
              }`}>
                <div className="font-bold mb-1 flex items-center gap-2">
                  {cookieTheftResult.success ? (
                    <span className="text-rose-400 font-mono">🚨 XSS SCRIPT STOLE COOKIE</span>
                  ) : (
                    <span className="text-emerald-400 font-mono">🛡 ATTACK NEUTRALIZED</span>
                  )}
                </div>
                <p className="leading-relaxed mb-2">{cookieTheftResult.message}</p>
                {cookieTheftResult.stolenToken && (
                  <div className="bg-black/50 p-2 rounded border border-rose-800/40 font-mono text-xs text-rose-300">
                    Stolen Session Token: <strong>{cookieTheftResult.stolenToken}</strong>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Password Hashing Comparison Utility */}
          <div className="border-t border-slate-800/80 pt-3">
            <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1 font-semibold flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>Password Storage Defense (Argon2 vs Legacy Hash)</span>
            </span>
            <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800 font-mono text-[11px] space-y-1">
              <div className="text-slate-400">Password: <span className="text-white">&quot;{testPassword}&quot;</span></div>
              <div className="text-rose-400">MD5: 8542b... (Crackable in &lt;1 second via rainbow tables)</div>
              <div className="text-emerald-400">Argon2id: $argon2id$v=19$m=65536,t=3,p=4$G1... (GPU-resistant)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Completion Banner */}
      {hasHardened && (
        <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-xl p-5 flex items-center gap-4 text-emerald-300">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
          <div>
            <h4 className="font-bold text-white text-base">Lab Challenge Solved! (+110 Points)</h4>
            <p className="text-xs text-emerald-200/90 leading-relaxed">
              You configured complete defense-in-depth on session cookies: <code className="font-mono">HttpOnly</code> to prevent XSS credential theft, <code className="font-mono">Secure</code> for TLS enforcement, <code className="font-mono">SameSite=Strict</code> for CSRF defense, and bounded session timeouts.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
