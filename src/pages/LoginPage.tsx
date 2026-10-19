import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login, loginDemoStudent, loginDemoInstructor } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      navigate('/dashboard');
    }
  };

  const handleDemoStudent = () => {
    loginDemoStudent();
    navigate('/dashboard');
  };

  const handleDemoInstructor = () => {
    loginDemoInstructor();
    navigate('/instructor');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Sign In to WebSecLab</h1>
        <p className="text-xs text-slate-400">Enter your university credentials or explore in demo mode.</p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-rose-950/70 border border-rose-500/50 text-xs text-rose-300 font-mono">
          {error}
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@university.edu"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-slate-950 font-bold text-xs shadow-md transition disabled:opacity-50"
        >
          {loading ? 'Authenticating...' : 'Sign In with Email'}
        </button>

        {/* Demo Mode Quick Sign-ins */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <span className="text-[11px] font-mono text-slate-500 uppercase block text-center">
            One-Click Demo Mode (No Registration)
          </span>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleDemoStudent}
              className="py-2 px-3 rounded-lg bg-slate-950 hover:bg-slate-800 border border-cyan-800/40 text-cyan-400 text-xs font-mono font-semibold"
            >
              Demo Student
            </button>
            <button
              type="button"
              onClick={handleDemoInstructor}
              className="py-2 px-3 rounded-lg bg-slate-950 hover:bg-slate-800 border border-violet-800/40 text-violet-400 text-xs font-mono font-semibold"
            >
              Demo Instructor
            </button>
          </div>
        </div>
      </form>

      <div className="text-center text-xs text-slate-400">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="text-cyan-400 hover:underline font-semibold">
          Create free account
        </Link>
      </div>
    </div>
  );
};
