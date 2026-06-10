'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { 
  MessageSquare, Sparkles, Trophy, AlertCircle, 
  Plus, CheckCircle2, ChevronRight, Loader2 
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

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const res = await api.interview.getQuestions();
      if (res.success) {
        setQuestions(res.data);
        if (res.data.length > 0 && !selectedQuestion) {
          setSelectedQuestion(res.data[0]);
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
        // Update local arrays
        setQuestions(prev => prev.map(q => q._id === id ? res.data : q));
        setSelectedQuestion(res.data);
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
      const res = await api.interview.addQuestion({
        question: newQuestion,
        category,
        difficulty,
        suggestedAnswer
      });
      if (res.success) {
        setQuestions(prev => [...prev, res.data]);
        setSelectedQuestion(res.data);
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

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy': return 'text-emerald-400 bg-emerald-500/5 border-emerald-500/10';
      case 'Medium': return 'text-amber-400 bg-amber-500/5 border-amber-500/10';
      case 'Hard': return 'text-red-400 bg-red-500/5 border-red-500/10';
      default: return 'text-zinc-400';
    }
  };

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
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/15"
        >
          <Plus className="h-4 w-4" />
          Add Custom Question
        </button>
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Question List Selector */}
        <div className="lg:col-span-1 space-y-3">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2 px-1">Interview Questions Pool</span>
          
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 no-scrollbar">
            {questions.map((q) => {
              const isSelected = selectedQuestion?._id === q._id;
              return (
                <button
                  key={q._id}
                  onClick={() => {
                    setSelectedQuestion(q);
                    setUserAnswer(q.userAnswer || '');
                  }}
                  className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex justify-between items-start gap-3 relative ${
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
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active Workspace */}
        <div className="lg:col-span-2">
          {selectedQuestion ? (
            <div className="glass-panel p-6 rounded-3xl border border-border/60 space-y-6">
              
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
                      className="w-full p-4 bg-zinc-950 border border-zinc-850 text-xs rounded-2xl text-foreground focus:outline-none focus:border-indigo-500 resize-none font-sans leading-relaxed"
                    />
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-[10px] text-zinc-500 font-bold">
                      {userAnswer.trim().split(/\s+/).filter(Boolean).length} words
                    </span>
                    <button
                      type="submit"
                      disabled={submitting || !userAnswer.trim()}
                      className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-600/15 disabled:opacity-50"
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
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Feedback summary stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-emerald-500/5 border border-emerald-500/15 rounded-2xl flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400"><Trophy className="h-5 w-5" /></div>
                      <div>
                        <span className="text-zinc-500 text-[9px] font-bold uppercase">Grading Score</span>
                        <span className="text-xl font-extrabold block text-emerald-400 mt-0.5">{selectedQuestion.score} / 100</span>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-indigo-500/5 border border-indigo-500/15 rounded-2xl flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400"><Sparkles className="h-5 w-5" /></div>
                      <div>
                        <span className="text-zinc-500 text-[9px] font-bold uppercase">Verdict Status</span>
                        <span className="text-xs font-bold block text-zinc-200 mt-0.5">Response Evaluated</span>
                      </div>
                    </div>
                  </div>

                  {/* AI Comments */}
                  <div className="p-4 bg-secondary/40 border border-border/50 rounded-2xl">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-2">AI Grading Feedback</span>
                    <p className="text-xs text-zinc-300 leading-relaxed font-semibold">{selectedQuestion.feedback}</p>
                  </div>

                  {/* Submitted Answer display */}
                  <div className="p-4 bg-secondary/20 border border-border/30 rounded-2xl">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Your Submitted Response</span>
                    <p className="text-xs text-zinc-400 italic leading-relaxed">{selectedQuestion.userAnswer}</p>
                  </div>

                  {/* Suggested Answer key */}
                  <div className="p-4 bg-indigo-950/10 border border-indigo-500/10 rounded-2xl">
                    <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest block mb-2">Suggested Answer Blueprint</span>
                    <p className="text-xs text-zinc-400 leading-relaxed">{selectedQuestion.suggestedAnswer}</p>
                  </div>

                  <button
                    onClick={() => {
                      setQuestions(prev => prev.map(q => q._id === selectedQuestion._id ? { ...q, isCompleted: false } : q));
                      setSelectedQuestion((prev: any) => ({ ...prev, isCompleted: false }));
                    }}
                    className="w-full py-2.5 rounded-xl border border-zinc-800 bg-zinc-950/20 hover:bg-secondary text-xs font-semibold text-muted-foreground hover:text-foreground transition-all cursor-pointer text-center"
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
          <div className="glass-panel w-full max-w-lg rounded-2xl p-6 border border-border shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-5">Add Custom Interview Question</h3>
            <form onSubmit={handleAddQuestion} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Question Description</label>
                <input type="text" required placeholder="e.g. Explain how event delegation works in Javascript." value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 text-xs rounded-lg text-foreground focus:outline-none" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-xs rounded-lg text-muted-foreground focus:outline-none">
                    <option value="Technical">Technical</option>
                    <option value="Behavioral">Behavioral</option>
                    <option value="System Design">System Design</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Difficulty</label>
                  <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-xs rounded-lg text-muted-foreground focus:outline-none">
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Suggested Answer Key / Bullet Points</label>
                <textarea rows={4} required placeholder="What are the main things to mention in a perfect response? (Used for grading reference)" value={suggestedAnswer} onChange={(e) => setSuggestedAnswer(e.target.value)} className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-xs rounded-lg text-foreground focus:outline-none resize-none" />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border border-border text-xs font-semibold rounded-lg text-muted-foreground hover:bg-secondary cursor-pointer">Cancel</button>
                <button type="submit" disabled={saving} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg flex items-center gap-1 cursor-pointer">
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
