
import React, { useState, useEffect } from 'react';
import { AppView, DashboardSection, UserProfile } from './types';
import { UI_CLASSES, SYSTEM_DISCLAIMER } from './constants';
import Dashboard from './components/Dashboard';
import Landing from './components/Landing';
import Signup from './components/Signup';
import Quiz from './components/Quiz';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.LANDING);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('ai360_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setView(AppView.DASHBOARD);
    }
  }, []);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSignupComplete = (profile: UserProfile) => {
    setUser(profile);
    setView(AppView.QUIZ);
  };

  const handleQuizComplete = (profileUpdates: Partial<UserProfile>) => {
    const updatedUser = { ...user, ...profileUpdates } as UserProfile;
    setUser(updatedUser);
    localStorage.setItem('ai360_user', JSON.stringify(updatedUser));
    setView(AppView.DASHBOARD);
  };

  const handleLogout = () => {
    localStorage.removeItem('ai360_user');
    setUser(null);
    setView(AppView.LANDING);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1A1A1A] selection:bg-neutral-200">
      {view === AppView.LANDING && (
        <Landing onStart={() => setView(AppView.SIGNUP)} />
      )}

      {view === AppView.SIGNUP && (
        <Signup 
          onBack={() => setView(AppView.LANDING)} 
          onComplete={handleSignupComplete} 
        />
      )}

      {view === AppView.QUIZ && user && (
        <Quiz onComplete={handleQuizComplete} />
      )}

      {view === AppView.DASHBOARD && user && (
        <Dashboard user={user} onLogout={handleLogout} onNotify={showToast} />
      )}

      {/* Global Toast Notification */}
      {toast && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] animate-reveal">
          <div className="bg-[#1A1A1A] text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{toast}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
