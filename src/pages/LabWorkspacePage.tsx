import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  BookOpen, 
  Code, 
  Lightbulb, 
  ShieldCheck, 
  CheckCircle, 
  Clock, 
  Award, 
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { LABS } from '../data/labs';
import { useProgress } from '../context/ProgressContext';
import { XssSandbox } from '../components/sandboxes/XssSandbox';
import { SqlInjectionSandbox } from '../components/sandboxes/SqlInjectionSandbox';
import { CsrfSandbox } from '../components/sandboxes/CsrfSandbox';
import { AuthSessionSandbox } from '../components/sandboxes/AuthSessionSandbox';
import { IdorSandbox } from '../components/sandboxes/IdorSandbox';
import { FileUploadSandbox } from '../components/sandboxes/FileUploadSandbox';
import { SecurityHeadersSandbox } from '../components/sandboxes/SecurityHeadersSandbox';
import { ScannerSandbox } from '../components/sandboxes/ScannerSandbox';

export const LabWorkspacePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { getLabProgress, markLabStarted, completeLab, recordHintUsed } = useProgress();

  const lab = LABS.find(l => l.slug === slug);
  const initialProgress = lab ? getLabProgress(lab.id) : null;

  const [activeTab, setActiveTab] = useState<'workspace' | 'theory' | 'code_diff' | 'remediation'>('workspace');
  const [unlockedHints, setUnlockedHints] = useState<number[]>(() => initialProgress?.hintsUsed || []);

  useEffect(() => {
    if (lab) {
      markLabStarted(lab.id);
    }
  }, [lab?.id]);

  if (!lab) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Lab Not Found</h2>
        <p className="text-slate-400 mb-6">The requested virtual security lab does not exist.</p>
        <Link to="/labs" className="px-4 py-2 bg-cyan-500 text-slate-950 font-semibold rounded-lg">
          Return to Lab Catalogue
        </Link>
      </div>
    );
  }

  const progress = getLabProgress(lab.id);
  const isCompleted = progress.status === 'completed';

  const handleUnlockHint = (hintId: number) => {
    if (!unlockedHints.includes(hintId)) {
      setUnlockedHints(prev => [...prev, hintId]);
      recordHintUsed(lab.id, hintId);
    }
  };

  const handleLabSolve = (earnedScore: number) => {
    completeLab(lab.id, earnedScore, lab.points);
  };

  const renderSandbox = () => {
    switch (lab.id) {
      case 'lab-xss-01':
        return <XssSandbox onComplete={handleLabSolve} />;
      case 'lab-sqli-02':
        return <SqlInjectionSandbox onComplete={handleLabSolve} />;
      case 'lab-csrf-03':
        return <CsrfSandbox onComplete={handleLabSolve} />;
      case 'lab-auth-04':
        return <AuthSessionSandbox onComplete={handleLabSolve} />;
      case 'lab-idor-05':
        return <IdorSandbox onComplete={handleLabSolve} />;
      case 'lab-upload-06':
        return <FileUploadSandbox onComplete={handleLabSolve} />;
      case 'lab-headers-07':
        return <SecurityHeadersSandbox onComplete={handleLabSolve} />;
      case 'lab-tools-08':
        return <ScannerSandbox onComplete={handleLabSolve} />;
      default:
        return <div>Sandbox coming soon</div>;
    }
  };

  // Find next lab in sequence
  const currentIndex = LABS.findIndex(l => l.id === lab.id);
  const nextLab = currentIndex < LABS.length - 1 ? LABS[currentIndex + 1] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Breadcrumb & Status Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <Link
            to="/labs"
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
            aria-label="Back to Labs Catalogue"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">{lab.category}</span>
              <span className="text-slate-600">•</span>
              <span className="text-xs font-mono text-slate-400">{lab.difficulty}</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{lab.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>~{lab.estimatedMinutes} mins</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-cyan-300">
            <Award className="w-4 h-4 text-cyan-400" />
            <span>{lab.points} XP</span>
          </div>

          {isCompleted && (
            <div className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-bold">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>COMPLETED ({progress.score} pts)</span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800">
        <button
          onClick={() => setActiveTab('workspace')}
          className={`py-3 px-4 text-xs font-mono font-semibold flex items-center gap-2 border-b-2 transition ${
            activeTab === 'workspace'
              ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code className="w-4 h-4" />
          <span>Interactive Workspace</span>
        </button>

        <button
          onClick={() => setActiveTab('theory')}
          className={`py-3 px-4 text-xs font-mono font-semibold flex items-center gap-2 border-b-2 transition ${
            activeTab === 'theory'
              ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Theory & Attack Vectors</span>
        </button>

        <button
          onClick={() => setActiveTab('code_diff')}
          className={`py-3 px-4 text-xs font-mono font-semibold flex items-center gap-2 border-b-2 transition ${
            activeTab === 'code_diff'
              ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Vulnerable vs Secure Code</span>
        </button>

        <button
          onClick={() => setActiveTab('remediation')}
          className={`py-3 px-4 text-xs font-mono font-semibold flex items-center gap-2 border-b-2 transition ${
            activeTab === 'remediation'
              ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Lightbulb className="w-4 h-4" />
          <span>Remediation & Standards</span>
        </button>
      </div>

      {/* Tab 1: Interactive Workspace */}
      {activeTab === 'workspace' && (
        <div className="space-y-6">
          {renderSandbox()}

          {/* Contextual Hints Box */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>Lab Contextual Hints ({unlockedHints.length}/{lab.hints.length} unlocked)</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {lab.hints.map(hint => {
                const isUnlocked = unlockedHints.includes(hint.id);
                return (
                  <div
                    key={hint.id}
                    className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-xs flex flex-col justify-between"
                  >
                    <div>
                      <span className="font-mono text-slate-400 font-bold block mb-1">
                        Hint #{hint.id}
                      </span>
                      {isUnlocked ? (
                        <p className="text-slate-200 leading-relaxed">{hint.text}</p>
                      ) : (
                        <p className="text-slate-500 italic">Click unlock to reveal assistance (-{hint.costPoints} pts hint penalty)</p>
                      )}
                    </div>
                    {!isUnlocked && (
                      <button
                        onClick={() => handleUnlockHint(hint.id)}
                        className="mt-3 px-2 py-1 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs font-mono font-semibold self-start"
                      >
                        Unlock Hint (-{hint.costPoints} pts)
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Theory & Attack Vectors */}
      {activeTab === 'theory' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-6 text-sm">
          <div>
            <h3 className="text-lg font-bold text-white mb-2">Vulnerability Overview</h3>
            <p className="text-slate-300 leading-relaxed">{lab.theory.overview}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <h4 className="text-sm font-semibold text-rose-400 mb-2 font-mono uppercase">Attack Vector & Mechanics</h4>
              <p className="text-slate-300 text-xs leading-relaxed">{lab.theory.attackVector}</p>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <h4 className="text-sm font-semibold text-rose-400 mb-2 font-mono uppercase">Potential Business Impact</h4>
              <p className="text-slate-300 text-xs leading-relaxed">{lab.theory.impact}</p>
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold text-emerald-400 mb-2 font-mono uppercase">Primary Prevention Strategy</h3>
            <p className="text-slate-300 leading-relaxed">{lab.theory.prevention}</p>
          </div>

          <div className="border-t border-slate-800 pt-4">
            <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold mb-2">Target Learning Objectives</h4>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-300">
              {lab.learningObjectives.map((obj, i) => (
                <li key={i}>{obj}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Tab 3: Vulnerable vs Secure Code */}
      {activeTab === 'code_diff' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white mb-1">Architectural Code Comparison</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{lab.codeComparison.explanation}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono text-xs">
            {/* Vulnerable Code Block */}
            <div className="bg-slate-950 border border-rose-900/50 rounded-xl overflow-hidden">
              <div className="bg-rose-950/60 px-4 py-2 border-b border-rose-900/50 text-rose-300 font-bold flex items-center justify-between">
                <span>VULNERABLE IMPLEMENTATION</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-900/80 text-rose-200">INSECURE</span>
              </div>
              <pre className="p-4 text-rose-200/90 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                {lab.codeComparison.vulnerableCode}
              </pre>
            </div>

            {/* Secure Code Block */}
            <div className="bg-slate-950 border border-emerald-900/50 rounded-xl overflow-hidden">
              <div className="bg-emerald-950/60 px-4 py-2 border-b border-emerald-900/50 text-emerald-300 font-bold flex items-center justify-between">
                <span>REMEDIATED SECURE IMPLEMENTATION</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-900/80 text-emerald-200">HARDENED</span>
              </div>
              <pre className="p-4 text-emerald-200/90 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                {lab.codeComparison.secureCode}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Remediation Guidance & Standards */}
      {activeTab === 'remediation' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-6 text-sm">
          <div>
            <h3 className="text-base font-bold text-white mb-3">Defense-in-Depth Remediation Steps</h3>
            <div className="space-y-2.5">
              {lab.remediationGuidance.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                  <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 flex items-center justify-center font-mono font-bold shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-slate-300 leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* External Authoritative References */}
          <div className="border-t border-slate-800 pt-4">
            <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold mb-3">Authoritative Standards & Cheat Sheets</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {lab.externalReferences.map((ref, idx) => (
                <a
                  key={idx}
                  href={ref.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800 text-xs text-cyan-400 hover:text-cyan-300 flex items-center justify-between transition group"
                >
                  <span className="font-medium group-hover:underline">{ref.title}</span>
                  <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-800/80">
        <Link
          to="/labs"
          className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Labs Catalogue</span>
        </Link>

        {nextLab && (
          <button
            onClick={() => {
              navigate(`/lab/${nextLab.slug}`);
              setActiveTab('workspace');
            }}
            className="py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-400 hover:text-white flex items-center gap-2 transition"
          >
            <span>Next Lab: {nextLab.title}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
