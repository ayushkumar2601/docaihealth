
// import React, { useState, useRef } from 'react';
// import { UI_CLASSES } from '../constants';
// import { analyzeBloodReport } from '../services/geminiService';
// import { BloodReportAnalysis, UserProfile } from '../types';
// import PDFExport from './PDFExport';

// interface ReportExplainerProps {
//   user: UserProfile;
//   onNotify: (msg: string) => void;
// }

// const ReportExplainer: React.FC<ReportExplainerProps> = ({ user, onNotify }) => {
//   const [loading, setLoading] = useState(false);
//   const [report, setReport] = useState<BloodReportAnalysis | null>(null);
//   const [image, setImage] = useState<string | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const updateStats = () => {
//     const current = parseInt(localStorage.getItem('ai360_reports_count') || '0');
//     localStorage.setItem('ai360_reports_count', (current + 1).toString());
//     localStorage.setItem('ai360_last_activity', new Date().toISOString());
//   };

//   const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = async () => {
//       const base64 = (reader.result as string).split(',')[1];
//       setImage(reader.result as string);
//       setLoading(true);
//       try {
//         const res = await analyzeBloodReport(base64, file.type);
//         setReport(res);
//         updateStats();
//         onNotify("Report Decoded");
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     reader.readAsDataURL(file);
//   };

//   return (
//     <div className="space-y-10">
//       <header>
//         <p className={UI_CLASSES.subheading}>Data Analysis</p>
//         <h2 className={UI_CLASSES.heading}>Report Explainer</h2>
//         <p className="text-neutral-500 max-w-lg">Transform complex clinical labs into plain language. Understand your biomarkers with AI assistance.</p>
//       </header>

//       {loading ? (
//         <div className="min-h-[400px] flex flex-col items-center justify-center bg-white rounded-[3rem] border border-neutral-100 shadow-sm space-y-8 p-12 animate-reveal">
//            <div className="relative w-20 h-20">
//              <div className="absolute inset-0 border-4 border-neutral-100 rounded-full"></div>
//              <div className="absolute inset-0 border-4 border-[#1A1A1A] border-t-transparent rounded-full animate-spin"></div>
//            </div>
//            <div className="text-center space-y-2">
//              <p className="text-sm font-bold uppercase tracking-widest text-neutral-900">Decoding Lab Results...</p>
//              <p className="text-[11px] text-neutral-400 font-medium">Our clinical engine is analyzing every biomarker for you.</p>
//            </div>
//         </div>
//       ) : !report ? (
//         <div 
//           onClick={() => fileInputRef.current?.click()}
//           className="group border-2 border-dashed border-neutral-200 rounded-[3rem] p-32 text-center cursor-pointer hover:border-neutral-400 hover:bg-neutral-50 transition-all bg-white animate-reveal"
//         >
//           <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center text-2xl text-neutral-300 group-hover:bg-[#1A1A1A] group-hover:text-white group-hover:scale-110 transition-all duration-700 mx-auto mb-10">
//             ▤
//           </div>
//           <div className="max-w-xs mx-auto space-y-2">
//             <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-900">Upload a report</h3>
//             <p className="text-xs text-neutral-400 font-medium leading-relaxed">Select a lab report to begin understanding your biomarkers in plain language.</p>
//           </div>
//           <input 
//             type="file" 
//             ref={fileInputRef} 
//             className="hidden" 
//             onChange={handleFileUpload} 
//           />
//         </div>
//       ) : (
//         <div className="space-y-12 animate-reveal">
//           <div className="flex flex-col md:flex-row justify-between items-start gap-8">
//             <div className="max-w-2xl bg-white p-8 rounded-[2.5rem] border border-neutral-100 shadow-sm">
//               <p className={UI_CLASSES.subheading}>Executive Summary</p>
//               <p className="text-lg font-medium text-neutral-700 leading-relaxed">{report.summary}</p>
//             </div>
//             <div className="flex gap-4 w-full md:w-auto">
//                <button 
//                 onClick={() => setReport(null)}
//                 className={UI_CLASSES.buttonSecondary}
//               >
//                 New Report
//               </button>
//               <PDFExport data={report} user={user} type="REPORT" />
//             </div>
//           </div>

//           <div className="bg-white rounded-[2.5rem] border border-neutral-100 shadow-sm overflow-hidden">
//             <table className="w-full text-left">
//               <thead>
//                 <tr className="bg-neutral-50 border-b border-neutral-100">
//                   <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Marker</th>
//                   <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Recorded Value</th>
//                   <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Status</th>
//                   <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Clinical Meaning</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-neutral-50">
//                 {report.markers.map((marker, i) => (
//                   <tr key={i} className="hover:bg-neutral-50/50 transition-colors">
//                     <td className="px-8 py-6 font-bold text-neutral-800 text-sm">{marker.name}</td>
//                     <td className="px-8 py-6 text-sm font-medium text-neutral-600">{marker.value}</td>
//                     <td className="px-8 py-6">
//                       <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${marker.status === 'Normal' ? 'bg-green-50/50 border-green-100 text-green-600' : 'bg-orange-50 border-orange-100 text-orange-600'}`}>
//                         {marker.status}
//                       </span>
//                     </td>
//                     <td className="px-8 py-6 text-xs text-neutral-500 font-medium leading-relaxed max-w-xs">{marker.meaning}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <div className="p-10 bg-[#1A1A1A] text-white rounded-[2.5rem] shadow-xl shadow-black/5">
//             <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-3">Path Forward</p>
//             <p className="text-xl font-medium leading-relaxed">{report.advice}</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ReportExplainer;


import React, { useState, useRef } from 'react'
import { UI_CLASSES } from '../constants'
import { analyzeBloodReport } from '../services/geminiService'
import { BloodReportAnalysis, UserProfile } from '../types'
import PDFExport from './PDFExport'

interface ReportExplainerProps {
  user: UserProfile
  onNotify: (msg: string) => void
}

/**
 * 🔧 Normalize AI markers so UI always renders cleanly
 */
const normalizeMarkers = (rawMarkers: any[]) => {
  return rawMarkers.map((m) => {
    const rawText = m.value || ''

    const valueMatch = rawText.match(/^([\d.]+\s?.*?)(?=Status:|$)/i)
    const statusMatch = rawText.match(/Status:\s*([A-Za-z]+)/i)
    const meaningMatch = rawText.match(/Meaning:\s*(.*)$/i)

    return {
      name: m.name || '—',
      value: valueMatch?.[1]?.trim() || rawText || '—',
      status: statusMatch?.[1] || m.status || 'Unknown',
      meaning: meaningMatch?.[1] || m.meaning || '—',
    }
  })
}

const ReportExplainer: React.FC<ReportExplainerProps> = ({ user, onNotify }) => {
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState<BloodReportAnalysis | null>(null)
  const [image, setImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const updateStats = () => {
    const current = parseInt(localStorage.getItem('ai360_reports_count') || '0')
    localStorage.setItem('ai360_reports_count', (current + 1).toString())
    localStorage.setItem('ai360_last_activity', new Date().toISOString())
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1]
      setImage(reader.result as string)
      setLoading(true)

      try {
        const res = await analyzeBloodReport(base64, file.type)

        setReport({
          ...res,
          markers: normalizeMarkers(res.markers),
        })

        updateStats()
        onNotify('Report Decoded')
      } catch (err) {
        console.error(err)
        onNotify('Failed to analyze report')
      } finally {
        setLoading(false)
      }
    }

    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-10">
      <header>
        <p className={UI_CLASSES.subheading}>Data Analysis</p>
        <h2 className={UI_CLASSES.heading}>Report Explainer</h2>
        <p className="text-neutral-500 max-w-lg">
          Transform complex clinical labs into plain language. Understand your biomarkers with AI assistance.
        </p>
      </header>

      {/* LOADING STATE */}
      {loading && (
        <div className="min-h-[400px] flex flex-col items-center justify-center bg-white rounded-[3rem] border border-neutral-100 shadow-sm space-y-8 p-12 animate-reveal">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-4 border-neutral-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-[#1A1A1A] border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="text-center space-y-2">
            <p className="text-sm font-bold uppercase tracking-widest text-neutral-900">
              Decoding Lab Results...
            </p>
            <p className="text-[11px] text-neutral-400 font-medium">
              Our clinical engine is analyzing every biomarker for you.
            </p>
          </div>
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && !report && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="group border-2 border-dashed border-neutral-200 rounded-[3rem] p-32 text-center cursor-pointer hover:border-neutral-400 hover:bg-neutral-50 transition-all bg-white animate-reveal"
        >
          <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center text-2xl text-neutral-300 group-hover:bg-[#1A1A1A] group-hover:text-white transition-all mx-auto mb-10">
            ▤
          </div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-900">
            Upload a report
          </h3>
          <p className="text-xs text-neutral-400 font-medium max-w-xs mx-auto">
            Select a lab report to begin understanding your biomarkers in plain language.
          </p>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      )}

      {/* REPORT */}
      {!loading && report && (
        <div className="space-y-12 animate-reveal">
          {/* SUMMARY */}
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="max-w-2xl bg-white p-8 rounded-[2.5rem] border border-neutral-100 shadow-sm">
              <p className={UI_CLASSES.subheading}>Executive Summary</p>
              <p className="text-lg font-medium text-neutral-700 leading-relaxed">
                {report.summary}
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setReport(null)}
                className={UI_CLASSES.buttonSecondary}
              >
                New Report
              </button>
              <PDFExport data={report} user={user} type="REPORT" />
            </div>
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-[2.5rem] border border-neutral-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-neutral-50 border-b border-neutral-100">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                    Marker
                  </th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                    Recorded Value
                  </th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                    Status
                  </th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                    Clinical Meaning
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-neutral-50">
                {report.markers.map((marker, i) => (
                  <tr key={i} className="hover:bg-neutral-50/50">
                    <td className="px-8 py-6 font-bold text-neutral-800 text-sm">
                      {marker.name}
                    </td>
                    <td className="px-8 py-6 text-sm font-medium text-neutral-600">
                      {marker.value}
                    </td>
                    <td className="px-8 py-6">
                      <span
                        className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                          marker.status === 'Normal'
                            ? 'bg-green-50 border-green-100 text-green-600'
                            : 'bg-orange-50 border-orange-100 text-orange-600'
                        }`}
                      >
                        {marker.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-xs text-neutral-500 max-w-xs">
                      {marker.meaning}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ADVICE */}
          <div className="p-10 bg-[#1A1A1A] text-white rounded-[2.5rem] shadow-xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-3">
              Path Forward
            </p>
            <p className="text-xl font-medium leading-relaxed">
              {report.advice}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReportExplainer
