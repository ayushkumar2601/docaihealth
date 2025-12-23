
import React, { useState } from 'react';
import { UI_CLASSES } from '../constants';
import { UserProfile } from '../types';

interface SignupProps {
  onBack: () => void;
  onComplete: (profile: UserProfile) => void;
}

const Signup: React.FC<SignupProps> = ({ onBack, onComplete }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({ name: formData.name, email: formData.email });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-[#FAF9F6]">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl shadow-black/5 p-12 border border-neutral-100 animate-fade-in">
        <button onClick={onBack} className="text-xs font-bold uppercase tracking-widest mb-10 text-neutral-400 hover:text-neutral-900 transition-colors">&larr; Back to Home</button>
        <h2 className={UI_CLASSES.heading}>Get Started</h2>
        <p className="text-sm text-neutral-400 mb-10 leading-relaxed">Join our secure intelligence platform to begin your health journey.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Full Name</label>
            <input 
              required
              type="text" 
              placeholder="e.g. Alex Rivera"
              className={UI_CLASSES.input} 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Email Address</label>
            <input 
              required
              type="email" 
              placeholder="alex@example.com"
              className={UI_CLASSES.input} 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Password</label>
            <input 
              required
              type="password" 
              placeholder="••••••••"
              className={UI_CLASSES.input} 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <button type="submit" className={`${UI_CLASSES.button} w-full mt-4 py-4 shadow-lg shadow-black/5`}>
            Continue
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-neutral-100">
          <button 
            onClick={() => onComplete({ name: 'Guest User', email: 'guest@example.com' })}
            className="w-full text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors"
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
