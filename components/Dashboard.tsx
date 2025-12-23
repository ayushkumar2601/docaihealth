import React, { useState } from 'react';
import { UserProfile, DashboardSection } from '../types';
import { UI_CLASSES } from '../constants';
import Diagnosis from './Diagnosis';
import Prediction from './Prediction';
import ReportExplainer from './ReportExplainer';
import Chatbot from './Chatbot';
import Overview from './Overview';

interface DashboardProps {
  user: UserProfile;
  onLogout: () => void;
  onNotify: (msg: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, onNotify }) => {
  const [section, setSection] = useState<DashboardSection>(DashboardSection.OVERVIEW);

  const navItems = [
    { id: DashboardSection.OVERVIEW, label: 'Overview', icon: '○' },
    { id: DashboardSection.DIAGNOSIS, label: 'Diagnosis', icon: '◈' },
    { id: DashboardSection.PREDICTION, label: 'Prediction', icon: '◎' },
    { id: DashboardSection.REPORT_EXPLAINER, label: 'Report Explainer', icon: '▤' },
    { id: DashboardSection.CHATBOT, label: 'Health Assistant', icon: '✦' },
  ];

  const isChatbot = section === DashboardSection.CHATBOT;

  return (
    <div className="flex h-screen overflow-hidden bg-[#FAF9F6]">
      {/* Sidebar */}
      <aside className="w-72 border-r border-neutral-100 flex flex-col p-8 bg-white shrink-0">
        <div className="mb-14 px-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center text-white text-xl font-bold">D</div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-neutral-900">DocAi</h1>
              <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#6B705C]">Intelligence Node</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 text-sm font-semibold rounded-2xl transition-all ${section === item.id ? 'bg-neutral-50 text-neutral-900 shadow-sm' : 'text-neutral-400 hover:text-neutral-900 hover:bg-neutral-50/50'}`}
            >
              <span className="text-lg opacity-60 leading-none">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-8 border-t border-neutral-50">
          <div className="bg-neutral-50 rounded-2xl p-4 mb-4">
            <p className="text-[9px] font-bold uppercase tracking-widest mb-1 text-neutral-400">Authorized Session</p>
            <p className="text-xs font-bold text-neutral-900 truncate">{user.name}</p>
          </div>
          <button 
            onClick={onLogout}
            className="w-full text-left px-4 text-[10px] font-bold uppercase tracking-widest text-neutral-300 hover:text-red-500 transition-colors"
          >
            End Session
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 overflow-y-auto ${isChatbot ? 'p-6' : 'p-12'}`}>
        <div className={`${isChatbot ? 'max-w-7xl h-[calc(100vh-6rem)]' : 'max-w-5xl pb-32'} mx-auto animate-fade-in`}>
          {section === DashboardSection.OVERVIEW && <Overview user={user} />}
          {section === DashboardSection.DIAGNOSIS && <Diagnosis user={user} onNotify={onNotify} />}
          {section === DashboardSection.PREDICTION && <Prediction user={user} />}
          {section === DashboardSection.REPORT_EXPLAINER && <ReportExplainer user={user} onNotify={onNotify} />}
          {section === DashboardSection.CHATBOT && <Chatbot user={user} />}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;