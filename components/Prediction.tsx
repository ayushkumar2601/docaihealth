
import React, { useState, useEffect } from 'react';
import { UI_CLASSES } from '../constants';
import { getHealthPrediction } from '../services/geminiService';
import { UserProfile, HealthPrediction } from '../types';

const Prediction: React.FC<{ user: UserProfile }> = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<HealthPrediction | null>(null);

  useEffect(() => {
    const generate = async () => {
      setLoading(true);
      try {
        const res = await getHealthPrediction(user);
        setPrediction(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    generate();
  }, [user]);

  return (
    <div className="space-y-10">
      <header>
        <p className={UI_CLASSES.subheading}>Predictive Care</p>
        <h2 className={UI_CLASSES.heading}>360° Health Forecast</h2>
        <p className="text-neutral-500 max-w-lg">Advanced longitudinal analysis to predict future health trajectories and preventive pathways.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className={`${UI_CLASSES.card} !p-6 animate-reveal`}>
          <p className={UI_CLASSES.subheading}>Chronological Age</p>
          <p className="text-3xl font-bold text-neutral-900">{user.age || 'N/A'}</p>
        </div>
        <div className={`${UI_CLASSES.card} !p-6 animate-reveal [animation-delay:100ms]`}>
          <p className={UI_CLASSES.subheading}>Patient Profile</p>
          <p className="text-3xl font-bold text-neutral-900">{user.gender || 'N/A'}</p>
        </div>
        <div className={`${UI_CLASSES.card} !p-6 animate-reveal [animation-delay:200ms]`}>
          <p className={UI_CLASSES.subheading}>Primary Objective</p>
          <p className="text-xl font-bold text-neutral-900 truncate">{user.goal || 'N/A'}</p>
        </div>
      </div>

      <div className={`${UI_CLASSES.card} min-h-[500px] relative overflow-hidden group animate-reveal [animation-delay:300ms]`}>
        <div className="absolute top-0 right-0 p-8 opacity-5 text-8xl font-black">✦</div>
        {loading ? (
          <div className="space-y-10">
            <div className="flex items-center gap-4">
              <div className="w-4 h-4 bg-neutral-100 rounded-full animate-pulse"></div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-300">Generating your health forecast...</p>
            </div>
            <div className="space-y-6">
              <div className="h-4 bg-neutral-50 w-full rounded-full animate-pulse"></div>
              <div className="h-4 bg-neutral-50 w-[95%] rounded-full animate-pulse"></div>
              <div className="h-4 bg-neutral-50 w-[85%] rounded-full animate-pulse"></div>
              <div className="h-4 bg-neutral-50 w-[90%] rounded-full animate-pulse"></div>
              <div className="mt-12 space-y-4">
                 <div className="h-10 bg-neutral-50 w-1/3 rounded-2xl animate-pulse"></div>
                 <div className="h-4 bg-neutral-50 w-full rounded-full animate-pulse"></div>
                 <div className="h-4 bg-neutral-50 w-[92%] rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        ) : prediction ? (
          <div className="relative z-10 animate-reveal space-y-10">
            <div className="bg-neutral-50/50 p-6 rounded-3xl border border-neutral-100">
              <p className={UI_CLASSES.subheading}>Clinical Assessment Summary</p>
              <p className="text-lg font-medium text-neutral-700 leading-relaxed">{prediction.summary}</p>
            </div>

            <div className="space-y-8">
              {prediction.riskCategories.map((cat, idx) => (
                <div key={idx} className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-neutral-900 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#6B705C] rounded-full"></span>
                    {cat.category}
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {cat.items.map((item, i) => (
                      <div 
                        key={i} 
                        className={`p-6 rounded-3xl border transition-all duration-300 ${item.isHighPriority ? 'bg-orange-50/30 border-orange-100 shadow-sm' : 'bg-white border-neutral-100'}`}
                      >
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h4 className={`text-sm font-bold uppercase tracking-widest ${item.isHighPriority ? 'text-orange-700' : 'text-neutral-900'}`}>
                            {item.heading}
                          </h4>
                          {item.isHighPriority && (
                            <span className="px-2.5 py-1 bg-orange-100 text-orange-700 text-[8px] font-black uppercase tracking-widest rounded-full">
                              Vulnerable Area
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-neutral-500 font-medium leading-relaxed">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-6 border-t border-neutral-50 pt-10">
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-neutral-900 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
                Early Warning Signs to Monitor
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {prediction.monitoringSigns.map((sign, i) => (
                  <div key={i} className="p-5 bg-white border border-neutral-100 rounded-2xl shadow-sm flex gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${sign.urgency === 'High' ? 'bg-red-50 text-red-500' : 'bg-neutral-50 text-neutral-400'}`}>
                      {sign.urgency === 'High' ? '!' : '○'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-neutral-900 mb-1">{sign.sign}</p>
                      <p className="text-[11px] text-neutral-400 font-medium leading-relaxed">{sign.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-6">
             <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center text-2xl text-neutral-200">◎</div>
             <p className="text-xs text-neutral-400 font-medium max-w-xs">AI insights will appear here as the clinical engine generates your risk profile.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Prediction;
