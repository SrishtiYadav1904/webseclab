import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Clock, 
  CheckCircle2, 
  RotateCcw, 
  Printer, 
  ShieldCheck, 
  AlertCircle
} from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/quizzes';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';

export const FinalAssessmentPage: React.FC = () => {
  const { user } = useAuth();
  const { recordQuizResult } = useProgress();

  // Use a balanced set of questions across all categories
  const examQuestions = QUIZ_QUESTIONS.slice(0, 12);

  const [examStarted, setExamStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(900); // 15 mins
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [issueDate] = useState(() => new Date().toLocaleDateString());

  const handleSubmitExam = () => {
    let earned = 0;
    examQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswerIndex) {
        earned += 1;
      }
    });

    setFinalScore(earned);
    setExamSubmitted(true);
    recordQuizResult('Final Exam', earned, examQuestions.length);
  };

  // Timer countdown
  useEffect(() => {
    if (!examStarted || examSubmitted) return;

    const timer = setInterval(() => {
      setTimeLeftSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examStarted, examSubmitted]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStartExam = () => {
    setExamStarted(true);
    setExamSubmitted(false);
    setSelectedAnswers({});
    setCurrentIdx(0);
    setTimeLeftSeconds(900);
  };

  const handleSelectAnswer = (optIdx: number) => {
    if (examSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [currentIdx]: optIdx }));
  };

  const currentQ = examQuestions[currentIdx];
  const percentage = Math.round((finalScore / examQuestions.length) * 100);
  const isPassed = percentage >= 75;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Exam Intro Screen */}
      {!examStarted ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center mx-auto">
            <GraduationCap className="w-8 h-8" />
          </div>

          <div className="max-w-xl mx-auto space-y-3">
            <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
              WebSecLab Final Certification Exam
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Demonstrate comprehensive mastery across all 8 web application security domains. This standardized assessment contains 12 scenario-based questions with a 15-minute time limit.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto font-mono text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block">Total Questions</span>
              <strong className="text-cyan-400 text-sm">12 Questions</strong>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block">Time Limit</span>
              <strong className="text-cyan-400 text-sm">15 Minutes</strong>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block">Pass Threshold</span>
              <strong className="text-emerald-400 text-sm">75% Score</strong>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleStartExam}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/20 transition"
            >
              Begin Certification Assessment
            </button>
          </div>
        </div>
      ) : !examSubmitted ? (
        /* Active Exam Workspace */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          {/* Top Timer & Navigator */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-slate-950 text-cyan-400 text-xs font-mono font-bold border border-slate-800">
                Question {currentIdx + 1} of {examQuestions.length}
              </span>
              <span className="text-xs font-mono text-slate-400">• {currentQ.labCategory}</span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-amber-300">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>{formatTime(timeLeftSeconds)}</span>
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
              {currentQ.question}
            </h2>

            {currentQ.codeSnippet && (
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-cyan-300 overflow-x-auto">
                <pre>{currentQ.codeSnippet}</pre>
              </div>
            )}
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedAnswers[currentIdx] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectAnswer(idx)}
                  className={`w-full text-left p-4 rounded-xl border text-sm transition flex items-center gap-3 ${
                    isSelected
                      ? 'bg-cyan-950/70 border-cyan-500 text-cyan-200 font-semibold'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800/80'
                  }`}
                >
                  <span className="w-6 h-6 rounded-full bg-slate-900 border border-slate-700 text-xs font-mono flex items-center justify-center text-slate-400 shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Question Dots Bar */}
          <div className="flex items-center gap-1.5 flex-wrap pt-3 border-t border-slate-800">
            {examQuestions.map((_, idx) => {
              const answered = selectedAnswers[idx] !== undefined;
              const isCurrent = currentIdx === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentIdx(idx)}
                  className={`w-7 h-7 rounded text-xs font-mono font-bold transition ${
                    isCurrent
                      ? 'bg-cyan-500 text-slate-950'
                      : answered
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/50'
                      : 'bg-slate-950 text-slate-500 border border-slate-800'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Action Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              className="px-4 py-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-xs text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed font-mono"
            >
              Previous
            </button>

            {currentIdx < examQuestions.length - 1 ? (
              <button
                onClick={() => setCurrentIdx(prev => prev + 1)}
                className="px-6 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
              >
                Next Question
              </button>
            ) : (
              <button
                onClick={handleSubmitExam}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20"
              >
                Submit Exam For Grading
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Exam Outcome & Certificate */
        <div className="space-y-8">
          {/* Result Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto ${
              isPassed ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
            }`}>
              {isPassed ? <CheckCircle2 className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
            </div>

            <h2 className="text-2xl font-bold text-white">
              {isPassed ? 'Certification Exam Passed!' : 'Assessment Not Passed'}
            </h2>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 max-w-xs mx-auto font-mono">
              <div className="text-3xl font-black text-white">{percentage}%</div>
              <div className="text-xs text-slate-400 mt-1">
                {finalScore} of {examQuestions.length} questions correct
              </div>
            </div>

            <p className="text-xs text-slate-400 max-w-md mx-auto">
              {isPassed
                ? 'Congratulations! You met the certification requirements. Your official certificate of completion is displayed below.'
                : 'A minimum score of 75% is required for certificate issuance. Review the lab workspaces and try again.'}
            </p>

            <button
              onClick={handleStartExam}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-white inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Examination</span>
            </button>
          </div>

          {/* Official Certificate of Completion (Printable) */}
          {isPassed && (
            <div className="bg-slate-950 border-4 border-cyan-500/40 rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl space-y-8 text-center print:border-black print:text-black">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-cyan-400" />
                  <span className="font-bold text-white font-mono tracking-wider">WebSecLab ACADEMY</span>
                </div>
                <div className="text-xs font-mono text-cyan-400">
                  ID: WSL-CERT-2026-X99B-814A
                </div>
              </div>

              <div className="space-y-4 max-w-2xl mx-auto py-4">
                <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 block font-semibold">
                  CERTIFICATE OF ACADEMIC ACHIEVEMENT
                </span>

                <h3 className="text-xl sm:text-2xl font-medium text-slate-300">
                  This certifies that
                </h3>

                <div className="text-3xl sm:text-4xl font-extrabold text-white font-serif tracking-wide border-b-2 border-slate-800 pb-4">
                  {user?.fullName || 'Alex Vance'}
                </div>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  has successfully completed the required coursework, virtual hands-on laboratories, and passed the final comprehensive examination for:
                </p>

                <h4 className="text-lg sm:text-xl font-bold text-cyan-300 tracking-tight">
                  Interactive Web Application Security & Defense
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-8 border-t border-slate-800 pt-6 max-w-xl mx-auto text-xs font-mono text-slate-400">
                <div className="text-left">
                  <span className="text-slate-500 block">Issue Date</span>
                  <span className="text-white font-bold">{issueDate}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block">Validation Signature</span>
                  <span className="text-cyan-400 font-bold">Dr. Evelyn Reed (CISSP)</span>
                </div>
              </div>

              <div className="pt-4 flex justify-center">
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-300 hover:text-white flex items-center gap-2 transition"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Certificate / Save PDF</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
