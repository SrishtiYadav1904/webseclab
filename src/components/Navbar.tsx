import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Terminal, 
  BookOpen, 
  Award, 
  User, 
  LogOut, 
  Menu, 
  X, 
  GraduationCap, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';

export const Navbar: React.FC = () => {
  const { user, isDemoMode, logout, loginDemoStudent, loginDemoInstructor } = useAuth();
  const { totalPoints, completedLabsCount, totalLabsCount } = useProgress();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    return location.pathname === path ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400' : 'text-slate-300 hover:text-white';
  };

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80">
      {/* Demo Mode Notice Bar */}
      {isDemoMode && (
        <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-violet-950 text-cyan-300 px-4 py-1.5 text-xs font-mono border-b border-cyan-800/30 flex items-center justify-between">
          <div className="flex items-center gap-2 mx-auto">
            <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>DEMO MODE ACTIVE: LocalStorage persistence enabled. No Supabase credentials required.</span>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <button 
              onClick={loginDemoStudent}
              className="text-xs text-slate-300 hover:text-cyan-300 underline"
            >
              Demo Student
            </button>
            <span className="text-slate-600">|</span>
            <button 
              onClick={loginDemoInstructor}
              className="text-xs text-slate-300 hover:text-violet-300 underline"
            >
              Demo Instructor
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center p-0.5 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition">
              <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition duration-200" />
              </div>
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1">
                Web<span className="text-cyan-400">Sec</span>Lab
              </span>
              <span className="text-[10px] block font-mono text-cyan-500/80 tracking-wider">APPSEC VIRTUAL LAB</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link to="/labs" className={`py-5 transition flex items-center gap-1.5 ${isActive('/labs')}`}>
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>Lab Catalogue</span>
            </Link>
            <Link to="/dashboard" className={`py-5 transition flex items-center gap-1.5 ${isActive('/dashboard')}`}>
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span>Dashboard</span>
            </Link>
            <Link to="/quiz" className={`py-5 transition flex items-center gap-1.5 ${isActive('/quiz')}`}>
              <Award className="w-4 h-4 text-violet-400" />
              <span>Quizzes</span>
            </Link>
            <Link to="/final-assessment" className={`py-5 transition flex items-center gap-1.5 ${isActive('/final-assessment')}`}>
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span>Final Exam</span>
            </Link>
            <Link to="/instructor" className={`py-5 transition flex items-center gap-1.5 ${isActive('/instructor')}`}>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-violet-900/60 text-violet-300 font-mono">STAFF</span>
              <span>Instructor</span>
            </Link>
          </nav>

          {/* User Status / Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                {/* Points & Progress Pill */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-full px-3 py-1 flex items-center gap-2.5 text-xs font-mono">
                  <span className="flex items-center gap-1 text-cyan-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{totalPoints} XP</span>
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-emerald-400">
                    {completedLabsCount}/{totalLabsCount} Labs
                  </span>
                </div>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800 transition"
                  >
                    <div className="w-8 h-8 rounded-full bg-cyan-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-bold text-xs">
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        user.fullName.charAt(0)
                      )}
                    </div>
                    <div className="text-left hidden lg:block">
                      <div className="text-xs font-medium text-slate-200">{user.fullName}</div>
                      <div className="text-[10px] text-cyan-400 capitalize">{user.role}</div>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-50 text-sm"
                      onMouseLeave={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-slate-800">
                        <div className="font-semibold text-white">{user.fullName}</div>
                        <div className="text-xs text-slate-400 truncate">{user.email}</div>
                        <div className="mt-1 inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800/40">
                          {user.rank}
                        </div>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="px-4 py-2 hover:bg-slate-800/60 flex items-center gap-2 text-slate-300 hover:text-white"
                      >
                        <User className="w-4 h-4 text-cyan-400" />
                        <span>Profile & Badges</span>
                      </Link>

                      <Link
                        to="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="px-4 py-2 hover:bg-slate-800/60 flex items-center gap-2 text-slate-300 hover:text-white"
                      >
                        <BookOpen className="w-4 h-4 text-blue-400" />
                        <span>My Dashboard</span>
                      </Link>

                      <div className="border-t border-slate-800 my-1"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 hover:bg-rose-950/40 text-left flex items-center gap-2 text-rose-300 hover:text-rose-200"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold px-4 py-1.5 rounded-lg shadow-md shadow-cyan-500/20 transition"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/labs"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-200 hover:text-cyan-400"
          >
            Lab Catalogue
          </Link>
          <Link
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-200 hover:text-cyan-400"
          >
            Dashboard
          </Link>
          <Link
            to="/quiz"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-200 hover:text-cyan-400"
          >
            Quizzes
          </Link>
          <Link
            to="/final-assessment"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-200 hover:text-cyan-400"
          >
            Final Assessment
          </Link>
          <Link
            to="/instructor"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-violet-300 hover:text-violet-200"
          >
            Instructor Portal
          </Link>
          <div className="pt-4 border-t border-slate-800">
            {user ? (
              <div className="space-y-2">
                <div className="text-sm text-slate-400">Signed in as <span className="text-white font-medium">{user.fullName}</span></div>
                <button
                  onClick={handleLogout}
                  className="w-full text-center py-2 rounded-lg bg-rose-950/40 text-rose-300 text-sm font-medium border border-rose-800/40"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 rounded-lg bg-slate-900 text-slate-200 text-sm font-medium border border-slate-800"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 rounded-lg bg-cyan-500 text-slate-950 text-sm font-semibold"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
