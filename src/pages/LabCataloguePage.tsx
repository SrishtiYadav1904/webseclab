import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Clock, 
  Award, 
  CheckCircle, 
  Play, 
  RotateCcw, 
  Terminal, 
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { LABS } from '../data/labs';
import type { Difficulty } from '../types';
import { useProgress } from '../context/ProgressContext';

export const LabCataloguePage: React.FC = () => {
  const { progressMap, completedLabsCount, totalLabsCount, overallPercentage } = useProgress();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  const categories: string[] = [
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

  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredLabs = LABS.filter(lab => {
    // Search filter
    const matchesSearch = 
      lab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.category.toLowerCase().includes(searchQuery.toLowerCase());

    // Difficulty filter
    const matchesDifficulty = selectedDifficulty === 'All' || lab.difficulty === selectedDifficulty;

    // Category filter
    const matchesCategory = selectedCategory === 'All' || lab.category === selectedCategory;

    // Status filter
    const labStatus = progressMap[lab.id]?.status || 'not_started';
    const matchesStatus = selectedStatus === 'All' || labStatus === selectedStatus;

    return matchesSearch && matchesDifficulty && matchesCategory && matchesStatus;
  });

  const getDifficultyColor = (diff: Difficulty) => {
    switch (diff) {
      case 'Beginner':
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-800/40';
      case 'Intermediate':
        return 'text-cyan-400 bg-cyan-950/60 border-cyan-800/40';
      case 'Advanced':
        return 'text-violet-400 bg-violet-950/60 border-violet-800/40';
      default:
        return 'text-slate-400 bg-slate-900 border-slate-800';
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedDifficulty('All');
    setSelectedCategory('All');
    setSelectedStatus('All');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-cyan-950 text-cyan-400 border border-cyan-800/40">
            <Terminal className="w-3.5 h-3.5" />
            <span>8 HANDS-ON INTERACTIVE LAB MODULES</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
            Virtual Security Lab Catalogue
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Gain practical, hands-on experience identifying and remediating real-world web application vulnerabilities. Practice harmless payloads inside contained, simulated environments.
          </p>

          {/* Quick Stats Bar */}
          <div className="pt-2 flex items-center gap-6 text-xs font-mono">
            <div>
              <span className="text-slate-400">Total Progress:</span>{' '}
              <strong className="text-cyan-400">{completedLabsCount}/{totalLabsCount} Completed ({overallPercentage}%)</strong>
            </div>
            <div className="w-32 bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-cyan-400 h-full transition-all duration-500" style={{ width: `${overallPercentage}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search labs by vulnerability, tool, or keyword..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Difficulty Dropdown */}
          <div>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              {difficulties.map(d => (
                <option key={d} value={d}>Difficulty: {d}</option>
              ))}
            </select>
          </div>

          {/* Status Dropdown */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="All">Status: All</option>
              <option value="completed">Status: Completed</option>
              <option value="in_progress">Status: In Progress</option>
              <option value="not_started">Status: Not Started</option>
            </select>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center justify-between border-t border-slate-800/80 pt-3 flex-wrap gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
            <span className="text-[11px] font-mono text-slate-500 uppercase mr-1">Category:</span>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {(searchQuery || selectedDifficulty !== 'All' || selectedCategory !== 'All' || selectedStatus !== 'All') && (
            <button
              onClick={handleClearFilters}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 px-2.5 py-1 rounded hover:bg-slate-800"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Labs Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono text-slate-400">
            Showing <strong className="text-white">{filteredLabs.length}</strong> of {LABS.length} virtual labs
          </span>
        </div>

        {filteredLabs.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center space-y-3">
            <ShieldAlert className="w-10 h-10 text-slate-500 mx-auto" />
            <h3 className="text-base font-bold text-white">No Labs Match Your Search</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Try adjusting your search keywords, difficulty, or category filters to find available virtual lab exercises.
            </p>
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-mono"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLabs.map((lab) => {
              const progress = progressMap[lab.id];
              const isCompleted = progress?.status === 'completed';
              const isInProgress = progress?.status === 'in_progress';

              return (
                <div
                  key={lab.id}
                  className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 flex flex-col justify-between transition group shadow-lg hover:shadow-cyan-500/5 relative"
                >
                  <div>
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-slate-950 text-cyan-400 border border-cyan-800/30 font-semibold">
                        {lab.category}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getDifficultyColor(lab.difficulty)}`}>
                        {lab.difficulty}
                      </span>
                    </div>

                    {/* Title & Summary */}
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition tracking-tight mb-2">
                      {lab.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-3">
                      {lab.summary}
                    </p>

                    {/* Objectives summary */}
                    <div className="space-y-1 mb-4 border-t border-slate-800/80 pt-3">
                      <span className="text-[10px] font-mono uppercase text-slate-500 block font-semibold">Key Topics:</span>
                      <div className="flex flex-wrap gap-1">
                        {lab.learningObjectives.slice(0, 2).map((obj, i) => (
                          <span key={i} className="text-[11px] bg-slate-950 px-2 py-0.5 rounded text-slate-300 truncate max-w-full block">
                            • {obj.replace(/\.$/, '')}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Metadata & CTA */}
                  <div className="border-t border-slate-800/80 pt-4 mt-2">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{lab.estimatedMinutes}m</span>
                      </span>
                      <span className="flex items-center gap-1 text-cyan-300">
                        <Award className="w-3.5 h-3.5" />
                        <span>{lab.points} XP</span>
                      </span>
                    </div>

                    <Link
                      to={`/lab/${lab.slug}`}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition ${
                        isCompleted
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900/60'
                          : isInProgress
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                          : 'bg-slate-800 hover:bg-slate-700 text-white'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                          <span>Review Completed Lab ({progress.score} pts)</span>
                        </>
                      ) : isInProgress ? (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Continue Exercise</span>
                        </>
                      ) : (
                        <>
                          <span>Start Lab Challenge</span>
                          <ChevronRight className="w-4 h-4" />
                        </>
                      )}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
