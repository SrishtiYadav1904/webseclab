import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Award, 
  Clock,
  BookOpen, 
  Play, 
  ArrowRight, 
  TrendingUp, 
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { LABS } from '../data/labs';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { 
    progressMap, 
    achievements, 
    totalPoints, 
    completedLabsCount, 
    totalLabsCount, 
    overallPercentage,
    categoryStats 
  } = useProgress();

  // Find next recommended lab (first one in_progress or not_started)
  const nextLab = LABS.find(l => progressMap[l.id]?.status !== 'completed') || LABS[0];

  // Recently attempted labs
  const recentLabs = LABS.filter(l => progressMap[l.id]?.attemptsCount && progressMap[l.id]?.attemptsCount > 0)
    .sort((a, b) => {
      const timeA = progressMap[a.id]?.lastAttemptAt || '';
      const timeB = progressMap[b.id]?.lastAttemptAt || '';
      return timeB.localeCompare(timeA);
    })
    .slice(0, 4);

  const unlockedAchievementsCount = achievements.filter(a => a.unlockedAt).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-cyan-950/40 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800/40">
              {user?.rank || 'Security Cadet'}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400 font-mono">AppSec Training Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, <span className="text-cyan-400">{user?.fullName || 'Student'}</span>!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Ready to continue your security journey? You are currently <strong className="text-white">{overallPercentage}%</strong> through the Web Application Security curriculum.
          </p>
        </div>

        {/* Continue Learning CTA */}
        {nextLab && (
          <div className="bg-slate-900/90 border border-cyan-500/30 rounded-xl p-4 shrink-0 w-full md:w-80 space-y-3 shadow-xl shadow-cyan-500/5">
            <div className="text-[11px] font-mono text-cyan-400 uppercase font-semibold flex items-center justify-between">
              <span>Recommended Next Lab</span>
              <span className="text-[10px] text-slate-500">{nextLab.difficulty}</span>
            </div>
            <div className="font-bold text-white text-sm truncate">{nextLab.title}</div>
            <Link
              to={`/lab/${nextLab.slug}`}
              className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Continue Learning</span>
            </Link>
          </div>
        )}
      </div>

      {/* 4 Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Course Progress */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Overall Progress</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{overallPercentage}%</div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-cyan-400 h-full rounded-full transition-all duration-500" style={{ width: `${overallPercentage}%` }}></div>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            {completedLabsCount} of {totalLabsCount} labs completed
          </div>
        </div>

        {/* Total Points */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Earned Points</span>
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-300">{totalPoints} XP</div>
          <div className="text-[11px] text-slate-500 font-mono">
            Lab challenge & quiz points
          </div>
        </div>

        {/* Badges Earned */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Badges Unlocked</span>
            <Award className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-violet-300">
            {unlockedAchievementsCount} / {achievements.length}
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Security milestones achieved
          </div>
        </div>

        {/* Remaining Labs */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Labs Remaining</span>
            <BookOpen className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-300">
            {totalLabsCount - completedLabsCount}
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Ready to explore & solve
          </div>
        </div>
      </div>

      {/* 2-Column Split: Topic Progress & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 cols): Topic Mastery Breakdown */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Topic-Wise Mastery Matrix</span>
              </h3>
              <p className="text-xs text-slate-400">Track your progress across key web application security domains</p>
            </div>
            <Link to="/labs" className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.keys(categoryStats).map(cat => {
              const stat = categoryStats[cat];
              return (
                <div key={cat} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{cat}</span>
                    <span className="font-mono text-cyan-400 text-[11px]">{stat.completed}/{stat.total} Done</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        stat.percentage === 100 ? 'bg-emerald-400' : 'bg-cyan-400'
                      }`}
                      style={{ width: `${stat.percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right (1 col): Badges & Achievements Showcase */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Earned Badges</span>
              </h3>
              <span className="text-xs font-mono text-slate-400">{unlockedAchievementsCount} Unlocked</span>
            </div>

            <div className="space-y-3">
              {achievements.map(a => {
                const isUnlocked = Boolean(a.unlockedAt);
                return (
                  <div
                    key={a.id}
                    className={`p-3 rounded-xl border flex items-center gap-3 transition ${
                      isUnlocked
                        ? 'bg-slate-950 border-amber-500/30 text-white'
                        : 'bg-slate-950/40 border-slate-800/50 opacity-40 text-slate-500'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold shrink-0 ${
                      isUnlocked ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-900 text-slate-600'
                    }`}>
                      <Award className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold truncate">{a.title}</div>
                      <div className="text-[10px] text-slate-400 truncate">{a.description}</div>
                    </div>
                    <div className="text-[11px] font-mono font-bold text-amber-400 shrink-0">
                      +{a.points} XP
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Link
            to="/profile"
            className="text-xs font-mono text-center text-cyan-400 hover:text-cyan-300 block pt-2 border-t border-slate-800"
          >
            View Full Profile & Certificates →
          </Link>
        </div>
      </div>

      {/* Recently Attempted Labs Section */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span>Recently Attempted Exercises</span>
        </h3>

        {recentLabs.length === 0 ? (
          <div className="text-xs text-slate-500 py-6 text-center italic">
            No lab attempts recorded yet. Jump into the Lab Catalogue to start learning!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentLabs.map(lab => {
              const progress = progressMap[lab.id];
              const isCompleted = progress?.status === 'completed';

              return (
                <div
                  key={lab.id}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                      <span className="text-cyan-400 font-semibold">{lab.category}</span>
                      <span className={isCompleted ? 'text-emerald-400' : 'text-amber-400'}>
                        {isCompleted ? 'COMPLETED' : 'IN PROGRESS'}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white truncate">{lab.title}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{lab.summary}</p>
                  </div>

                  <Link
                    to={`/lab/${lab.slug}`}
                    className="w-full py-1.5 px-3 rounded bg-slate-900 hover:bg-slate-800 text-[11px] font-mono text-cyan-400 hover:text-white border border-slate-800 text-center block transition"
                  >
                    Open Workspace
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
