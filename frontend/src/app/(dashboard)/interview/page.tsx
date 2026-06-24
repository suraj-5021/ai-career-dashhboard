'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { 
  MessageSquare, Sparkles, Trophy, AlertCircle, 
  Plus, CheckCircle2, ChevronRight, Loader2, ArrowRight, X, Play, RefreshCw
} from 'lucide-react';

export default function InterviewPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<any | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // New question form fields
  const [newQuestion, setNewQuestion] = useState('');
  const [category, setCategory] = useState('Technical');
  const [difficulty, setDifficulty] = useState('Medium');
  const [suggestedAnswer, setSuggestedAnswer] = useState('');
  const [saving, setSaving] = useState(false);

  // Filter state
  const [activeTab, setActiveTab] = useState('All');
  const [selectedTrack, setSelectedTrack] = useState('MERN Developer');

  // Mock Session states
  const [mockSessionActive, setMockSessionActive] = useState(false);
  const [mockSessionQuestions, setMockSessionQuestions] = useState<any[]>([]);
  const [currentMockIndex, setCurrentMockIndex] = useState(0);
  const [mockAnswers, setMockAnswers] = useState<string[]>([]);
  const [mockSessionScores, setMockSessionScores] = useState<number[]>([]);
  const [mockSessionFeedbacks, setMockSessionFeedbacks] = useState<string[]>([]);
  const [mockSessionCompleted, setMockSessionCompleted] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const res = await api.interview.getQuestions();
      if (res.success) {
        // Enforce the standard categories: HR, Technical, Aptitude
        const enriched = res.data.map((q: any) => {
          let mappedCat = q.category;
          if (q.category === 'Behavioral') mappedCat = 'HR';
          if (q.category === 'System Design') mappedCat = 'Aptitude';
          return { ...q, category: mappedCat };
        });
        setQuestions(enriched);
        if (enriched.length > 0 && !selectedQuestion) {
          setSelectedQuestion(enriched[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuestion || !userAnswer.trim()) return;

    setSubmitting(true);
    const id = selectedQuestion._id;
    try {
      const res = await api.interview.submitAnswer(id, userAnswer);
      if (res.success) {
        const updatedQ = { ...res.data, category: selectedQuestion.category };
        setQuestions(prev => prev.map(q => q._id === id ? updatedQ : q));
        setSelectedQuestion(updatedQ);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion || !suggestedAnswer) return;
    setSaving(true);
    try {
      let mappedCat = category;
      if (category === 'Behavioral') mappedCat = 'HR';
      if (category === 'System Design') mappedCat = 'Aptitude';

      const res = await api.interview.addQuestion({
        question: newQuestion,
        category: mappedCat,
        difficulty,
        suggestedAnswer
      });
      if (res.success) {
        const enriched = { ...res.data, category: mappedCat };
        setQuestions(prev => [...prev, enriched]);
        setSelectedQuestion(enriched);
        setShowAddModal(false);
        setNewQuestion('');
        setSuggestedAnswer('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // Mock Session trigger: pull 10 randomized questions from backend/simulator
  const handleStartMockSession = async () => {
    setLoading(true);
    try {
      const res = await api.interview.getQuestions(true, selectedTrack);
      if (res.success) {
        const enriched = res.data.map((q: any) => {
          let mappedCat = q.category;
          if (q.category === 'Behavioral') mappedCat = 'HR';
          if (q.category === 'System Design') mappedCat = 'Aptitude';
          return { ...q, category: mappedCat };
        });
        setMockSessionQuestions(enriched);
        setCurrentMockIndex(0);
        setMockAnswers([]);
        setMockSessionScores([]);
        setMockSessionFeedbacks([]);
        setMockSessionActive(true);
        setMockSessionCompleted(false);
        setUserAnswer('');
      }
    } catch (err) {
      console.error('Error starting mock session:', err);
    } finally {
      setLoading(false);
    }
  };

  // Submit and grade single question in session
  const handleMockSessionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;

    setSubmitting(true);
    const activeQ = mockSessionQuestions[currentMockIndex];
    
    try {
      const res = await api.interview.submitAnswer(activeQ._id, userAnswer);
      if (res.success) {
        const updatedAnswers = [...mockAnswers, userAnswer];
        const updatedScores = [...mockSessionScores, res.data.score];
        const updatedFeedbacks = [...mockSessionFeedbacks, res.data.feedback];

        setMockAnswers(updatedAnswers);
        setMockSessionScores(updatedScores);
        setMockSessionFeedbacks(updatedFeedbacks);
        setUserAnswer('');

        if (currentMockIndex < mockSessionQuestions.length - 1) {
          setCurrentMockIndex(currentMockIndex + 1);
        } else {
          setMockSessionCompleted(true);
          loadQuestions(); // refresh main pool
        }
      }
    } catch (err) {
      console.error('Error grading mock answer:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy': return 'text-emerald-400 bg-emerald-500/5 border-emerald-500/10';
      case 'Medium': return 'text-amber-400 bg-amber-500/5 border-amber-500/10';
      case 'Hard': return 'text-red-400 bg-red-500/5 border-red-500/10';
      default: return 'text-zinc-400';
    }
  };

  // Filter pool
  const filteredQuestions = questions.filter(q => {
    if (activeTab === 'All') return true;
    return q.category === activeTab;
  });

  // Report score aggregations
  const technicalScores = mockSessionScores.filter((_, idx) => 
    mockSessionQuestions[idx]?.category === 'Technical' || mockSessionQuestions[idx]?.category === 'Aptitude'
  );
  const technicalScore = technicalScores.length > 0
    ? Math.round(technicalScores.reduce((a, b) => a + b, 0) / technicalScores.length)
    : 0;

  const hrScores = mockSessionScores.filter((_, idx) => 
    mockSessionQuestions[idx]?.category === 'HR'
  );
  const hrScore = hrScores.length > 0
    ? Math.round(hrScores.reduce((a, b) => a + b, 0) / hrScores.length)
    : 0;

  // Communication score dynamically derived from answer length and readability flow
  const communicationScore = mockSessionScores.length > 0 ? Math.round(
    mockSessionScores.reduce((acc, score, idx) => {
      const words = mockAnswers[idx]?.trim().split(/\s+/).length || 0;
      let commVal = score;
      if (words > 40) commVal = Math.min(98, commVal + 8);
      else if (words < 15) commVal = Math.max(10, commVal - 12);
      return acc + commVal;
    }, 0) / mockSessionScores.length
  ) : 0;

  const overallSessionScore = mockSessionScores.length > 0 
    ? Math.round(mockSessionScores.reduce((a, b) => a + b, 0) / mockSessionScores.length)
    : 0;

  let overallRating = 'Needs Practice';
  let overallRatingColor = 'text-red-400';
  if (overallSessionScore >= 85) {
    overallRating = 'Placement Ready (Excellent)';
    overallRatingColor = 'text-emerald-400';
  } else if (overallSessionScore >= 70) {
    overallRating = 'Strong Candidate (Good)';
    overallRatingColor = 'text-indigo-400';
  } else if (overallSessionScore >= 50) {
    overallRating = 'Needs Practice (Average)';
    overallRatingColor = 'text-amber-400';
  } else {
    overallRating = 'Under Prepared (Weak)';
    overallRatingColor = 'text-rose-400';
  }

  if (loading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">AI Interview Prep</h1>
          <p className="text-xs text-muted-foreground mt-0.5 font-medium">Practice standard interview question sets and receive grading feedback</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto px-4 py-3 rounded-xl bg-indigo-650 hover:bg-indigo-600 text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/15 min-h-[44px]"
        >
          <Plus className="h-4 w-4" />
          Add Custom Question
        </button>
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Question Pool and Session Triggers */}
        <div className="lg:col-span-1 space-y-4">
          
          {/* Start Mock Session Card */}
          {!mockSessionActive && (
            <div className="glass-panel p-5 rounded-3xl border border-border/50 bg-indigo-950/5 space-y-3.5">
              <span className="text-[9px] font-extrabold text-indigo-400 uppercase tracking-widest block">Standard Mock Simulation</span>
              <p className="text-[11px] text-zinc-400 leading-normal">
                Initiate a sequential 10-question mock session (Technical, HR, Aptitude) to calculate your aggregate readiness score.
              </p>
              <div>
                <label className="block text-[9px] font-bold text-zinc-400 uppercase mb-1">Select Interview Track</label>
                <select 
                  value={selectedTrack} 
                  onChange={(e) => setSelectedTrack(e.target.value)} 
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-xs rounded-xl text-zinc-350 focus:outline-none min-h-[38px] mb-2"
                >
                  <option value="MERN Developer">MERN Developer</option>
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="DevOps Engineer">DevOps Engineer</option>
                  <option value="Data Analyst">Data Analyst</option>
                  <option value="Cyber Security">Cyber Security</option>
                </select>
              </div>
              <button
                onClick={handleStartMockSession}
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-indigo-600/10 cursor-pointer min-h-[44px]"
              >
                <Play className="h-4 w-4 fill-white stroke-none" />
                Start Mock Interview
              </button>
            </div>
          )}

          {/* Question Pool Filters */}
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block px-1">Interview Questions Pool</span>
            
            {/* Category tabs */}
            <div className="flex flex-wrap gap-1 bg-zinc-950/45 p-1 rounded-xl border border-border/60">
              {['All', 'Technical', 'HR', 'Aptitude'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setMockSessionActive(false); // Return to pool if filter changes
                  }}
                  className={`flex-1 py-2 px-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer min-h-[36px] flex items-center justify-center ${
                    activeTab === tab && !mockSessionActive
                      ? 'bg-secondary text-white'
                      : 'text-muted-foreground hover:text-zinc-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Questions List */}
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 no-scrollbar">
              {filteredQuestions.map((q) => {
                const isSelected = selectedQuestion?._id === q._id && !mockSessionActive;
                const borderLColor = 
                  q.difficulty === 'Easy' ? 'border-l-4 border-l-emerald-500' :
                  q.difficulty === 'Medium' ? 'border-l-4 border-l-amber-500' :
                  'border-l-4 border-l-rose-500';

                return (
                  <button
                    key={q._id}
                    onClick={() => {
                      setMockSessionActive(false);
                      setSelectedQuestion(q);
                      setUserAnswer(q.userAnswer || '');
                    }}
                    className={`w-full p-4 rounded-2xl border text-left transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer flex justify-between items-start gap-3 relative min-h-[44px] ${borderLColor} ${
                      isSelected 
                        ? 'bg-primary/5 border-primary shadow-md' 
                        : 'bg-card border-border/80 hover:bg-secondary/40'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex gap-2 items-center">
                        <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border uppercase ${getDifficultyColor(q.difficulty)}`}>
                          {q.difficulty}
                        </span>
                        <span className="text-[9px] text-zinc-500 font-bold uppercase">{q.category}</span>
                      </div>
                      <h4 className="text-xs font-bold truncate mt-2 text-zinc-200">{q.question}</h4>
                    </div>
                    {q.isCompleted && (
                      <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
              {filteredQuestions.length === 0 && (
                <div className="text-center text-xs text-muted-foreground py-6">No questions found in this category.</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Active Workspace */}
        <div className="lg:col-span-2">
          
          {/* MOCK SESSION SCREEN */}
          {mockSessionActive ? (
            <div className="glass-panel p-6 rounded-3xl border border-border/60 space-y-6">
              
              {/* Session completed display */}
              {mockSessionCompleted ? (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Gauge details */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {/* Overall Score */}
                      <div className="glass-panel p-4 rounded-2xl border border-border/80 text-center flex flex-col items-center justify-center">
                        <div className="relative h-20 w-20 flex items-center justify-center shrink-0">
                          <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="42" stroke="#1f2937" strokeWidth="6" fill="transparent" className="dark:stroke-zinc-800" />
                            <circle cx="50" cy="50" r="42" stroke="#6366f1" strokeWidth="6" strokeLinecap="round" fill="transparent" 
                                    strokeDasharray={2 * Math.PI * 42} 
                                    strokeDashoffset={2 * Math.PI * 42 * (1 - overallSessionScore / 100)} 
                                    style={{ filter: 'drop-shadow(0 0 3px rgba(99, 102, 241, 0.3))' }}
                            />
                          </svg>
                          <div className="flex flex-col items-center">
                            <span className="text-xl font-black text-white">{overallSessionScore}</span>
                            <span className="text-[7px] text-zinc-500 font-extrabold uppercase tracking-wider">Overall</span>
                          </div>
                        </div>
                        <span className="text-[9px] text-zinc-400 font-extrabold uppercase mt-2">Overall Rating</span>
                        <span className={`text-[10px] font-bold ${overallRatingColor} truncate max-w-full`}>{overallRating}</span>
                      </div>

                      {/* Technical Score */}
                      <div className="glass-panel p-4 rounded-2xl border border-border/80 text-center flex flex-col items-center justify-center">
                        <div className="relative h-20 w-20 flex items-center justify-center shrink-0">
                          <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="42" stroke="#1f2937" strokeWidth="6" fill="transparent" className="dark:stroke-zinc-800" />
                            <circle cx="50" cy="50" r="42" stroke="#3b82f6" strokeWidth="6" strokeLinecap="round" fill="transparent" 
                                    strokeDasharray={2 * Math.PI * 42} 
                                    strokeDashoffset={2 * Math.PI * 42 * (1 - technicalScore / 100)} 
                                    style={{ filter: 'drop-shadow(0 0 3px rgba(59, 130, 246, 0.3))' }}
                            />
                          </svg>
                          <div className="flex flex-col items-center">
                            <span className="text-xl font-black text-white">{technicalScore}</span>
                            <span className="text-[7px] text-zinc-500 font-extrabold uppercase tracking-wider">Tech</span>
                          </div>
                        </div>
                        <span className="text-[9px] text-zinc-400 font-extrabold uppercase mt-2">Technical</span>
                        <span className="text-[10px] text-zinc-500 font-bold">Concept Depth</span>
                      </div>

                      {/* HR Score */}
                      <div className="glass-panel p-4 rounded-2xl border border-border/80 text-center flex flex-col items-center justify-center">
                        <div className="relative h-20 w-20 flex items-center justify-center shrink-0">
                          <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="42" stroke="#1f2937" strokeWidth="6" fill="transparent" className="dark:stroke-zinc-800" />
                            <circle cx="50" cy="50" r="42" stroke="#10b981" strokeWidth="6" strokeLinecap="round" fill="transparent" 
                                    strokeDasharray={2 * Math.PI * 42} 
                                    strokeDashoffset={2 * Math.PI * 42 * (1 - hrScore / 100)} 
                                    style={{ filter: 'drop-shadow(0 0 3px rgba(16, 185, 129, 0.3))' }}
                            />
                          </svg>
                          <div className="flex flex-col items-center">
                            <span className="text-xl font-black text-white">{hrScore}</span>
                            <span className="text-[7px] text-zinc-500 font-extrabold uppercase tracking-wider">HR</span>
                          </div>
                        </div>
                        <span className="text-[9px] text-zinc-400 font-extrabold uppercase mt-2">HR/Behavioral</span>
                        <span className="text-[10px] text-zinc-500 font-bold">STAR Logic</span>
                      </div>

                      {/* Communication Score */}
                      <div className="glass-panel p-4 rounded-2xl border border-border/80 text-center flex flex-col items-center justify-center">
                        <div className="relative h-20 w-20 flex items-center justify-center shrink-0">
                          <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="42" stroke="#1f2937" strokeWidth="6" fill="transparent" className="dark:stroke-zinc-800" />
                            <circle cx="50" cy="50" r="42" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" fill="transparent" 
                                    strokeDasharray={2 * Math.PI * 42} 
                                    strokeDashoffset={2 * Math.PI * 42 * (1 - communicationScore / 100)} 
                                    style={{ filter: 'drop-shadow(0 0 3px rgba(245, 158, 11, 0.3))' }}
                            />
                          </svg>
                          <div className="flex flex-col items-center">
                            <span className="text-xl font-black text-white">{communicationScore}</span>
                            <span className="text-[7px] text-zinc-500 font-extrabold uppercase tracking-wider">Comm</span>
                          </div>
                        </div>
                        <span className="text-[9px] text-zinc-400 font-extrabold uppercase mt-2">Communication</span>
                        <span className="text-[10px] text-zinc-500 font-bold">Clarity & Flow</span>
                      </div>
                    </div>

                    <div className="p-4 bg-indigo-950/20 border border-indigo-500/20 rounded-2xl flex items-center gap-3 text-xs">
                      <Trophy className="h-4.5 w-4.5 text-amber-400 shrink-0" />
                      <p className="text-zinc-400 leading-normal font-medium">
                        CareerOS AI evaluated your responses across Technical, HR, and Aptitude metrics. Check individual critiques below to see key improvement areas.
                      </p>
                    </div>
                  </div>

                  {/* Sequential Feedback cards */}
                  <div className="space-y-4">
                    {mockSessionQuestions.map((q, idx) => (
                      <div key={q._id || idx} className="p-4 bg-secondary/30 border border-border/60 rounded-xl space-y-3.5">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">{q.title}</span>
                          <span className="text-xs font-black text-white bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">{mockSessionScores[idx]}% Score</span>
                        </div>
                        <h4 className="text-xs font-bold text-zinc-200 leading-relaxed">"{q.question}"</h4>
                        <div className="text-[11px] text-zinc-400 leading-relaxed italic bg-zinc-950/30 p-3 rounded-lg border border-border/30">
                          Your response: "{mockAnswers[idx]}"
                        </div>
                        <p className="text-[11px] text-zinc-300 leading-relaxed font-medium"><strong className="text-indigo-400">AI Critique:</strong> {mockSessionFeedbacks[idx]}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleStartMockSession}
                      className="flex-1 py-3.5 rounded-xl border border-zinc-800 bg-zinc-950/20 hover:bg-secondary text-xs font-semibold text-zinc-300 transition-all cursor-pointer text-center min-h-[44px]"
                    >
                      Retake Session
                    </button>
                    <button
                      onClick={() => setMockSessionActive(false)}
                      className="flex-1 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all cursor-pointer text-center min-h-[44px]"
                    >
                      Back to Pool
                    </button>
                  </div>

                </div>
              ) : (
                /* Sequential session loop */
                <form onSubmit={handleMockSessionSubmit} className="space-y-5 animate-fade-in">
                  
                  <div className="pb-4 border-b border-border/60">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[9px] font-extrabold text-indigo-400 uppercase tracking-widest">
                        Mock Loop: Question {currentMockIndex + 1} of {mockSessionQuestions.length}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary border border-border">
                        {mockSessionQuestions[currentMockIndex].category}
                      </span>
                    </div>
                    <span className="text-xs text-zinc-500 block mb-1 uppercase font-bold">{mockSessionQuestions[currentMockIndex].title}</span>
                    <h3 className="font-extrabold text-sm sm:text-base leading-relaxed text-white">
                      {mockSessionQuestions[currentMockIndex].question}
                    </h3>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-2">Write your response</label>
                    <textarea
                      rows={8}
                      required
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Answer in full. Emphasize details and explain the reasoning behind your statements..."
                      className="w-full p-4 bg-zinc-950 border border-zinc-850 text-xs rounded-2xl text-foreground focus:outline-none focus:border-indigo-500 resize-none font-sans leading-relaxed min-h-[140px]"
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-zinc-500 font-bold">
                      {userAnswer.trim().split(/\s+/).filter(Boolean).length} words typed
                    </span>
                    <button
                      type="submit"
                      disabled={submitting || !userAnswer.trim()}
                      className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg min-h-[44px]"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          Evaluating response...
                        </>
                      ) : (
                        <>
                          <span>{currentMockIndex < mockSessionQuestions.length - 1 ? 'Submit & Next' : 'Submit & Finish'}</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </>
                      )}
                    </button>
                  </div>

                </form>
              )}

            </div>
          ) : selectedQuestion ? (
            /* NORMAL SINGLE QUESTION WORKSPACE */
            <div className="glass-panel p-6 rounded-3xl border border-border/60 space-y-6 animate-fade-in">
              
              {/* Question description */}
              <div className="pb-4 border-b border-border/60">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">{selectedQuestion.category} Question</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getDifficultyColor(selectedQuestion.difficulty)}`}>
                    {selectedQuestion.difficulty}
                  </span>
                </div>
                <h3 className="font-extrabold text-sm sm:text-base leading-relaxed text-white">
                  {selectedQuestion.question}
                </h3>
              </div>

              {/* Answer submission workspace */}
              {!selectedQuestion.isCompleted ? (
                <form onSubmit={handleSubmitAnswer} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-2">Draft your response</label>
                    <textarea
                      rows={8}
                      required
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Type your structured answer here. For technical questions, explain your step-by-step logic. For behavioral, use the STAR model..."
                      className="w-full p-4 bg-zinc-950 border border-zinc-850 text-xs rounded-2xl text-foreground focus:outline-none focus:border-indigo-500 resize-none font-sans leading-relaxed min-h-[140px]"
                    />
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-[10px] text-zinc-500 font-bold">
                      {userAnswer.trim().split(/\s+/).filter(Boolean).length} words
                    </span>
                    <button
                      type="submit"
                      disabled={submitting || !userAnswer.trim()}
                      className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-600/15 disabled:opacity-50 min-h-[44px]"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          Grading responses...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-3.5 w-3.5" />
                          Submit Response
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                /* Response grading feedback */
                <div className="space-y-6">
                  
                  {/* Feedback summary stats with Score Gauge */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-secondary/25 border border-border/50 rounded-2xl">
                    {(() => {
                      const score = selectedQuestion.score || 0;
                      const strokeColor = score >= 80 ? '#34d399' : score >= 60 ? '#fbbf24' : '#f87171';
                      
                      return (
                        <div className="relative h-24 w-24 flex items-center justify-center shrink-0">
                          <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="42" stroke="#1f2937" strokeWidth="6" fill="transparent" className="dark:stroke-zinc-800" />
                            <circle cx="50" cy="50" r="42" stroke={strokeColor} strokeWidth="6" strokeLinecap="round" fill="transparent" 
                                    strokeDasharray={2 * Math.PI * 42} 
                                    strokeDashoffset={2 * Math.PI * 42 * (1 - score / 100)} 
                                    style={{ filter: `drop-shadow(0 0 3px ${strokeColor}50)` }}
                            />
                          </svg>
                          <div className="flex flex-col items-center">
                            <span className="text-2xl font-black text-white">{score}</span>
                            <span className="text-[8px] text-zinc-500 font-extrabold uppercase tracking-wider">Score</span>
                          </div>
                        </div>
                      );
                    })()}
                    
                    <div className="flex-1 space-y-2 text-xs text-left w-full">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-amber-400" />
                        <span className="font-extrabold text-zinc-200 text-sm">Grading Analysis</span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        Your response has been evaluated by CareerOS AI. Review the grading summary and improvement blueprint recommendations below.
                      </p>
                    </div>
                  </div>

                  {/* AI Comments */}
                  <div className="p-5 bg-indigo-500/[0.02] border border-indigo-500/10 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/[0.01] rounded-full blur-2xl pointer-events-none" />
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block mb-2 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" />
                      AI Grading Feedback
                    </span>
                    <p className="text-xs text-zinc-200 leading-relaxed font-medium">{selectedQuestion.feedback}</p>
                  </div>

                  {/* Submitted Answer display */}
                  <div className="p-5 bg-secondary/20 border border-border/40 rounded-2xl">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Your Submitted Response</span>
                    <div className="text-xs text-zinc-400 font-medium italic border-l-2 border-zinc-700 pl-3 leading-relaxed whitespace-pre-wrap">
                      "{selectedQuestion.userAnswer}"
                    </div>
                  </div>

                  {/* Suggested Answer key */}
                  <div className="p-5 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl border-l-4 border-l-indigo-500">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block mb-2">Suggested Answer Blueprint</span>
                    <p className="text-xs text-zinc-300 leading-relaxed font-medium whitespace-pre-wrap">{selectedQuestion.suggestedAnswer}</p>
                  </div>

                  <button
                    onClick={() => {
                      setQuestions(prev => prev.map(q => q._id === selectedQuestion._id ? { ...q, isCompleted: false } : q));
                      setSelectedQuestion((prev: any) => ({ ...prev, isCompleted: false }));
                    }}
                    className="w-full py-3 rounded-xl border border-zinc-800 bg-zinc-950/20 hover:bg-secondary text-xs font-semibold text-muted-foreground hover:text-foreground transition-all cursor-pointer text-center min-h-[44px]"
                  >
                    Reset & Retake Practice
                  </button>

                </div>
              )}

            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-center p-6 border border-dashed border-border/60 rounded-3xl">
              <span className="text-xs text-muted-foreground font-semibold">No question selected. Add a question or select one from the pool.</span>
            </div>
          )}
        </div>

      </div>

      {/* ========================================== */}
      {/* ADD CUSTOM QUESTION MODAL */}
      {/* ========================================== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-panel w-full max-w-lg rounded-2xl p-6 border border-border shadow-2xl relative animate-fade-in">
            <h3 className="text-lg font-bold text-white mb-5">Add Custom Interview Question</h3>
            <form onSubmit={handleAddQuestion} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Question Description</label>
                <input type="text" required placeholder="e.g. Explain how event delegation works in Javascript." value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 text-xs rounded-xl text-foreground focus:outline-none min-h-[44px]" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-xs rounded-xl text-muted-foreground focus:outline-none min-h-[44px]">
                    <option value="Technical">Technical</option>
                    <option value="Behavioral">HR</option>
                    <option value="System Design">Aptitude</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Difficulty</label>
                  <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-xs rounded-xl text-muted-foreground focus:outline-none min-h-[44px]">
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Suggested Answer Key / Bullet Points</label>
                <textarea rows={4} required placeholder="What are the main things to mention in a perfect response? (Used for grading reference)" value={suggestedAnswer} onChange={(e) => setSuggestedAnswer(e.target.value)} className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-xs rounded-xl text-foreground focus:outline-none resize-none min-h-[100px]" />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2.5 border border-border text-xs font-semibold rounded-xl text-muted-foreground hover:bg-secondary cursor-pointer min-h-[44px]">Cancel</button>
                <button type="submit" disabled={saving} className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl flex items-center gap-1 cursor-pointer min-h-[44px]">
                  {saving && <Loader2 className="h-3 w-3 animate-spin" />}
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
