import React, { useState } from 'react';
import { Play, RotateCcw, CheckCircle2, DollarSign, Globe } from 'lucide-react';

interface CsrfSandboxProps {
  onComplete: (score: number) => void;
}

export const CsrfSandbox: React.FC<CsrfSandboxProps> = ({ onComplete }) => {
  const [balance, setBalance] = useState(5000);
  const [antiCsrfEnabled, setAntiCsrfEnabled] = useState(false);
  const [sameSiteCookie, setSameSiteCookie] = useState<'None' | 'Lax' | 'Strict'>('None');
  const [recentTransfers, setRecentTransfers] = useState<{ to: string; amount: number; time: string; status: 'Success' | 'Blocked' }[]>([
    { to: 'Tuition Office', amount: 850, time: '10:15 AM', status: 'Success' }
  ]);
  const [attackLog, setAttackLog] = useState<string | null>(null);
  const [hasExploited, setHasExploited] = useState(false);
  const [hasDefended, setHasDefended] = useState(false);

  const simulateAttack = () => {
    const isProtected = antiCsrfEnabled || sameSiteCookie === 'Strict' || sameSiteCookie === 'Lax';

    if (!isProtected) {
      // CSRF exploit succeeds
      const stolenAmount = 2500;
      setBalance(prev => Math.max(0, prev - stolenAmount));
      setRecentTransfers(prev => [
        { to: 'Attacker (0x7F9...evil)', amount: stolenAmount, time: 'Just now', status: 'Success' },
        ...prev
      ]);
      setHasExploited(true);
      setAttackLog('EXPLOIT WORKED! The attacker page automatically submitted a POST request. Because SameSite was None and no anti-CSRF token was checked, your browser sent your valid session cookies with the request.');
    } else {
      // Defense blocks request
      setRecentTransfers(prev => [
        { to: 'Attacker (0x7F9...evil)', amount: 2500, time: 'Just now', status: 'Blocked' },
        ...prev
      ]);
      if (hasExploited) {
        setHasDefended(true);
        onComplete(110);
      }
      if (antiCsrfEnabled) {
        setAttackLog('BLOCKED (HTTP 403 Forbidden): The server required a cryptographically secure X-CSRF-Token header. The attacker’s external site could not read or forge this token due to the Same-Origin Policy.');
      } else {
        setAttackLog(`BLOCKED: The session cookie had SameSite=${sameSiteCookie}. The browser refused to send cookies with the cross-site request originating from attacker-rewards.xyz.`);
      }
    }
  };

  const handleReset = () => {
    setBalance(5000);
    setAntiCsrfEnabled(false);
    setSameSiteCookie('None');
    setRecentTransfers([{ to: 'Tuition Office', amount: 850, time: '10:15 AM', status: 'Success' }]);
    setAttackLog(null);
    setHasExploited(false);
  };

  return (
    <div className="space-y-6">
      {/* Exercise Instructions */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
        <h3 className="text-base font-semibold text-white flex items-center gap-2 mb-2">
          <Globe className="w-5 h-5 text-cyan-400" />
          <span>Interactive Task: Simulate Cross-Site Request Forgery & Configure Tokens</span>
        </h3>
        <p className="text-sm text-slate-300 mb-2">
          1. <strong>Step 1:</strong> With default settings (No Anti-CSRF token, SameSite=None), click <em>Simulate Victim Clicking Phishing Link</em> to execute an unwanted $2,500 transfer.
        </p>
        <p className="text-sm text-slate-300 mb-3">
          2. <strong>Step 2:</strong> Enable the <em>Anti-CSRF Synchronizer Token</em> or set <em>SameSite=Strict</em>, and re-run the attack to verify defense.
        </p>

        {/* Progress Tracker */}
        <div className="flex items-center gap-4 text-xs font-mono pt-2 border-t border-slate-800/80">
          <span className={`flex items-center gap-1.5 ${hasExploited ? 'text-emerald-400' : 'text-slate-500'}`}>
            <span className={`w-2 h-2 rounded-full ${hasExploited ? 'bg-emerald-400' : 'bg-slate-600'}`}></span>
            1. Trigger CSRF Attack
          </span>
          <span className={`flex items-center gap-1.5 ${hasDefended ? 'text-emerald-400' : 'text-slate-500'}`}>
            <span className={`w-2 h-2 rounded-full ${hasDefended ? 'bg-emerald-400' : 'bg-slate-600'}`}></span>
            2. Validate CSRF Protection
          </span>
        </div>
      </div>

      {/* Security Defense Configuration Workbench */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-300 font-semibold">Anti-CSRF Token:</span>
            <button
              onClick={() => setAntiCsrfEnabled(!antiCsrfEnabled)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition ${
                antiCsrfEnabled
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              }`}
            >
              {antiCsrfEnabled ? 'ENABLED (X-CSRF-Token)' : 'DISABLED (Vulnerable)'}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-300 font-semibold">SameSite Cookie Flag:</span>
            <select
              value={sameSiteCookie}
              onChange={(e) => setSameSiteCookie(e.target.value as 'None' | 'Lax' | 'Strict')}
              className="bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 px-3 py-1.5 rounded-lg focus:outline-none"
            >
              <option value="None">SameSite=None (Vulnerable)</option>
              <option value="Lax">SameSite=Lax (Partial protection)</option>
              <option value="Strict">SameSite=Strict (Full protection)</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Lab</span>
        </button>
      </div>

      {/* 2-Column Split: Victim Bank vs Attacker Site */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Legitimate Bank Dashboard */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>SecureBank Portal (Authenticated Session)</span>
              </h4>
              <span className="text-xs text-slate-500 font-mono">User: Alex Chen • Account: #9901-44</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 block uppercase font-mono">Available Balance</span>
              <span className="text-xl font-bold font-mono text-emerald-400">${balance.toLocaleString()}</span>
            </div>
          </div>

          {/* Transfers History */}
          <div>
            <span className="text-xs font-mono text-slate-400 block mb-2 font-semibold">Recent Transactions:</span>
            <div className="space-y-2">
              {recentTransfers.map((tx, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800 text-xs">
                  <div>
                    <span className="text-white font-medium block">{tx.to}</span>
                    <span className="text-[10px] text-slate-500">{tx.time}</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className={`block font-bold ${tx.status === 'Success' ? 'text-rose-400' : 'text-slate-500 line-through'}`}>
                      -${tx.amount}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                      tx.status === 'Success' ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
                    }`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Attacker Site Simulator */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <span className="text-xs font-mono text-rose-400 uppercase font-semibold">Attacker Site: `attacker-rewards.xyz`</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800/40">Phishing Origin</span>
            </div>

            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              An attacker hosts a malicious page with a hidden form that auto-executes upon page load, sending a POST request to your bank:
            </p>

            {/* Hidden Form Payload View */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-slate-400 mb-3">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold mb-1">Malicious Cross-Site Request:</span>
              <pre className="text-cyan-300 text-[11px] whitespace-pre-wrap">
{`<form action="https://bank.local/api/transfer" method="POST">
  <input type="hidden" name="to" value="0x7F9...evil" />
  <input type="hidden" name="amount" value="2500" />
</form>
<script>document.forms[0].submit();</script>`}
              </pre>
            </div>

            {attackLog && (
              <div className={`p-3 rounded-lg border text-xs leading-relaxed ${
                attackLog.startsWith('EXPLOIT')
                  ? 'bg-rose-950/70 border-rose-500/50 text-rose-200'
                  : 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200'
              }`}>
                {attackLog}
              </div>
            )}
          </div>

          <button
            onClick={simulateAttack}
            className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-rose-500 to-amber-600 hover:from-rose-400 hover:to-amber-500 text-slate-950 font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20 transition mt-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Simulate Victim Clicking Phishing Link</span>
          </button>
        </div>
      </div>

      {/* Completion Banner */}
      {hasDefended && (
        <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-xl p-5 flex items-center gap-4 text-emerald-300">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
          <div>
            <h4 className="font-bold text-white text-base">Lab Challenge Solved! (+110 Points)</h4>
            <p className="text-xs text-emerald-200/90 leading-relaxed">
              You experienced how ambient cookie transmission makes cross-site forgery possible, and validated how Synchronizer Anti-CSRF tokens and SameSite cookie policies prevent unauthorized state modifications.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
