import React, { useState } from 'react';
import { Database, ShieldCheck, Play, RotateCcw, CheckCircle2, AlertOctagon, Terminal } from 'lucide-react';

interface SqlInjectionSandboxProps {
  onComplete: (score: number) => void;
}

export const SqlInjectionSandbox: React.FC<SqlInjectionSandboxProps> = ({ onComplete }) => {
  const [queryMode, setQueryMode] = useState<'concatenated' | 'parameterized'>('concatenated');
  const [usernameInput, setUsernameInput] = useState("admin' --");
  const [passwordInput, setPasswordInput] = useState('anything');
  const [queryResult, setQueryResult] = useState<{
    success: boolean;
    message: string;
    user?: { id: number; username: string; role: string };
  } | null>(null);

  const [hasExploited, setHasExploited] = useState(false);
  const [hasParameterized, setHasParameterized] = useState(false);

  // Mock database table
  const mockUsersTable = [
    { id: 1, username: 'admin', password_hash: '$2b$12$e8Y... (hashed)', role: 'Administrator' },
    { id: 2, username: 'john_doe', password_hash: '$2b$12$K1q... (hashed)', role: 'Standard User' },
    { id: 3, username: 'sarah_appsec', password_hash: '$2b$12$Lm7... (hashed)', role: 'Security Auditor' }
  ];

  // Dynamic raw query generated
  const generatedQuery = queryMode === 'concatenated'
    ? `SELECT id, username, role FROM users WHERE username = '${usernameInput}' AND password = '${passwordInput}';`
    : `SELECT id, username, role FROM users WHERE username = $1 AND password = $2;`;

  const handleExecute = () => {
    if (queryMode === 'concatenated') {
      // Check SQL injection syntax
      const input = usernameInput.trim();
      const isCommentBypass = input.includes("' --") || input.includes("'#") || input.includes("admin'--");
      const isOrBypass = input.toLowerCase().includes("' or '1'='1") || input.toLowerCase().includes("' or 1=1");

      if (isCommentBypass || isOrBypass) {
        setHasExploited(true);
        setQueryResult({
          success: true,
          message: 'AUTHENTICATION BYPASSED! The single quote closed the string literal, and the SQL comment delimiter (--) truncated the password check.',
          user: mockUsersTable[0]
        });
      } else {
        setQueryResult({
          success: false,
          message: 'Login Failed: Invalid credentials. No records matched the query condition.'
        });
      }
    } else {
      // Parameterized query: inputs are treated literally
      if (hasExploited) {
        setHasParameterized(true);
        onComplete(125);
      }
      setQueryResult({
        success: false,
        message: 'Query safely executed with parameter bindings ($1, $2). The database looked for a literal user named "' + usernameInput + '". Injection syntax was treated strictly as plain text string.'
      });
    }
  };

  const handleReset = () => {
    setUsernameInput("admin' --");
    setPasswordInput('anything');
    setQueryResult(null);
    setHasExploited(false);
  };

  return (
    <div className="space-y-6">
      {/* Exercise Instructions */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
        <h3 className="text-base font-semibold text-white flex items-center gap-2 mb-2">
          <Database className="w-5 h-5 text-cyan-400" />
          <span>Interactive Task: Exploit Concatenated Query & Deploy Parameterized Query</span>
        </h3>
        <p className="text-sm text-slate-300 mb-3">
          1. <strong>Step 1:</strong> In <em>Concatenated Query</em> mode, execute the login using the payload <code className="text-rose-300 font-mono text-xs">admin&apos; --</code> to bypass password verification.
        </p>
        <p className="text-sm text-slate-300 mb-3">
          2. <strong>Step 2:</strong> Switch to <em>Parameterized Prepared Statement</em> mode, re-run the query, and observe how query compilation eliminates SQL Injection.
        </p>

        {/* Progress Tracker */}
        <div className="flex items-center gap-4 text-xs font-mono pt-2 border-t border-slate-800/80">
          <span className={`flex items-center gap-1.5 ${hasExploited ? 'text-emerald-400' : 'text-slate-500'}`}>
            <span className={`w-2 h-2 rounded-full ${hasExploited ? 'bg-emerald-400' : 'bg-slate-600'}`}></span>
            1. Exploit Authentication Bypass
          </span>
          <span className={`flex items-center gap-1.5 ${hasParameterized ? 'text-emerald-400' : 'text-slate-500'}`}>
            <span className={`w-2 h-2 rounded-full ${hasParameterized ? 'bg-emerald-400' : 'bg-slate-600'}`}></span>
            2. Validate Parameterized Query
          </span>
        </div>
      </div>

      {/* Query Mode Switcher */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-2 rounded-xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setQueryMode('concatenated')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition ${
              queryMode === 'concatenated'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertOctagon className="w-4 h-4 text-rose-400" />
            <span>Vulnerable: String Concatenation</span>
          </button>
          <button
            onClick={() => setQueryMode('parameterized')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition ${
              queryMode === 'parameterized'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Secure: Parameterized Query ($1, $2)</span>
          </button>
        </div>

        <button
          onClick={handleReset}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Lab</span>
        </button>
      </div>

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Login Form Inputs */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <h4 className="text-sm font-semibold text-white flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>Simulated Login Form</span>
          </h4>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Username Field:</label>
            <input
              type="text"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Password Field:</label>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Quick Payloads */}
          <div className="pt-2">
            <span className="text-xs text-slate-400 block mb-1">Try Sample Injection Payloads:</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setUsernameInput("admin' --")}
                className="text-xs font-mono px-2 py-1 bg-slate-950 hover:bg-slate-800 rounded text-cyan-400 border border-slate-800"
              >
                admin&apos; --
              </button>
              <button
                onClick={() => setUsernameInput("' OR 1=1 --")}
                className="text-xs font-mono px-2 py-1 bg-slate-950 hover:bg-slate-800 rounded text-cyan-400 border border-slate-800"
              >
                &apos; OR 1=1 --
              </button>
              <button
                onClick={() => setUsernameInput("john_doe")}
                className="text-xs font-mono px-2 py-1 bg-slate-950 hover:bg-slate-800 rounded text-slate-400 border border-slate-800"
              >
                john_doe (Standard)
              </button>
            </div>
          </div>

          <button
            onClick={handleExecute}
            className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition mt-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Execute Database Query</span>
          </button>
        </div>

        {/* Right: Database Engine Inspector */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-3">
              <span className="text-xs font-mono text-cyan-400 uppercase font-semibold">PostgreSQL Engine Query Inspector</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">port 5432</span>
            </div>

            {/* Query Disassembly Box */}
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg font-mono text-xs mb-3">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold mb-1">Generated SQL Query:</span>
              <p className={queryMode === 'concatenated' ? 'text-rose-300' : 'text-emerald-300'}>
                {generatedQuery}
              </p>
              {queryMode === 'parameterized' && (
                <div className="text-slate-400 text-[11px] mt-2 pt-2 border-t border-slate-800">
                  <span className="text-cyan-400">$1:</span> &quot;{usernameInput}&quot; | <span className="text-cyan-400">$2:</span> &quot;{passwordInput}&quot;
                </div>
              )}
            </div>

            {/* Execution Result Box */}
            {queryResult && (
              <div className={`p-4 rounded-xl border text-xs ${
                queryResult.success
                  ? 'bg-rose-950/60 border-rose-500/40 text-rose-200'
                  : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}>
                <div className="font-bold mb-1 flex items-center gap-2">
                  {queryResult.success ? (
                    <span className="text-rose-400 font-mono text-sm">⚠ EXPLOIT SUCCESSFUL</span>
                  ) : (
                    <span className="text-slate-400 font-mono text-sm">ⓘ DATABASE RESPONSE</span>
                  )}
                </div>
                <p className="leading-relaxed mb-2">{queryResult.message}</p>
                {queryResult.user && (
                  <div className="bg-black/40 p-2.5 rounded border border-rose-800/30 font-mono text-xs text-rose-300">
                    <div>Logged in as: <strong>{queryResult.user.username}</strong></div>
                    <div>Account Role: <strong>{queryResult.user.role}</strong></div>
                    <div>User ID: <strong>{queryResult.user.id}</strong></div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Database Mock Table Preview */}
          <div className="border-t border-slate-800/80 pt-3">
            <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Target Table: `users`</span>
            <div className="text-[11px] font-mono bg-slate-900/60 rounded border border-slate-800/60 p-2 space-y-1">
              <div className="text-slate-400 grid grid-cols-3 font-semibold border-b border-slate-800 pb-1">
                <span>id</span>
                <span>username</span>
                <span>role</span>
              </div>
              {mockUsersTable.map(u => (
                <div key={u.id} className="grid grid-cols-3 text-slate-300">
                  <span>{u.id}</span>
                  <span className="text-cyan-400">{u.username}</span>
                  <span className="text-slate-400">{u.role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Completion Banner */}
      {hasParameterized && (
        <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-xl p-5 flex items-center gap-4 text-emerald-300">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
          <div>
            <h4 className="font-bold text-white text-base">Lab Challenge Solved! (+125 Points)</h4>
            <p className="text-xs text-emerald-200/90 leading-relaxed">
              You bypassed authentication using SQL comments to comment out the password logic, and then neutralized the vulnerability by switching to parameterized prepared statements where user data cannot alter SQL commands.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
