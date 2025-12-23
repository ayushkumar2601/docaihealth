
import React, { useState, useRef } from 'react';
import { UI_CLASSES } from '../constants';
import { diagnoseImage } from '../services/geminiService';
import { DiagnosisResult, UserProfile } from '../types';
import PDFExport from './PDFExport';

interface DiagnosisProps {
  user: UserProfile;
  onNotify: (msg: string) => void;
}

const Diagnosis: React.FC<DiagnosisProps> = ({ user, onNotify }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateStats = () => {
    const current = parseInt(localStorage.getItem('ai360_scans_count') || '0');
    localStorage.setItem('ai360_scans_count', (current + 1).toString());
    localStorage.setItem('ai360_last_activity', new Date().toISOString());
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      setImage(reader.result as string);
      setLoading(true);
      try {
        const res = await diagnoseImage(base64, file.type);
        setResult(res);
        updateStats();
        onNotify("Analysis Ready");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-10">
      <header>
        <p className={UI_CLASSES.subheading}>Advanced Diagnostics</p>
        <h2 className={UI_CLASSES.heading}>Image Analysis</h2>
        <p className="text-neutral-500 max-w-lg">Screening for Eye, Skin, Respiratory, and Neurological conditions using visual intelligence.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div 
            onClick={() => !loading && fileInputRef.current?.click()}
            className={`aspect-square border-2 border-dashed border-neutral-200 rounded-[3rem] transition-all cursor-pointer flex flex-col items-center justify-center p-12 bg-white group ${loading ? 'opacity-50 cursor-wait' : 'hover:border-neutral-400 hover:bg-neutral-50'}`}
          >
            {image ? (
              <div className="relative w-full h-full">
                <img src={image} alt="Upload" className="w-full h-full object-cover rounded-[2rem] shadow-lg" />
                {loading && (
                   <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] rounded-[2rem] flex flex-col items-center justify-center">
                     <div className="flex gap-1.5 mb-4">
                        <div className="w-2 h-2 bg-neutral-900 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-neutral-900 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-neutral-900 rounded-full animate-bounce"></div>
                     </div>
                     <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-900">Analyzing your data...</p>
                   </div>
                )}
              </div>
            ) : (
              <>
                <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center text-2xl text-neutral-300 group-hover:text-neutral-600 transition-colors mb-6">+</div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400 group-hover:text-neutral-600">Select Medical Scan</p>
                <p className="text-[10px] text-neutral-300 mt-2 uppercase tracking-widest">JPEG, PNG or PDF</p>
              </>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileUpload} 
              accept="image/*"
            />
          </div>
          
          <div className="flex gap-4">
             <button 
              disabled={loading || !image}
              onClick={() => fileInputRef.current?.click()}
              className={`${UI_CLASSES.buttonSecondary} flex-1`}
            >
              Replace Image
            </button>
            {result && (
              <PDFExport data={result} user={user} type="DIAGNOSIS" />
            )}
          </div>
        </div>

        <div className="space-y-8">
          {loading ? (
            <div className="space-y-10 p-4">
              <div className="space-y-3">
                <div className="h-4 bg-neutral-100 w-1/4 rounded-full animate-pulse"></div>
                <div className="h-14 bg-neutral-50 w-3/4 rounded-2xl animate-pulse"></div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="h-32 bg-neutral-50 rounded-3xl animate-pulse"></div>
                <div className="h-32 bg-neutral-50 rounded-3xl animate-pulse"></div>
              </div>
              <div className="h-40 bg-neutral-50 rounded-[2.5rem] animate-pulse"></div>
              <p className="text-center text-[10px] font-bold uppercase tracking-widest text-neutral-300">Preparing insights...</p>
            </div>
          ) : result ? (
            <div className="space-y-8 p-4 animate-reveal">
              <div>
                <p className={UI_CLASSES.subheading}>Detection Result</p>
                <h3 className="text-5xl font-bold tracking-tight text-neutral-900">{result.disease}</h3>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-white border border-neutral-100 rounded-3xl shadow-sm">
                  <p className={UI_CLASSES.subheading}>Confidence</p>
                  <p className="text-3xl font-bold text-neutral-900">{result.probability}%</p>
                  <div className="mt-4 h-1.5 bg-neutral-50 rounded-full w-full overflow-hidden">
                    <div className="h-full bg-neutral-900 rounded-full transition-all duration-1000" style={{ width: `${result.probability}%` }}></div>
                  </div>
                </div>
                <div className="p-6 bg-white border border-neutral-100 rounded-3xl shadow-sm">
                  <p className={UI_CLASSES.subheading}>Severity Status</p>
                  <p className={`text-3xl font-bold ${result.severity === 'High' ? 'text-neutral-900' : 'text-neutral-500'}`}>
                    {result.severity}
                  </p>
                  <div className="mt-4 flex gap-1">
                    {[1, 2, 3].map(i => (
                      <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= (result.severity === 'High' ? 3 : result.severity === 'Medium' ? 2 : 1) ? 'bg-neutral-900' : 'bg-neutral-100'}`}></div>
                    ))}
                  </div>
                </div>
              </div>

              <div className={`${UI_CLASSES.card} !p-6 !shadow-none bg-neutral-50/50`}>
                <p className={UI_CLASSES.subheading}>AI Interpretation</p>
                <p className="text-sm leading-relaxed text-neutral-600 font-medium">{result.explanation}</p>
              </div>

              <div className="space-y-4">
                <p className={UI_CLASSES.subheading}>Clinical Recommendations</p>
                <div className="grid grid-cols-1 gap-3">
                  {result.recommendations.map((rec, i) => (
                    <div key={i} className="text-sm flex items-center gap-4 p-4 bg-white border border-neutral-100 rounded-2xl shadow-sm">
                      <span className="w-6 h-6 rounded-full bg-neutral-50 flex items-center justify-center text-[10px] font-bold text-neutral-400">{i+1}</span>
                      <span className="text-neutral-700 font-medium">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-6 animate-reveal">
              <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center text-3xl text-neutral-200">◈</div>
              <div className="max-w-xs space-y-2">
                <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest">Awaiting Input</h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-medium">Your AI insights will appear here once you upload a scan for analysis.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Diagnosis;
