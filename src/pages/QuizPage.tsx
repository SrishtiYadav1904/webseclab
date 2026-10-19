import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Sparkles
} from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/quizzes';
import type { LabCategory, QuizQuestion } from '../types';
import { useProgress } from '../context/ProgressContext';

export const QuizPage: React.FC = () => {
  const { recordQuizResult } = useProgress();

  const categories: (LabCategory | 'All')[] = [
    'All',
    'XSS',
    'SQL Injection',
    'CSRF',
    'Authentication',
    'Access Control',
    'File Security',
    'Security Headers',
    'Security Tools'
  ];

  const [selectedCategory, setSelectedCategory] = useState<LabCategory | 'All'>('All');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const filteredQuestions = selectedCategory === 'All'
    ? QUIZ_QUESTIONS
    : QUIZ_QUESTIONS.filter(q => q.labCategory === selectedCategory);

  const currentQ: QuizQuestion | undefined = filteredQuestions[currentQuestionIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || !currentQ) return;
    setIsAnswerSubmitted(true);

    if (selectedOption === currentQ.correctAnswerIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizFinished(true);
      recordQuizResult(selectedCategory === 'All' ? 'Final Exam' : selectedCategory, score + (selectedOption === currentQ?.correctAnswerIndex ? 1 : 0), filteredQuestions.length);
    }
  };

  const handleResetQuiz = (cat?: LabCategory | 'All') => {
    if (cat) setSelectedCategory(cat);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Quiz Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Award className="w-4 h-4" />
            <span>KNOWLEDGE CHECK & QUIZZES</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">AppSec Concept Assessments</h1>
          <p className="text-xs text-slate-400 mt-1">
            Validate your theoretical understanding with multiple-choice, true/false, and code-identification questions.
          </p>
        </div>

        <button
          onClick={() => handleResetQuiz()}
          className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restart Quiz</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => handleResetQuiz(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition ${
              selectedCategory === cat
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Quiz Workspace Card */}
      {!quizFinished && currentQ ? (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          {/* Progress & Category Top Bar */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs font-mono">
            <span className="text-cyan-400 font-semibold">{currentQ.labCategory}</span>
            <span className="text-slate-400">
              Question <strong>{currentQuestionIndex + 1}</strong> of {filteredQuestions.length}
            </span>
          </div>

          {/* Question Text */}
          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
              {currentQ.question}
            </h2>

            {/* Optional Code Snippet */}
            {currentQ.codeSnippet && (
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-cyan-300 overflow-x-auto">
                <pre>{currentQ.codeSnippet}</pre>
              </div>
            )}
          </div>

          {/* Options List */}
          <div className="space-y-3">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctAnswerIndex;

              let optionStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800/80';

              if (isAnswerSubmitted) {
                if (isCorrect) {
                  optionStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-semibold';
                } else if (isSelected) {
                  optionStyle = 'bg-rose-950/80 border-rose-500 text-rose-200 font-semibold';
                } else {
                  optionStyle = 'bg-slate-950/40 border-slate-800/40 text-slate-600 opacity-60';
                }
              } else if (isSelected) {
                optionStyle = 'bg-cyan-950/60 border-cyan-500 text-cyan-200 shadow-md shadow-cyan-500/10';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswerSubmitted}
                  className={`w-full text-left p-4 rounded-xl border text-sm transition flex items-center justify-between ${optionStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-900 border border-slate-700 text-xs font-mono flex items-center justify-center text-slate-400 shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </div>

                  {isAnswerSubmitted && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                  {isAnswerSubmitted && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box on Submit */}
          {isAnswerSubmitted && (
            <div className={`p-4 rounded-xl border text-xs leading-relaxed space-y-1 ${
              selectedOption === currentQ.correctAnswerIndex
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/60 border-rose-500/40 text-rose-200'
            }`}>
              <div className="font-bold flex items-center gap-2">
                {selectedOption === currentQ.correctAnswerIndex ? (
                  <span className="text-emerald-400 font-mono">✓ CORRECT ANSWER</span>
                ) : (
                  <span className="text-rose-400 font-mono">✗ INCORRECT</span>
                )}
              </div>
              <p className="text-slate-300">{currentQ.explanation}</p>
            </div>
          )}

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <div className="text-xs font-mono text-slate-400">
              Current Score: <strong className="text-cyan-400">{score}</strong> / {currentQuestionIndex + (isAnswerSubmitted ? 1 : 0)}
            </div>

            {!isAnswerSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null}
                className={`py-2 px-6 rounded-lg text-xs font-bold transition ${
                  selectedOption !== null
                    ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                Check Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="py-2 px-6 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md shadow-cyan-500/20 transition"
              >
                <span>{currentQuestionIndex < filteredQuestions.length - 1 ? 'Next Question' : 'View Quiz Results'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Quiz Finished Scorecard */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mx-auto">
            <Sparkles className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Quiz Assessment Completed!</h2>
            <p className="text-xs text-slate-400">
              Category: <strong className="text-cyan-400">{selectedCategory}</strong>
            </p>
          </div>

          <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 max-w-sm mx-auto space-y-2 font-mono">
            <div className="text-3xl font-black text-cyan-300">
              {score} / {filteredQuestions.length}
            </div>
            <div className="text-xs text-slate-400">
              Accuracy: {Math.round((score / filteredQuestions.length) * 100)}%
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => handleResetQuiz()}
              className="px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
            >
              Take Another Quiz
            </button>
            <button
              onClick={() => handleResetQuiz(selectedCategory)}
              className="px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
            >
              Retry This Category
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
