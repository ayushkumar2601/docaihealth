
import React, { useEffect, useState } from 'react';
import { UI_CLASSES } from '../constants';
import { UserProfile } from '../types';

const Overview: React.FC<{ user: UserProfile }> = ({ user }) => {
  const [stats, setStats] = useState({
    scans: 0,
    reports: 0,
    lastActivity: 'No activity yet.'
  });

  useEffect(() => {
    const scans = localStorage.getItem('ai360_scans_count') || '0';
    const reports = localStorage.getItem('ai360_reports_count') || '0';
    const last = localStorage.getItem('ai360_last_activity');
    
    setStats({
      scans: parseInt(scans),
      reports: parseInt(reports),
      lastActivity: last ? new Date(last).toLocaleString() : 'No activity yet.'
    });
  }, []);

  const isGuest = user.email === 'guest@example.com';

  return (
    <div className="space-y-10">
      <header>
        <p className={UI_CLASSES.subheading}>Patient Center</p>
        <h2 className={UI_CLASSES.heading}>Your Overview</h2>
        <p className="text-neutral-500 max-w-lg">Manage your health data, security settings, and recent clinical activity.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Identity Card */}
        <section className={`${UI_CLASSES.card} lg:col-span-2`}>
          <div className="flex justify-between items-start mb-8">
            <h3 className="text-lg font-bold text-neutral-900">Health Profile</h3>
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${isGuest ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>
              {isGuest ? 'Guest Access' : 'Verified Profile'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-12 gap-y-8">
            {[
              { label: 'Name', value: user.name },
              { label: 'Email', value: user.email },
              { label: 'Current Age', value: user.age || 'N/A' },
              { label: 'Gender Identity', value: user.gender || 'N/A' },
              { label: 'Clinical Goal', value: user.goal || 'N/A' },
              { label: 'Data Encryption', value: 'AES-256' },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-300 block">{item.label}</span>
                <span className="text-sm font-semibold text-neutral-700">{item.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Status Card */}
        <section className="bg-[#1A1A1A] rounded-[2.5rem] p-10 text-white flex flex-col justify-between shadow-xl shadow-black/10">
          <div>
            <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center mb-6 text-xl">✦</div>
            <h3 className="text-lg font-bold mb-4">AI Optimization</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              We've tailored your experience for <span className="text-white font-bold">{user.goal || 'preventive care'}</span> based on your onboarding data.
            </p>
          </div>
          <div className="mt-8 pt-8 border-t border-white/5">
            <button className="text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors">Update Preferences &rarr;</button>
          </div>
        </section>

        {/* Usage Metrics */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className={UI_CLASSES.card}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-6">Uploaded Scans</p>
              <div className="flex items-center gap-4">
                <span className="text-5xl font-bold text-neutral-900">{stats.scans}</span>
                <div className="flex-1 h-2 bg-neutral-50 rounded-full overflow-hidden">
                  <div className="h-full bg-neutral-900 rounded-full" style={{width: `${Math.min(stats.scans * 10, 100)}%`}}></div>
                </div>
              </div>
           </div>
           <div className={UI_CLASSES.card}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-6">Analyzed Reports</p>
              <div className="flex items-center gap-4">
                <span className="text-5xl font-bold text-neutral-900">{stats.reports}</span>
                <div className="flex-1 h-2 bg-neutral-50 rounded-full overflow-hidden">
                  <div className="h-full bg-neutral-900 rounded-full" style={{width: `${Math.min(stats.reports * 10, 100)}%`}}></div>
                </div>
              </div>
           </div>
           <div className={`${UI_CLASSES.card} bg-neutral-900 text-white border-none`}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-4">Data Privacy Status</p>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 rounded-full bg-[#6B705C] animate-pulse"></div>
                <span className="text-xs font-bold uppercase tracking-widest">Secure & Private</span>
              </div>
              <p className="text-[10px] text-white/40 leading-relaxed uppercase tracking-wider">
                Ephemeral processing enabled. Local storage used for session continuity.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
