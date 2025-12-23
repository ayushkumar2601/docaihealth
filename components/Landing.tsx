
import React, { useEffect, useRef } from 'react';
import { UI_CLASSES } from '../constants';

interface LandingProps {
  onStart: () => void;
}

const Landing: React.FC<LandingProps> = ({ onStart }) => {
  const revealRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    revealRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const addToRefs = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  return (
    <div className="relative bg-[#FAF9F6] selection:bg-neutral-200 min-h-screen">
      {/* Navigation Bar - Full Width Glassmorphism */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-6 bg-white/70 backdrop-blur-xl border-b border-neutral-200/20 flex justify-center">
        <div className="max-w-7xl w-full flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 bg-[#1A1A1A] rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-sm transition-all duration-500 group-hover:rotate-6 group-hover:scale-105">
              D
            </div>
            <span className="text-2xl font-bold tracking-tight text-neutral-900">DocAi</span>
          </div>
          
          <div className="hidden md:flex items-center gap-10">
            <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="nav-link text-[10px] font-bold uppercase tracking-widest text-neutral-500 hover:text-neutral-900 transition-colors">Features</button>
            <button onClick={() => document.getElementById('security')?.scrollIntoView({ behavior: 'smooth' })} className="nav-link text-[10px] font-bold uppercase tracking-widest text-neutral-500 hover:text-neutral-900 transition-colors">Security</button>
            <button onClick={onStart} className="nav-link text-[10px] font-bold uppercase tracking-widest text-neutral-500 hover:text-neutral-900 transition-colors">Sign In</button>
          </div>

          <button 
            onClick={onStart} 
            className="px-7 py-3 bg-[#1A1A1A] text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:scale-[1.03] hover:shadow-xl hover:shadow-black/10 active:scale-95 transition-all"
          >
            Launch App
          </button>
        </div>
      </nav>

      {/* Hero Section - Brought higher by reducing pt-64 to pt-40 */}
      <section className="relative min-h-screen flex flex-col items-center pt-40 pb-20 px-8 text-center">
        <div className="max-w-5xl w-full animate-reveal">
          <div className="inline-block px-5 py-2 mb-10 bg-[#6B705C]/10 text-[#6B705C] rounded-full text-[9px] font-bold uppercase tracking-[0.3em] cursor-default">
            The Future of Clinical Intelligence
          </div>
          
          <h1 className="text-6xl md:text-[6.5rem] font-bold tracking-tighter mb-10 leading-[0.95] text-neutral-900">
            Understand your health, <br /> 
            <span className="text-[#6B705C]/70 italic font-serif">without the confusion.</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-14 text-neutral-500 font-medium max-w-2xl mx-auto leading-relaxed opacity-90">
            DocAi helps you make sense of medical reports, scans, and health risks with clinical-grade precision.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <button 
              onClick={onStart}
              className={`${UI_CLASSES.button} text-[14px] px-12 py-4.5 rounded-full shadow-2xl shadow-black/5 pulse-once hover:scale-[1.02] active:scale-[0.98] transition-all`}
            >
              Get Started
            </button>
            <button 
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className={`${UI_CLASSES.buttonSecondary} text-[14px] px-12 py-4.5 rounded-full border-neutral-200 hover:border-neutral-900 hover:scale-[1.02] active:scale-[0.98] transition-all`}
            >
              See how it works
            </button>
          </div>

          <div className="mt-24 flex flex-wrap justify-center items-center gap-x-12 gap-y-4 opacity-40">
            {['Privacy-First', 'Doctor-Informed', 'Clinical Intelligence'].map((tag, i) => (
              <span key={i} className="text-[10px] font-bold uppercase tracking-[0.25em] flex items-center gap-2">
                <span className="w-1 h-1 bg-neutral-900 rounded-full"></span>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section id="mission" className="py-24 px-8 bg-white/40">
        <div ref={addToRefs} className="reveal-on-scroll max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-medium text-neutral-400 leading-[1.4] tracking-tight">
            Healthcare shouldn't be a black box. <span className="text-neutral-900">DocAi</span> provides the transparency you deserve, combining human expertise with autonomous clinical logic.
          </h2>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Visual Diagnosis",
              desc: "Deep-learning analysis for imaging. Detect markers with objective precision across various scans.",
              icon: "◈",
              badge: "Imaging Node"
            },
            {
              title: "Report Explainer",
              desc: "Biomarkers decoded. We translate complex laboratory results into actionable plain language.",
              icon: "▤",
              badge: "Report Node"
            },
            {
              title: "Risk Forecast",
              desc: "Future-proof your wellness with predictive modeling based on your unique patient profile.",
              icon: "◎",
              badge: "Predictive Node"
            }
          ].map((feature, i) => (
            <div 
              key={i} 
              ref={addToRefs}
              className="reveal-on-scroll group p-12 bg-white rounded-[2.5rem] border border-neutral-100/50 shadow-sm hover:shadow-xl hover:shadow-black/[0.03] transition-all duration-500"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="w-16 h-16 bg-neutral-50 rounded-2xl flex items-center justify-center text-3xl text-neutral-300 group-hover:bg-[#1A1A1A] group-hover:text-white transition-all duration-500 mb-10">
                {feature.icon}
              </div>
              <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#6B705C] mb-4 opacity-60">{feature.badge}</p>
              <h3 className="text-2xl font-bold mb-4 text-neutral-900 tracking-tight">{feature.title}</h3>
              <p className="text-neutral-500 text-base leading-relaxed font-medium opacity-80">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-24 px-8 bg-white border-y border-neutral-100/30 overflow-hidden relative">
        <div ref={addToRefs} className="reveal-on-scroll max-w-5xl mx-auto flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-neutral-50 rounded-full flex items-center justify-center mb-10 text-xl text-neutral-300">✦</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-neutral-900 tracking-tighter">Private by architecture.</h2>
          <p className="text-lg md:text-xl text-neutral-500 font-medium mb-16 max-w-2xl leading-relaxed">
            Clinical intelligence requires absolute trust. Our ephemeral processing ensures your health data remains local, secure, and encrypted.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 w-full max-w-4xl">
            {[
              { label: "AES-256 Security", detail: "Military-grade session encryption." },
              { label: "Zero Model Training", detail: "Your data is never used for training." },
              { label: "Patient Autonomy", detail: "Total control over your medical records." }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <p className="text-xs font-bold text-neutral-900 mb-2 uppercase tracking-widest">{item.label}</p>
                <p className="text-[13px] text-neutral-400 font-medium leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-8 text-center bg-[#FAF9F6]">
        <div ref={addToRefs} className="reveal-on-scroll max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-10 text-neutral-900 tracking-tighter">Ready for total clarity?</h2>
          <button 
            onClick={onStart}
            className={`${UI_CLASSES.button} text-sm px-14 py-5 rounded-full shadow-2xl shadow-black/5 hover:scale-105 active:scale-95 transition-all`}
          >
            Launch DocAi Analysis
          </button>
          <p className="mt-8 text-[9px] font-bold uppercase tracking-[0.3em] text-neutral-300">
            Join the evolution of personal diagnostics.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-8 border-t border-neutral-100/40 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#1A1A1A] rounded-lg flex items-center justify-center text-white text-lg font-bold">D</div>
              <span className="text-2xl font-bold tracking-tight text-neutral-900">DocAi</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-10 text-[9px] font-bold uppercase tracking-[0.25em] text-neutral-300">
              <span className="hover:text-neutral-900 transition-colors cursor-pointer">Protocol</span>
              <span className="hover:text-neutral-900 transition-colors cursor-pointer">Encryption</span>
              <span className="hover:text-neutral-900 transition-colors cursor-pointer">Ethics</span>
              <span className="hover:text-neutral-900 transition-colors cursor-pointer">Support</span>
            </div>

            <div className="text-[9px] font-bold uppercase tracking-[0.1em] text-neutral-200">
              © 2024 DocAi Health Systems.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
