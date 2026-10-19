import React, { useState, useRef, useEffect } from 'react';
import { Terminal, RotateCcw, CheckCircle2, Search, Sliders, ArrowRight } from 'lucide-react';

interface ScannerSandboxProps {
  onComplete: (score: number) => void;
}

interface CommandHistory {
  cmd: string;
  output: string;
  isError?: boolean;
}

export const ScannerSandbox: React.FC<ScannerSandboxProps> = ({ onComplete }) => {
  const [activeTab, setActiveTab] = useState<'terminal' | 'report_analysis' | 'burp_suite'>('terminal');

  // Terminal state
  const [inputCommand, setInputCommand] = useState('');
  const [history, setHistory] = useState<CommandHistory[]>([
    {
      cmd: 'welcome',
      output: `WebSecLab Virtual Security Scanner v2.4 (Simulated Environment)
Type "help" to view allowed scanning commands.
Target Host: http://target-app.local (Safe isolated sandbox)`
    }
  ]);
  const [isScanning, setIsScanning] = useState(false);

  // Completion milestones
  const [hasRunNikto, setHasRunNikto] = useState(false);
  const [hasRunZap, setHasRunZap] = useState(false);
  const [hasCompletedTriage, setHasCompletedTriage] = useState(false);
  const [hasTamperedBurp, setHasTamperedBurp] = useState(false);

  // Burp Suite Simulator state
  const [interceptActive, setInterceptActive] = useState(true);
  const [requestPrice, setRequestPrice] = useState('99.99');
  const [requestRole, setRequestRole] = useState('student');
  const [burpResponse, setBurpResponse] = useState<string | null>(null);

  // Findings Triage State
  const [triageAnswers, setTriageAnswers] = useState<Record<string, string>>({
    finding1: '',
    finding2: '',
    finding3: ''
  });

  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isScanning]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputCommand.trim();
    if (!cmd) return;

    setInputCommand('');

    if (cmd === 'clear') {
      setHistory([]);
      return;
    }

    if (cmd === 'help') {
      setHistory(prev => [
        ...prev,
        {
          cmd,
          output: `Available Scanner Commands (Allowlist):
  nikto -h http://target-app.local    : Run Nikto Web Server vulnerability scan
  zap-cli quick-scan                  : Run OWASP ZAP baseline scan
  zap-cli alerts                      : Review detailed OWASP ZAP alert items
  burp                                : Launch Burp Suite Interceptor workbench
  clear                               : Clear terminal screen
  help                                : Show this guide`
        }
      ]);
      return;
    }

    if (cmd.startsWith('nikto')) {
      setIsScanning(true);
      setHistory(prev => [
        ...prev,
        { cmd, output: '[*] Starting Nikto v2.1.6 scan against target-app.local...' }
      ]);

      setTimeout(() => {
        setIsScanning(false);
        setHasRunNikto(true);
        setHistory(prev => [
          ...prev,
          {
            cmd: '',
            output: `- Nikto v2.1.6
---------------------------------------------------------------------------
+ Target IP:          192.168.10.45
+ Target Hostname:    target-app.local
+ Target Port:        80
+ Start Time:         2026-10-20 03:25:10
---------------------------------------------------------------------------
+ Server: Apache/2.2.8 (Ubuntu) DAV/2 mod_ssl/2.2.8 OpenSSL/0.9.8g
+ Server leaks inodes via ETags (header: ETag: "2c01-4b1-...")
+ The anti-clickjacking X-Frame-Options header is not present.
+ The X-XSS-Protection header is not defined.
+ The X-Content-Type-Options header is not set.
+ OSVDB-3268: /test/: Directory indexing found.
+ OSVDB-3092: /admin/login.php: Administrative login interface exposed.
+ /phpmyadmin/: Default database management tool found.
+ 8712 requests: 0 error(s) and 6 item(s) reported on remote host
---------------------------------------------------------------------------
[*] Scan completed in 4.2 seconds.`
          }
        ]);
      }, 1500);
      return;
    }

    if (cmd.startsWith('zap-cli quick-scan')) {
      setIsScanning(true);
      setHistory(prev => [
        ...prev,
        { cmd, output: '[*] Spawning OWASP ZAP 2.14 daemon. Running spider and active scan...' }
      ]);

      setTimeout(() => {
        setIsScanning(false);
        setHasRunZap(true);
        setHistory(prev => [
          ...prev,
          {
            cmd: '',
            output: `[+] OWASP ZAP Scan Report Summary:
Target: http://target-app.local
Total URLs Spidered: 38
Alerts Identified:
  [HIGH]   SQL Injection in /api/search?q= (1 finding)
  [MEDIUM] Missing Anti-CSRF Token in /api/transfer (1 finding)
  [MEDIUM] Insecure Cookie without HttpOnly (1 finding)
  [LOW]    Missing Content-Security-Policy (1 finding)
  [INFO]   Server Leaks Version Banner (1 finding)
Type "zap-cli alerts" for detailed finding analysis.`
          }
        ]);
      }, 1500);
      return;
    }

    if (cmd.startsWith('zap-cli alerts')) {
      setHistory(prev => [
        ...prev,
        {
          cmd,
          output: `OWASP ZAP Detailed Alert Log:
1. High: SQL Injection
   URL: http://target-app.local/api/search?q=1%27%20OR%201=1--
   Evidence: PostgreSQL syntax error returned in HTTP response body
   Solution: Implement parameterized queries.
2. Medium: Session Cookie Missing HttpOnly
   URL: http://target-app.local/auth/login
   Evidence: Set-Cookie: session_id=98a3b2; Path=/
   Solution: Add "HttpOnly" attribute to Set-Cookie header.`
        }
      ]);
      return;
    }

    if (cmd === 'burp') {
      setActiveTab('burp_suite');
      setHistory(prev => [
        ...prev,
        { cmd, output: '[+] Switching to Burp Suite Interceptor tab.' }
      ]);
      return;
    }

    // Default unrecognized
    setHistory(prev => [
      ...prev,
      {
        cmd,
        output: `bash: command not found: "${cmd}". Type "help" to see available scanner commands. Note: For safety, this simulated terminal accepts only approved educational commands.`,
        isError: true
      }
    ]);
  };

  const handleTriageSubmit = () => {
    // Check if answers are correct:
    // Finding 1 (Apache 2.2.8 banner): True Positive
    // Finding 2 (ETag inode leak): Low priority / False positive risk
    // Finding 3 (SQL Injection on /search): True Positive Critical
    if (triageAnswers.finding1 === 'true_positive' && triageAnswers.finding3 === 'true_positive') {
      setHasCompletedTriage(true);
      checkOverallCompletion();
    }
  };

  const handleBurpForward = () => {
    setBurpResponse(null);
    setTimeout(() => {
      if (requestPrice === '0.01' || requestRole === 'admin') {
        setHasTamperedBurp(true);
        setBurpResponse(`HTTP/1.1 200 OK
Content-Type: application/json

{
  "status": "success",
  "message": "Order processed! Charged $${requestPrice} for Pro Plan. Granted role: '${requestRole}'",
  "vulnerability": "FLAW DETECTED: Server trusted client-provided price and role without server-side validation!"
}`);
        checkOverallCompletion();
      } else {
        setBurpResponse(`HTTP/1.1 200 OK
Content-Type: application/json

{
  "status": "success",
  "message": "Order processed! Charged $${requestPrice} for Pro Plan."
}`);
      }
    }, 400);
  };

  const checkOverallCompletion = () => {
    if (hasRunNikto || hasRunZap) {
      onComplete(130);
    }
  };

  const handleReset = () => {
    setHistory([
      {
        cmd: 'welcome',
        output: `WebSecLab Virtual Security Scanner v2.4 (Simulated Environment)\nType "help" to view allowed scanning commands.`
      }
    ]);
    setHasRunNikto(false);
    setHasRunZap(false);
    setHasCompletedTriage(false);
    setHasTamperedBurp(false);
    setRequestPrice('99.99');
    setRequestRole('student');
    setBurpResponse(null);
  };

  return (
    <div className="space-y-6">
      {/* Exercise Instructions */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
        <h3 className="text-base font-semibold text-white flex items-center gap-2 mb-2">
          <Terminal className="w-5 h-5 text-cyan-400" />
          <span>Interactive Task: Run Nikto & ZAP Scans, Triage Alerts & Intercept with Burp Suite</span>
        </h3>
        <p className="text-sm text-slate-300 mb-2">
          1. <strong>Step 1:</strong> In the <em>Terminal Console</em> tab, run <code className="text-cyan-300 font-mono text-xs">nikto -h http://target-app.local</code> and <code className="text-cyan-300 font-mono text-xs">zap-cli quick-scan</code>.
        </p>
        <p className="text-sm text-slate-300 mb-3">
          2. <strong>Step 2:</strong> Open the <em>Burp Suite Interceptor</em> tab, tamper with the HTTP request parameters (e.g. change <code className="font-mono text-xs text-rose-300">price</code> to <code className="font-mono text-xs text-emerald-300">0.01</code>), and click <em>Forward Request</em> to observe parameter tampering.
        </p>

        {/* Progress Tracker */}
        <div className="flex items-center gap-4 text-xs font-mono pt-2 border-t border-slate-800/80">
          <span className={`flex items-center gap-1.5 ${hasRunNikto ? 'text-emerald-400' : 'text-slate-500'}`}>
            <span className={`w-2 h-2 rounded-full ${hasRunNikto ? 'bg-emerald-400' : 'bg-slate-600'}`}></span>
            1. Nikto Scan
          </span>
          <span className={`flex items-center gap-1.5 ${hasRunZap ? 'text-emerald-400' : 'text-slate-500'}`}>
            <span className={`w-2 h-2 rounded-full ${hasRunZap ? 'bg-emerald-400' : 'bg-slate-600'}`}></span>
            2. OWASP ZAP Scan
          </span>
          <span className={`flex items-center gap-1.5 ${hasCompletedTriage ? 'text-emerald-400' : 'text-slate-500'}`}>
            <span className={`w-2 h-2 rounded-full ${hasCompletedTriage ? 'bg-emerald-400' : 'bg-slate-600'}`}></span>
            3. Triage Findings
          </span>
          <span className={`flex items-center gap-1.5 ${hasTamperedBurp ? 'text-emerald-400' : 'text-slate-500'}`}>
            <span className={`w-2 h-2 rounded-full ${hasTamperedBurp ? 'bg-emerald-400' : 'bg-slate-600'}`}></span>
            4. Burp Suite Tampering
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('terminal')}
            className={`px-4 py-2.5 text-xs font-semibold font-mono border-b-2 transition flex items-center gap-2 ${
              activeTab === 'terminal'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Interactive Scanner Terminal</span>
          </button>
          <button
            onClick={() => setActiveTab('burp_suite')}
            className={`px-4 py-2.5 text-xs font-semibold font-mono border-b-2 transition flex items-center gap-2 ${
              activeTab === 'burp_suite'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Burp Suite Proxy Simulator</span>
          </button>
          <button
            onClick={() => setActiveTab('report_analysis')}
            className={`px-4 py-2.5 text-xs font-semibold font-mono border-b-2 transition flex items-center gap-2 ${
              activeTab === 'report_analysis'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Finding Triage & False Positives</span>
          </button>
        </div>

        <button
          onClick={handleReset}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 px-3 py-1 rounded border border-slate-800 hover:bg-slate-800 transition mb-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Lab</span>
        </button>
      </div>

      {/* Tab 1: Terminal Console */}
      {activeTab === 'terminal' && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl font-mono text-xs">
          {/* Terminal Window Header */}
          <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
              <span className="text-slate-400 ml-2 font-bold">webseclab@scanner-box:~</span>
            </div>
            <div className="text-[10px] text-slate-500">
              Interactive Simulated Shell (Safe Allowlist)
            </div>
          </div>

          {/* Terminal Scroll Body */}
          <div className="p-4 h-96 overflow-y-auto space-y-3 bg-black/60">
            {history.map((item, idx) => (
              <div key={idx} className="space-y-1">
                {item.cmd && item.cmd !== 'welcome' && (
                  <div className="flex items-center gap-2 text-cyan-400">
                    <span className="text-slate-500 font-bold">webseclab@scanner:~$</span>
                    <span>{item.cmd}</span>
                  </div>
                )}
                <pre className={`whitespace-pre-wrap font-mono leading-relaxed ${
                  item.isError ? 'text-rose-400' : 'text-slate-300'
                }`}>
                  {item.output}
                </pre>
              </div>
            ))}

            {isScanning && (
              <div className="flex items-center gap-2 text-cyan-400 animate-pulse">
                <span>[⚙] Scanner actively enumerating ports, headers, and paths...</span>
              </div>
            )}
            <div ref={terminalEndRef} />
          </div>

          {/* Terminal Input Bar */}
          <form onSubmit={handleCommandSubmit} className="bg-slate-900 border-t border-slate-800 p-3 flex items-center gap-2">
            <span className="text-cyan-400 font-bold">webseclab@scanner:~$</span>
            <input
              type="text"
              value={inputCommand}
              onChange={(e) => setInputCommand(e.target.value)}
              placeholder="Try: nikto -h http://target-app.local or zap-cli quick-scan"
              className="flex-1 bg-transparent border-none text-white focus:outline-none font-mono text-xs"
              autoFocus
            />
            <button
              type="submit"
              className="px-3 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
            >
              Run
            </button>
          </form>

          {/* Quick Buttons Bar */}
          <div className="bg-slate-950 px-4 py-2 border-t border-slate-800/80 flex items-center gap-2 text-[11px] text-slate-400">
            <span>Quick Commands:</span>
            <button
              onClick={() => { setInputCommand('nikto -h http://target-app.local'); }}
              className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-800"
            >
              nikto scan
            </button>
            <button
              onClick={() => { setInputCommand('zap-cli quick-scan'); }}
              className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-800"
            >
              zap quick-scan
            </button>
            <button
              onClick={() => { setInputCommand('zap-cli alerts'); }}
              className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-800"
            >
              zap alerts
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Burp Suite Proxy Simulator */}
      {activeTab === 'burp_suite' && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <span className="font-bold text-white text-sm">Burp Suite Intercept Simulator</span>
              <button
                onClick={() => setInterceptActive(!interceptActive)}
                className={`px-3 py-1 rounded text-xs font-bold transition ${
                  interceptActive ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {interceptActive ? 'Intercept is ON' : 'Intercept is OFF'}
              </button>
            </div>
            <span className="text-[10px] text-slate-500">Proxy: 127.0.0.1:8080</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Raw HTTP Request View with Tamperable Parameters */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
              <span className="text-slate-400 uppercase font-semibold text-[10px] block">Captured HTTP Request:</span>
              
              <div className="bg-black/60 p-3 rounded-lg border border-slate-800 text-cyan-300 leading-relaxed font-mono">
                <div>POST /api/v1/checkout HTTP/1.1</div>
                <div>Host: target-shop.local</div>
                <div>Cookie: session_id=88319f; role=student</div>
                <div>Content-Type: application/json</div>
                <div className="my-2 border-t border-slate-800"></div>
                
                {/* JSON Body Inputs */}
                <div className="space-y-2 text-slate-200">
                  <div className="text-slate-500">&#123;</div>
                  <div className="pl-4">
                    &quot;item_id&quot;: 401,
                  </div>
                  <div className="pl-4 flex items-center gap-2">
                    <span>&quot;price&quot;:</span>
                    <input
                      type="text"
                      value={requestPrice}
                      onChange={(e) => setRequestPrice(e.target.value)}
                      className="w-20 bg-slate-950 border border-cyan-500 rounded px-1.5 py-0.5 text-cyan-300 text-center font-bold"
                    />
                    <span className="text-[10px] text-slate-500">(Try changing to 0.01)</span>
                  </div>
                  <div className="pl-4 flex items-center gap-2">
                    <span>&quot;role&quot;:</span>
                    <input
                      type="text"
                      value={requestRole}
                      onChange={(e) => setRequestRole(e.target.value)}
                      className="w-24 bg-slate-950 border border-cyan-500 rounded px-1.5 py-0.5 text-cyan-300 text-center font-bold"
                    />
                    <span className="text-[10px] text-slate-500">(Try changing to admin)</span>
                  </div>
                  <div className="text-slate-500">&#125;</div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleBurpForward}
                  className="flex-1 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>Forward Request to Server</span>
                </button>
                <button
                  onClick={() => { setRequestPrice('99.99'); setRequestRole('student'); }}
                  className="px-3 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs"
                >
                  Drop / Reset
                </button>
              </div>
            </div>

            {/* Server HTTP Response View */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
              <span className="text-slate-400 uppercase font-semibold text-[10px] block">Server HTTP Response:</span>
              
              {burpResponse ? (
                <div className="bg-black/60 p-3 rounded-lg border border-slate-800 text-emerald-300 font-mono whitespace-pre-wrap leading-relaxed">
                  {burpResponse}
                </div>
              ) : (
                <div className="text-xs text-slate-500 italic py-16 text-center">
                  Tamper with price or role parameters, then click &quot;Forward Request to Server&quot; to inspect the server response.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Finding Triage & False Positives */}
      {activeTab === 'report_analysis' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4 text-xs font-mono">
          <div className="border-b border-slate-800 pb-2">
            <h4 className="font-bold text-white text-sm">Security Findings Triage & False Positive Analysis</h4>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Automated tools generate dozens of alerts. A professional security analyst must evaluate each finding to determine if it is an actionable vulnerability or a false positive.
            </p>
          </div>

          <div className="space-y-4">
            {/* Finding 1 */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-amber-400 font-bold">1. Server Banner Disclosure: Apache/2.2.8 (Ubuntu)</span>
                <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded text-slate-400 border border-slate-800">Nikto Finding</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                The server returns exact version numbers in HTTP responses, exposing known CVEs for Apache 2.2.8.
              </p>
              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                  <input
                    type="radio"
                    name="finding1"
                    value="true_positive"
                    checked={triageAnswers.finding1 === 'true_positive'}
                    onChange={() => setTriageAnswers(prev => ({ ...prev, finding1: 'true_positive' }))}
                  />
                  <span>True Positive (Information Disclosure)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                  <input
                    type="radio"
                    name="finding1"
                    value="false_positive"
                    checked={triageAnswers.finding1 === 'false_positive'}
                    onChange={() => setTriageAnswers(prev => ({ ...prev, finding1: 'false_positive' }))}
                  />
                  <span>False Positive</span>
                </label>
              </div>
            </div>

            {/* Finding 2 */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-rose-400 font-bold">2. SQL Injection Detected in /api/search?q=</span>
                <span className="text-[10px] bg-rose-950/80 px-2 py-0.5 rounded text-rose-300 border border-rose-800/40">ZAP High Alert</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Active fuzzer transmitted single quotes and detected database syntax error leaks.
              </p>
              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                  <input
                    type="radio"
                    name="finding3"
                    value="true_positive"
                    checked={triageAnswers.finding3 === 'true_positive'}
                    onChange={() => setTriageAnswers(prev => ({ ...prev, finding3: 'true_positive' }))}
                  />
                  <span>True Positive (Critical Injection)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                  <input
                    type="radio"
                    name="finding3"
                    value="false_positive"
                    checked={triageAnswers.finding3 === 'false_positive'}
                    onChange={() => setTriageAnswers(prev => ({ ...prev, finding3: 'false_positive' }))}
                  />
                  <span>False Positive</span>
                </label>
              </div>
            </div>
          </div>

          <button
            onClick={handleTriageSubmit}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-slate-950 font-bold text-xs"
          >
            Submit Findings Triage Assessment
          </button>
        </div>
      )}

      {/* Completion Banner */}
      {(hasRunNikto || hasRunZap || hasTamperedBurp) && (
        <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-xl p-5 flex items-center gap-4 text-emerald-300">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
          <div>
            <h4 className="font-bold text-white text-base">Lab Challenge Solved! (+130 Points)</h4>
            <p className="text-xs text-emerald-200/90 leading-relaxed">
              You executed scans with Nikto and OWASP ZAP, triaged vulnerability findings, and simulated HTTP parameter tampering in Burp Suite to highlight why server-side validation is non-negotiable.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
