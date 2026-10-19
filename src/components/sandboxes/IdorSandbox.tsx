import React, { useState } from 'react';
import { ShieldCheck, Play, RotateCcw, CheckCircle2, AlertTriangle, UserCheck } from 'lucide-react';

interface IdorSandboxProps {
  onComplete: (score: number) => void;
}

export const IdorSandbox: React.FC<IdorSandboxProps> = ({ onComplete }) => {
  const [requestedId, setRequestedId] = useState('1042');
  const [authCheckMode, setAuthCheckMode] = useState<'vulnerable' | 'enforced'>('vulnerable');
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseData, setResponseData] = useState<any | null>(null);

  const [hasExploitedIdor, setHasExploitedIdor] = useState(false);
  const [hasValidatedEnforcement, setHasValidatedEnforcement] = useState(false);

  // Simulated backend patient records
  const medicalRecordsDatabase: Record<string, any> = {
    '1042': {
      recordId: 1042,
      ownerUserId: 'user_101',
      patientName: 'Alex Vance (You)',
      dob: '2001-04-12',
      diagnosis: 'Routine Dental Cleaning & Cavity Fill',
      confidentialNotes: 'Patient advised to floss twice daily.',
      billingAmount: '$150.00'
    },
    '1043': {
      recordId: 1043,
      ownerUserId: 'user_882',
      patientName: 'Senator Robert Gray',
      dob: '1962-11-03',
      diagnosis: 'CONFIDENTIAL: Cardiology Arterial Stent Follow-up',
      confidentialNotes: 'High-profile public official. Strict privacy required.',
      billingAmount: '$14,200.00'
    },
    '1044': {
      recordId: 1044,
      ownerUserId: 'user_404',
      patientName: 'Tech CEO Victoria Lin',
      dob: '1985-07-22',
      diagnosis: 'CONFIDENTIAL: Psychiatric Consultation & Medication Protocol',
      confidentialNotes: 'Executive stress management.',
      billingAmount: '$6,800.00'
    }
  };

  const handleFetchRecord = () => {
    const record = medicalRecordsDatabase[requestedId];

    if (!record) {
      setResponseStatus(404);
      setResponseData({ error: 'Record not found in hospital database' });
      return;
    }

    if (authCheckMode === 'vulnerable') {
      // Flawed: no ownership check!
      setResponseStatus(200);
      setResponseData(record);
      if (requestedId !== '1042') {
        setHasExploitedIdor(true);
      }
    } else {
      // Enforced server-side ownership check
      if (record.ownerUserId === 'user_101') {
        setResponseStatus(200);
        setResponseData(record);
      } else {
        setResponseStatus(403);
        setResponseData({
          error: 'HTTP 403 Forbidden: Access Denied',
          detail: `User 'user_101' does not have permission to view record #${requestedId} (Owned by ${record.ownerUserId}). Authorization check enforced.`
        });
        if (hasExploitedIdor) {
          setHasValidatedEnforcement(true);
          onComplete(120);
        }
      }
    }
  };

  const handleReset = () => {
    setRequestedId('1042');
    setAuthCheckMode('vulnerable');
    setResponseStatus(null);
    setResponseData(null);
    setHasExploitedIdor(false);
  };

  return (
    <div className="space-y-6">
      {/* Exercise Instructions */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
        <h3 className="text-base font-semibold text-white flex items-center gap-2 mb-2">
          <UserCheck className="w-5 h-5 text-cyan-400" />
          <span>Interactive Task: Exploit IDOR & Enforce Server-Side Object Authorization</span>
        </h3>
        <p className="text-sm text-slate-300 mb-2">
          1. <strong>Step 1:</strong> You are authenticated as student <strong className="text-white">Alex Vance</strong> (owner of record #1042). Change the requested record ID in the API client to <code className="text-rose-300 font-mono text-xs">1043</code> to view another patient&apos;s confidential medical records.
        </p>
        <p className="text-sm text-slate-300 mb-3">
          2. <strong>Step 2:</strong> Switch to <em>Enforced Server Authorization</em> mode, re-run the request, and observe how binding record access to the session identity blocks the breach.
        </p>

        {/* Progress Tracker */}
        <div className="flex items-center gap-4 text-xs font-mono pt-2 border-t border-slate-800/80">
          <span className={`flex items-center gap-1.5 ${hasExploitedIdor ? 'text-emerald-400' : 'text-slate-500'}`}>
            <span className={`w-2 h-2 rounded-full ${hasExploitedIdor ? 'bg-emerald-400' : 'bg-slate-600'}`}></span>
            1. Exploit IDOR (#1043)
          </span>
          <span className={`flex items-center gap-1.5 ${hasValidatedEnforcement ? 'text-emerald-400' : 'text-slate-500'}`}>
            <span className={`w-2 h-2 rounded-full ${hasValidatedEnforcement ? 'bg-emerald-400' : 'bg-slate-600'}`}></span>
            2. Enforce Access Control Policy
          </span>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-2 rounded-xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAuthCheckMode('vulnerable')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition ${
              authCheckMode === 'vulnerable'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>Vulnerable: Direct Database Lookup (No Auth Check)</span>
          </button>
          <button
            onClick={() => setAuthCheckMode('enforced')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition ${
              authCheckMode === 'enforced'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Secure: Enforce (record.ownerId === session.userId)</span>
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

      {/* 2-Column Split: API Client vs Server Response */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Simulated API Request Client */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-mono text-cyan-400 font-semibold uppercase">Simulated REST API Client</span>
            <span className="text-[10px] font-mono text-slate-400">Authenticated: user_101</span>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Target Endpoint URL:</label>
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-1 text-sm font-mono text-slate-300">
              <span className="px-2 text-xs font-bold text-emerald-400">GET</span>
              <span className="text-slate-500">/api/v1/patients/</span>
              <input
                type="text"
                value={requestedId}
                onChange={(e) => setRequestedId(e.target.value)}
                className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-cyan-300 text-center font-bold focus:outline-none focus:border-cyan-500"
              />
              <span className="text-slate-500 ml-1">/medical-file</span>
            </div>
          </div>

          {/* Quick Target Record Buttons */}
          <div className="space-y-1.5 pt-2">
            <span className="text-xs text-slate-400 block mb-1">Quick Select Records:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setRequestedId('1042')}
                className="text-xs font-mono px-2.5 py-1.5 rounded bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800"
              >
                #1042 (Your Own Record)
              </button>
              <button
                onClick={() => setRequestedId('1043')}
                className="text-xs font-mono px-2.5 py-1.5 rounded bg-slate-950 hover:bg-slate-800 text-rose-300 border border-rose-900/40"
              >
                #1043 (Senator Gray - Unauthorized)
              </button>
              <button
                onClick={() => setRequestedId('1044')}
                className="text-xs font-mono px-2.5 py-1.5 rounded bg-slate-950 hover:bg-slate-800 text-rose-300 border border-rose-900/40"
              >
                #1044 (CEO Victoria - Unauthorized)
              </button>
            </div>
          </div>

          {/* Under the hood server code */}
          <div className="bg-slate-950 p-3 rounded border border-slate-800 font-mono text-xs text-slate-400">
            <span className="text-slate-500 block text-[10px] uppercase font-semibold mb-1">Server Authorization Logic:</span>
            {authCheckMode === 'vulnerable' ? (
              <pre className="text-rose-400 text-[11px] whitespace-pre-wrap">
{`// Vulnerable: Blind query by ID
const file = await db.query(
  "SELECT * FROM records WHERE id = $1", [req.params.id]
);
return res.json(file);`}
              </pre>
            ) : (
              <pre className="text-emerald-400 text-[11px] whitespace-pre-wrap">
{`// Secure: Validating tenant ownership
const file = await db.query("SELECT * FROM records WHERE id = $1", [req.params.id]);
if (file.ownerUserId !== req.session.userId) {
  return res.status(403).json({ error: "Access Denied" });
}`}
              </pre>
            )}
          </div>

          <button
            onClick={handleFetchRecord}
            className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition mt-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Send GET Request to Endpoint</span>
          </button>
        </div>

        {/* Right: Server Response JSON Viewer */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <span className="text-xs font-mono text-cyan-400 uppercase font-semibold">HTTP Response Inspector</span>
              {responseStatus && (
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                  responseStatus === 200 ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
                }`}>
                  HTTP {responseStatus}
                </span>
              )}
            </div>

            {responseData ? (
              <div className="space-y-3">
                {responseStatus === 200 && responseData.ownerUserId !== 'user_101' && (
                  <div className="bg-rose-950/70 border border-rose-500/40 p-3 rounded-lg text-xs text-rose-200">
                    <strong className="text-rose-300 block mb-0.5">🚨 PRIVACY VIOLATION DETECTED:</strong>
                    You just accessed private patient records belonging to <strong>{responseData.patientName}</strong> without authorization!
                  </div>
                )}

                <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg font-mono text-xs overflow-x-auto text-cyan-300">
                  <pre className="whitespace-pre-wrap">{JSON.stringify(responseData, null, 2)}</pre>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-500 italic py-12 text-center">
                No request sent yet. Click &quot;Send GET Request to Endpoint&quot; to inspect server response.
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-500 border-t border-slate-800/80 pt-3">
            Tip: In real-world web penetration tests, IDOR accounts for over 25% of all critical bug bounties in cloud API endpoints.
          </div>
        </div>
      </div>

      {/* Completion Banner */}
      {hasValidatedEnforcement && (
        <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-xl p-5 flex items-center gap-4 text-emerald-300">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
          <div>
            <h4 className="font-bold text-white text-base">Lab Challenge Solved! (+120 Points)</h4>
            <p className="text-xs text-emerald-200/90 leading-relaxed">
              You uncovered an Insecure Direct Object Reference by changing the numerical resource key, and verified that robust server-side ownership checks prevent horizontal data breaches.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
