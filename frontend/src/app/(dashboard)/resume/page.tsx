'use client';

import React, { useState } from 'react';
import { api } from '@/services/api';
import { 
  FileText, Upload, Sparkles, AlertCircle, 
  CheckCircle, ArrowRight, Loader2, RefreshCw 
} from 'lucide-react';

export default function ResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [targetTitle, setTargetTitle] = useState('Senior Full Stack Engineer');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null); // Clear previous results
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('targetTitle', targetTitle);

    try {
      const res = await api.resume.analyzeResume(formData);
      if (res.success) {
        setResult(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMockUpload = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('targetTitle', targetTitle);
    
    try {
      const res = await api.resume.analyzeResume(formData);
      if (res.success) {
        setResult(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white">AI Resume Analyzer</h1>
        <p className="text-xs text-muted-foreground mt-0.5 font-medium">Evaluate your resume against recruiters' ATS scoring algorithms and target role requirements</p>
      </div>

      {!result ? (
        /* ========================================== */
        /* UPLOAD PORTAL VIEW */
        /* ========================================== */
        <div className="max-w-2xl mx-auto glass-panel p-8 rounded-3xl border border-border/60 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 h-32 w-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex flex-col items-center">
            <div className="h-16 w-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 mb-6">
              <Upload className="h-7 w-7 text-indigo-400" />
            </div>

            <h3 className="text-lg font-bold mb-2">Upload your Resume</h3>
            <p className="text-xs text-muted-foreground max-w-sm mb-8 leading-normal">
              Supported file types: PDF, DOCX, or TXT. Maximum file size is 5MB.
            </p>

            <form onSubmit={handleUploadSubmit} className="w-full space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-2 text-left">Target Job Title</label>
                <input
                  type="text"
                  value={targetTitle}
                  onChange={(e) => setTargetTitle(e.target.value)}
                  placeholder="e.g. Senior Full Stack Engineer"
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 text-xs rounded-xl text-foreground focus:outline-none"
                />
              </div>

              {/* Drag zone */}
              <div className="relative border border-dashed border-border/80 rounded-2xl p-8 hover:border-indigo-500/40 transition-colors bg-secondary/20">
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="flex flex-col items-center gap-2">
                  <FileText className="h-8 w-8 text-zinc-500" />
                  <span className="text-xs font-semibold text-zinc-300">
                    {file ? file.name : 'Choose file or drag and drop'}
                  </span>
                  {file && (
                    <span className="text-[10px] text-zinc-500">
                      {Math.round(file.size / 1024)} KB
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleMockUpload}
                  disabled={loading}
                  className="flex-1 py-3.5 rounded-xl border border-zinc-850 hover:bg-secondary/60 text-zinc-300 font-semibold text-xs transition-all cursor-pointer flex justify-center items-center gap-1.5"
                >
                  <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                  Simulate Demo Upload
                </button>
                <button
                  type="submit"
                  disabled={!file || loading}
                  className="flex-1 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-lg shadow-indigo-600/15 disabled:opacity-50 flex justify-center items-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Analyzing ATS vectors...
                    </>
                  ) : (
                    'Analyze Resume'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        /* ========================================== */
        /* ANALYSIS RESULTS VIEW */
        /* ========================================== */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          
          {/* Left: Score Dial & Suggestions */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* ATS Score card */}
            <div className="glass-panel p-6 rounded-3xl border border-border/50 text-center flex flex-col items-center">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">ATS Compatibility Score</span>
              
              <div className="relative h-36 w-36 flex items-center justify-center mb-4">
                <svg className="absolute w-full h-full transform -rotate-90">
                  <circle cx="72" cy="72" r="62" stroke="currentColor" className="text-zinc-800 dark:text-zinc-900" strokeWidth="6.5" fill="transparent" />
                  <circle cx="72" cy="72" r="62" stroke="currentColor" className="text-indigo-500" strokeWidth="6.5" fill="transparent" 
                          strokeDasharray={2 * Math.PI * 62} 
                          strokeDashoffset={2 * Math.PI * 62 * (1 - result.atsScore / 100)} />
                </svg>
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-extrabold">{result.atsScore}</span>
                  <span className="text-[9px] text-zinc-500 font-bold uppercase mt-0.5">out of 100</span>
                </div>
              </div>

              <h4 className="text-xs font-bold text-zinc-200 mt-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/15">
                {result.verdict}
              </h4>
              
              <button 
                onClick={() => { setFile(null); setResult(null); }}
                className="mt-6 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-semibold cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Analyze Another Resume
              </button>
            </div>

            {/* Diagnostics Metrics grid */}
            <div className="glass-panel p-5 rounded-3xl border border-border/50 space-y-4">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Diagnostic Metrics</span>
              
              <div className="grid grid-cols-2 gap-3.5 text-xs">
                <div className="p-3 bg-secondary/40 border border-border/60 rounded-xl">
                  <span className="text-zinc-500 block text-[9px] font-bold uppercase">Impact Metric</span>
                  <span className="text-base font-extrabold block mt-1">{result.metrics.impactScore}%</span>
                </div>
                <div className="p-3 bg-secondary/40 border border-border/60 rounded-xl">
                  <span className="text-zinc-500 block text-[9px] font-bold uppercase">Brevity Score</span>
                  <span className="text-base font-extrabold block mt-1">{result.metrics.brevityScore}%</span>
                </div>
                <div className="p-3 bg-secondary/40 border border-border/60 rounded-xl">
                  <span className="text-zinc-500 block text-[9px] font-bold uppercase">Layout Style</span>
                  <span className="text-base font-extrabold block mt-1">{result.metrics.styleScore}%</span>
                </div>
                <div className="p-3 bg-secondary/40 border border-border/60 rounded-xl">
                  <span className="text-zinc-500 block text-[9px] font-bold uppercase">Skill Match</span>
                  <span className="text-base font-extrabold block mt-1">{result.metrics.skillsScore}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Detailed suggestions and Keywords */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Keywords Analysis */}
            <div className="glass-panel p-6 rounded-3xl border border-border/50">
              <h3 className="font-extrabold text-base mb-4 flex items-center gap-2">
                <Sparkles className="h-4.5 w-4.5 text-indigo-400" />
                Keyword Check ({targetTitle})
              </h3>
              
              <div className="overflow-x-auto no-scrollbar border border-border/80 rounded-xl">
                <table className="w-full text-xs text-left divide-y divide-border/60">
                  <thead className="bg-secondary/40 text-muted-foreground font-bold text-[10px] uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-2.5">Industry Keyword</th>
                      <th className="px-4 py-2.5">Presence</th>
                      <th className="px-4 py-2.5">Importance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 font-semibold">
                    {result.keywordAnalysis.map((item: any, idx: number) => (
                      <tr key={idx} className="hover:bg-secondary/20">
                        <td className="px-4 py-3 font-bold">{item.keyword}</td>
                        <td className="px-4 py-3">
                          {item.present ? (
                            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-500/5 px-2 py-0.5 rounded">
                              <CheckCircle className="h-3 w-3" /> Found
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] text-red-400 font-bold bg-red-500/5 px-2 py-0.5 rounded">
                              <AlertCircle className="h-3 w-3" /> Missing
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{item.importance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bullet Point suggestions list */}
            <div className="glass-panel p-6 rounded-3xl border border-border/50">
              <h3 className="font-extrabold text-base mb-4">Improvement Roadmap</h3>
              <div className="space-y-4">
                {result.suggestions.map((sug: any, idx: number) => (
                  <div key={idx} className="p-4 bg-secondary/35 border border-border/60 rounded-xl flex gap-3.5">
                    <div className="h-7 w-7 rounded bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-500/15">
                      <span className="text-indigo-400 text-xs font-bold">{idx + 1}</span>
                    </div>
                    <div className="text-xs">
                      <span className="font-extrabold text-zinc-200 block mb-1">Section: {sug.section}</span>
                      <p className="text-muted-foreground leading-normal">{sug.tip}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Missing skills blocks */}
            <div className="glass-panel p-6 rounded-3xl border border-border/50">
              <h3 className="font-extrabold text-base mb-3.5">Missing Core Skillsets</h3>
              <p className="text-xs text-muted-foreground mb-4">We detected these missing technical skills on your resume for {targetTitle} positions.</p>
              <div className="flex flex-wrap gap-2.5">
                {result.missingSkills.map((skill: string, idx: number) => (
                  <span key={idx} className="text-xs font-bold px-3 py-1.5 rounded-xl bg-indigo-500/5 text-indigo-400 border border-indigo-500/10">
                    + {skill}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
