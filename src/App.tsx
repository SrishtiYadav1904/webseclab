import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProgressProvider } from './context/ProgressContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { LabCataloguePage } from './pages/LabCataloguePage';
import { LabWorkspacePage } from './pages/LabWorkspacePage';
import { QuizPage } from './pages/QuizPage';
import { FinalAssessmentPage } from './pages/FinalAssessmentPage';
import { InstructorPage } from './pages/InstructorPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProgressProvider>
          <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/labs" element={<LabCataloguePage />} />
                <Route path="/lab/:slug" element={<LabWorkspacePage />} />
                <Route path="/quiz" element={<QuizPage />} />
                <Route path="/final-assessment" element={<FinalAssessmentPage />} />
                <Route path="/instructor" element={<InstructorPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </ProgressProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
