import React, { useState } from 'react';
import { User, Award, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';

export const ProfilePage: React.FC = () => {
  const { user, isDemoMode, updateProfile } = useAuth();
  const { achievements, totalPoints, resetAllProgress } = useProgress();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({ fullName });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleReset = () => {
    resetAllProgress();
    setShowResetConfirm(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-cyan-600/30 border-2 border-cyan-500/50 flex items-center justify-center text-cyan-300 font-bold text-2xl shrink-0 shadow-lg shadow-cyan-500/10">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full rounded-full object-cover" />
          ) : (
            user?.fullName.charAt(0) || 'S'
          )}
        </div>

        <div className="space-y-1 text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">{user?.fullName}</h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800/40">
              {user?.rank || 'Security Cadet'}
            </span>
            {isDemoMode && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950 text-amber-400 border border-amber-800/40">
                DEMO PROFILE
              </span>
            )}
          </div>
          <div className="text-xs text-slate-400 font-mono flex items-center justify-center sm:justify-start gap-1">
            <Mail className="w-3.5 h-3.5" />
            <span>{user?.email}</span>
          </div>
          <div className="text-xs text-cyan-400 font-mono pt-1">
            Total Points: <strong className="text-white">{totalPoints} XP</strong>
          </div>
        </div>
      </div>

      {/* Profile Details Edit Form */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <User className="w-4 h-4 text-cyan-400" />
          <span>Student Account Details</span>
        </h3>

        {savedSuccess && (
          <div className="p-3 rounded-lg bg-emerald-950 border border-emerald-500/40 text-xs text-emerald-300 font-mono">
            Profile changes successfully updated.
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Display Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">University Email (Read Only)</label>
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="w-full bg-slate-950/60 border border-slate-800/60 rounded-lg px-3 py-2 text-xs font-mono text-slate-500 cursor-not-allowed"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition"
          >
            Save Profile Changes
          </button>
        </form>
      </div>

      {/* Badges & Achievements Collection */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <Award className="w-4 h-4 text-amber-400" />
          <span>Earned Security Badges & Achievements</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {achievements.map(a => {
            const isUnlocked = Boolean(a.unlockedAt);
            return (
              <div
                key={a.id}
                className={`p-4 rounded-xl border space-y-2 transition ${
                  isUnlocked
                    ? 'bg-slate-950 border-amber-500/40 text-white'
                    : 'bg-slate-950/40 border-slate-800/50 opacity-40 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isUnlocked ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-900 text-slate-600'
                  }`}>
                    <Award className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-mono text-amber-400 font-bold">+{a.points} XP</span>
                </div>
                <div className="font-bold text-sm">{a.title}</div>
                <div className="text-xs text-slate-400 leading-relaxed">{a.description}</div>
                {isUnlocked && (
                  <div className="text-[10px] font-mono text-emerald-400 pt-1">
                    ✓ Unlocked on {new Date(a.unlockedAt!).toLocaleDateString()}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Reset State Option */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-white">Reset Local Practice State</h4>
          <p className="text-xs text-slate-400">Clear all local lab completions and scores to replay all exercises from scratch.</p>
        </div>

        {!showResetConfirm ? (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-xs font-mono font-semibold border border-rose-800/40"
          >
            Reset Progress
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono font-bold"
            >
              Confirm Clear
            </button>
            <button
              onClick={() => setShowResetConfirm(false)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-mono"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
