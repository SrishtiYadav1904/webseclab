import React, { useState } from 'react';
import { 
  Users, 
  BarChart3, 
  Download, 
  ShieldAlert, 
  Search, 
  Shield 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';

interface StudentRosterItem {
  id: string;
  name: string;
  email: string;
  enrolledDate: string;
  labsCompleted: number;
  totalScore: number;
  lastActive: string;
  status: 'active' | 'inactive';
}

export const InstructorPage: React.FC = () => {
  const { user, loginDemoInstructor } = useAuth();
  const { categoryStats, totalLabsCount } = useProgress();

  const isInstructor = user?.role === 'instructor' || user?.role === 'admin';

  // Sample genuine student roster records for academic dashboard demonstration
  const [students] = useState<StudentRosterItem[]>([
    {
      id: 'usr-1',
      name: 'Alex Vance',
      email: 'alex.vance@university.edu',
      enrolledDate: '2026-09-01',
      labsCompleted: 2,
      totalScore: 210,
      lastActive: '10 mins ago',
      status: 'active'
    },
    {
      id: 'usr-2',
      name: 'Sarah Connor',
      email: 's.connor@university.edu',
      enrolledDate: '2026-09-02',
      labsCompleted: 5,
      totalScore: 560,
      lastActive: '2 hours ago',
      status: 'active'
    },
    {
      id: 'usr-3',
      name: 'Marcus Brody',
      email: 'm.brody@university.edu',
      enrolledDate: '2026-09-05',
      labsCompleted: 8,
      totalScore: 890,
      lastActive: 'Yesterday',
      status: 'active'
    },
    {
      id: 'usr-4',
      name: 'Elena Rostova',
      email: 'e.rostova@university.edu',
      enrolledDate: '2026-09-08',
      labsCompleted: 1,
      totalScore: 100,
      lastActive: '3 days ago',
      status: 'inactive'
    }
  ]);

  const [studentSearch, setStudentSearch] = useState('');

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.email.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const handleExportCsv = () => {
    const headers = ['ID', 'Name', 'Email', 'Enrolled Date', 'Labs Completed', 'Total Score', 'Status'];
    const rows = students.map(s => [
      s.id,
      s.name,
      s.email,
      s.enrolledDate,
      `${s.labsCompleted}/${totalLabsCount}`,
      s.totalScore,
      s.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `WebSecLab_Student_Progress_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isInstructor) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-violet-500/20 text-violet-400 border border-violet-500/40 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Instructor & Staff Area Protected</h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md mx-auto">
            This portal is restricted to authorized faculty and cybersecurity instructors with verified staff permissions enforced by Supabase Row Level Security.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono max-w-md mx-auto">
          Active Role: <span className="text-cyan-400 font-bold capitalize">{user?.role || 'Guest'}</span>
        </div>

        <button
          onClick={loginDemoInstructor}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 text-white font-bold text-xs shadow-lg shadow-violet-500/20"
        >
          Sign In as Demo Instructor (Dr. Evelyn Reed)
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-violet-950/40 via-slate-900 to-slate-950 border border-violet-800/40 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-violet-400 mb-1">
            <Shield className="w-4 h-4" />
            <span>STAFF & FACULTY ADMIN PORTAL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Academic Analytics & Learner Cohort</h1>
          <p className="text-xs text-slate-400 mt-1">
            Monitor real-time cohort lab completion rates, review topic deficiencies, and export audit reports.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-violet-500/40 text-violet-300 text-xs font-mono font-bold flex items-center gap-2 transition shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export Cohort CSV Report</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-1">
          <span className="text-xs font-mono text-slate-500 uppercase">Enrolled Students</span>
          <div className="text-2xl font-bold font-mono text-white">{students.length}</div>
          <span className="text-[11px] text-emerald-400 font-mono">3 Active This Week</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-1">
          <span className="text-xs font-mono text-slate-500 uppercase">Average Cohort Score</span>
          <div className="text-2xl font-bold font-mono text-cyan-300">440 XP</div>
          <span className="text-[11px] text-slate-500 font-mono">Passing threshold 75%</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-1">
          <span className="text-xs font-mono text-slate-500 uppercase">Total Lab Submissions</span>
          <div className="text-2xl font-bold font-mono text-violet-300">16 Labs</div>
          <span className="text-[11px] text-slate-500 font-mono">100% Deterministic Validations</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-1">
          <span className="text-xs font-mono text-slate-500 uppercase">Certifications Awarded</span>
          <div className="text-2xl font-bold font-mono text-amber-300">1 Certified</div>
          <span className="text-[11px] text-slate-500 font-mono">Marcus Brody (Graduated)</span>
        </div>
      </div>

      {/* Topic-Wise Cohort Performance Breakdown */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-violet-400" />
          <span>Cohort Topic-Wise Competency Distribution</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.keys(categoryStats).map(cat => {
            const stat = categoryStats[cat];
            return (
              <div key={cat} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{cat}</span>
                  <span className="font-mono text-cyan-400">{stat.percentage}% Completed</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-violet-400 h-full rounded-full transition-all"
                    style={{ width: `${stat.percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Registered Learners Roster */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-violet-400" />
              <span>Registered Student Cohort</span>
            </h3>
            <p className="text-xs text-slate-400">View individual student progress, scores, and activity status.</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              placeholder="Search by student name..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 uppercase text-[10px]">
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">University Email</th>
                <th className="py-3 px-4">Labs Completed</th>
                <th className="py-3 px-4">Total XP</th>
                <th className="py-3 px-4">Last Activity</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredStudents.map(student => (
                <tr key={student.id} className="hover:bg-slate-800/30 transition">
                  <td className="py-3.5 px-4 font-bold text-white">{student.name}</td>
                  <td className="py-3.5 px-4 text-slate-400">{student.email}</td>
                  <td className="py-3.5 px-4 text-cyan-300">
                    {student.labsCompleted} / {totalLabsCount} Labs
                  </td>
                  <td className="py-3.5 px-4 font-bold text-amber-300">{student.totalScore} XP</td>
                  <td className="py-3.5 px-4 text-slate-400">{student.lastActive}</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      student.status === 'active' ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-900 text-slate-500'
                    }`}>
                      {student.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
