import React, { useState } from 'react';
import { Play, RotateCcw, CheckCircle2, AlertTriangle, ShieldCheck, Bug, Eye } from 'lucide-react';

interface XssSandboxProps {
  onComplete: (score: number) => void;
}

export const XssSandbox: React.FC<XssSandboxProps> = ({ onComplete }) => {
  const [mode, setMode] = useState<'vulnerable' | 'secure'>('vulnerable');
  const [searchInput, setSearchInput] = useState('<img src=x onerror=alert("XSS_COMPROMISED")>');
  const [renderedOutput, setRenderedOutput] = useState('');
  const [hasExecutedScript, setHasExecutedScript] = useState(false);
  const [hasTestedSecure, setHasTestedSecure] = useState(false);
  const [simulatedAlertText, setSimulatedAlertText] = useState<string | null>(null);

  const samplePayloads = [
    '<img src=x onerror=alert("XSS_COMPROMISED")>',
    '<script>alert("Cookie: session_id=98a3b2")</script>',
    '<b onmouseover=alert("XSS")>Hover over me!</b>',
    '<a href="javascript:alert(\'XSS\')">Click here for prize!</a>'
  ];

  const handleTestPayload = () => {
    setSimulatedAlertText(null);
    setRenderedOutput(searchInput);

    if (mode === 'vulnerable') {
      // Simulate XSS execution
      if (
        searchInput.toLowerCase().includes('onerror') ||
        searchInput.toLowerCase().includes('<script') ||
        searchInput.toLowerCase().includes('javascript:') ||
        searchInput.toLowerCase().includes('onmouseover')
      ) {
        setHasExecutedScript(true);
        setSimulatedAlertText(
          searchInput.includes('session_id') 
            ? 'XSS Alert: Cookie accessed: session_id=98a3b2' 
            : 'Simulated Browser Alert: JavaScript Executed via DOM Injection!'
        );
      }
    } else {
      // Secure mode: text is escaped
      setSimulatedAlertText(null);
      if (hasExecutedScript) {
        setHasTestedSecure(true);
        onComplete(100);
      }
    }
  };

  const handleReset = () => {
    setSearchInput('<img src=x onerror=alert("XSS_COMPROMISED")>');
    setRenderedOutput('');
    setHasExecutedScript(false);
    setSimulatedAlertText(null);
  };

  return (
    <div className="space-y-6">
      {/* Exercise Instructions & Objective */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
        <h3 className="text-base font-semibold text-white flex items-center gap-2 mb-2">
          <Bug className="w-5 h-5 text-cyan-400" />
          <span>Interactive Task: Exploit and Remediate Reflected & DOM XSS</span>
        </h3>
        <p className="text-sm text-slate-300 mb-3">
          1. <strong>Step 1:</strong> In <em>Vulnerable Mode</em>, test the payload to observe how unsanitized input concatenated into <code className="text-rose-300 font-mono text-xs">innerHTML</code> executes scripts in the browser.
        </p>
        <p className="text-sm text-slate-300 mb-3">
          2. <strong>Step 2:</strong> Switch to <em>Secure Mode (Safe textContent)</em> and re-run the payload to observe safe output encoding.
        </p>
        
        {/* Progress Pill */}
        <div className="flex items-center gap-4 text-xs font-mono pt-2 border-t border-slate-800/80">
          <span className={`flex items-center gap-1.5 ${hasExecutedScript ? 'text-emerald-400' : 'text-slate-500'}`}>
            <span className={`w-2 h-2 rounded-full ${hasExecutedScript ? 'bg-emerald-400' : 'bg-slate-600'}`}></span>
            1. Trigger Vulnerability
          </span>
          <span className={`flex items-center gap-1.5 ${hasTestedSecure ? 'text-emerald-400' : 'text-slate-500'}`}>
            <span className={`w-2 h-2 rounded-full ${hasTestedSecure ? 'bg-emerald-400' : 'bg-slate-600'}`}></span>
            2. Validate Secure Defense
          </span>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-2 rounded-xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode('vulnerable')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition ${
              mode === 'vulnerable'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>Vulnerable Rendering (innerHTML)</span>
          </button>
          <button
            onClick={() => setMode('secure')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition ${
              mode === 'secure'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Secure Defense (textContent)</span>
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

      {/* Interactive Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Input & Payloads */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <label className="block text-xs font-mono text-slate-300 font-semibold uppercase tracking-wider">
            User Search Input (Payload)
          </label>
          <div className="relative">
            <textarea
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm font-mono text-cyan-300 focus:outline-none focus:border-cyan-500 transition"
              placeholder="Enter search term or HTML/JS payload..."
            />
          </div>

          {/* Quick Payloads */}
          <div>
            <div className="text-xs text-slate-400 mb-2">Sample Educational Payloads:</div>
            <div className="space-y-1.5">
              {samplePayloads.map((payload, idx) => (
                <button
                  key={idx}
                  onClick={() => setSearchInput(payload)}
                  className="w-full text-left text-xs font-mono px-2.5 py-1.5 rounded bg-slate-950/80 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800/80 truncate block transition"
                >
                  {payload}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleTestPayload}
            className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Render in Simulated Web App</span>
          </button>
        </div>

        {/* Right: Simulated Browser Window */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col">
          {/* Browser Chrome Header */}
          <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
            </div>
            <div className="flex-1 bg-slate-950 px-3 py-1 rounded text-xs font-mono text-slate-400 flex items-center gap-2 border border-slate-800">
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span>https://vuln-shop.local/search?q={encodeURIComponent(searchInput.slice(0, 20))}...</span>
            </div>
          </div>

          {/* Browser Viewport Content */}
          <div className="p-5 flex-1 space-y-4 min-h-[220px] bg-slate-950/90">
            <div className="border-b border-slate-800/80 pb-3">
              <h4 className="text-base font-bold text-white">Vulnerable Search App</h4>
              <p className="text-xs text-slate-400">Search results for the queried catalog item:</p>
            </div>

            {/* Simulated Alert Dialog Overlay */}
            {simulatedAlertText && (
              <div className="bg-rose-950/90 border border-rose-500/50 rounded-xl p-4 text-xs animate-bounce shadow-2xl">
                <div className="flex items-center gap-2 font-bold text-rose-300 mb-1">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>JavaScript Execution Triggered!</span>
                </div>
                <div className="text-rose-200 font-mono bg-black/40 p-2 rounded border border-rose-800/40">
                  {simulatedAlertText}
                </div>
              </div>
            )}

            {/* Result Display Box */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
              <div className="text-xs text-slate-400 font-mono mb-1">DOM Output Container:</div>
              {renderedOutput ? (
                mode === 'vulnerable' ? (
                  <div className="text-sm text-cyan-200 bg-black/30 p-3 rounded border border-slate-800 font-mono">
                    <span className="text-slate-500 font-mono text-xs block mb-1">Parsed as HTML element:</span>
                    <span dangerouslySetInnerHTML={{ __html: renderedOutput }} />
                  </div>
                ) : (
                  <div className="text-sm text-emerald-200 bg-black/30 p-3 rounded border border-emerald-900/40 font-mono">
                    <span className="text-emerald-500 font-mono text-xs block mb-1">Safely encoded as plain text:</span>
                    {renderedOutput}
                  </div>
                )
              ) : (
                <div className="text-xs text-slate-600 italic">No search executed yet. Click &quot;Render in Simulated Web App&quot;.</div>
              )}
            </div>

            {/* DOM Code Under the Hood */}
            <div className="bg-slate-950 p-3 rounded border border-slate-800 font-mono text-xs text-slate-400">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Active JavaScript Sink:</span>
              {mode === 'vulnerable' ? (
                <code className="text-rose-400">
                  document.getElementById(&apos;results&apos;).innerHTML = &apos;{searchInput}&apos;;
                </code>
              ) : (
                <code className="text-emerald-400">
                  document.getElementById(&apos;results&apos;).textContent = &apos;{searchInput}&apos;;
                </code>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Completion Banner */}
      {hasTestedSecure && (
        <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-xl p-5 flex items-center gap-4 text-emerald-300">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
          <div>
            <h4 className="font-bold text-white text-base">Lab Challenge Solved! (+100 Points)</h4>
            <p className="text-xs text-emerald-200/90 leading-relaxed">
              You observed how unsafe DOM manipulation via <code className="font-mono">innerHTML</code> allows script execution, and verified how modern DOM properties like <code className="font-mono">textContent</code> safely encode all special HTML characters.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
