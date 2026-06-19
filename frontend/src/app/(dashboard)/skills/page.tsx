'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { 
  Award, Sparkles, BookOpen, Compass, 
  CheckCircle2, Plus, ArrowRight, Loader2, Play 
} from 'lucide-react';

export default function SkillsPage() {
  const [skills, setSkills] = useState<any[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<any | null>(null);
  const [roadmap, setRoadmap] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // New skill fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Frontend');
  const [level, setLevel] = useState(10);
  const [targetLevel, setTargetLevel] = useState(80);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      const res = await api.skills.getSkills();
      if (res.success) {
        setSkills(res.data);
        if (res.data.length > 0 && !selectedSkill) {
          setSelectedSkill(res.data[0]);
          loadRoadmap(res.data[0].name);
        }
      }
    } catch (err) {
      console.error('Error fetching skills:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadRoadmap = async (skillName: string) => {
    setLoadingRoadmap(true);
    try {
      const res = await api.skills.getRoadmap(skillName);
      if (res.success) {
        setRoadmap(res.data);
      }
    } catch (err) {
      console.error('Error fetching roadmap:', err);
    } finally {
      setLoadingRoadmap(false);
    }
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    setSaving(true);
    try {
      const res = await api.skills.createSkill({
        name, category, level, targetLevel
      });
      if (res.success) {
        setSkills(prev => [...prev, res.data]);
        setSelectedSkill(res.data);
        loadRoadmap(res.data.name);
        setShowAddModal(false);
        setName('');
        setLevel(10);
        setTargetLevel(80);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const getStepStatusStyles = (status: string) => {
    switch (status) {
      case 'completed': return { 
        color: 'border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/30 transition-all', 
        dot: 'bg-emerald-400',
        badge: 'bg-emerald-500/10 text-emerald-450 text-emerald-400 border-emerald-500/20',
        badgeText: 'Completed'
      };
      case 'current': return { 
        color: 'border-amber-500/20 bg-amber-500/5 hover:border-amber-500/30 transition-all', 
        dot: 'bg-amber-400',
        badge: 'bg-amber-500/10 text-amber-450 text-amber-400 border-amber-500/20',
        badgeText: 'In Progress'
      };
      default: return { 
        color: 'border-zinc-800 bg-secondary/20 hover:border-zinc-700 transition-all', 
        dot: 'bg-zinc-700',
        badge: 'bg-zinc-800/50 text-zinc-500 border-zinc-800/80',
        badgeText: 'Up Next'
      };
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
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Skills Dashboard</h1>
          <p className="text-xs text-muted-foreground mt-0.5 font-medium">Analyze technology proficiency targets and generate interactive training roadmaps</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/15"
        >
          <Plus className="h-4 w-4" />
          Add Skill Target
        </button>
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Skills Metrics Tracker */}
        <div className="lg:col-span-1 space-y-4">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2 px-1">Skills Targets</span>
          
          <div className="space-y-3.5">
            {skills.map((skill) => {
              const isSelected = selectedSkill?._id === skill._id;
              const gap = Math.max(0, skill.targetLevel - skill.level);
              const completionPercent = Math.min(100, Math.round((skill.level / skill.targetLevel) * 100));
              
              return (
                <div
                  key={skill._id}
                  onClick={() => {
                    setSelectedSkill(skill);
                    loadRoadmap(skill.name);
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-3 ${
                    isSelected 
                      ? 'bg-primary/5 border-primary shadow-md' 
                      : 'bg-card border-border/80 hover:bg-secondary/40'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold text-zinc-200 flex items-center gap-1.5 flex-wrap">
                        {skill.name}
                        <span className="text-[10px] text-indigo-400 font-extrabold">({completionPercent}% Complete)</span>
                      </h4>
                      <span className="text-[9px] text-zinc-500 font-bold uppercase">{skill.category}</span>
                    </div>
                    {gap > 0 ? (
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-indigo-600/10 border border-indigo-600/25 text-indigo-400 font-extrabold">
                        {gap}% Gap
                      </span>
                    ) : (
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-extrabold">
                        Target Met
                      </span>
                    )}
                  </div>

                  {/* Progress bar comparisons */}
                  <div className="space-y-1 text-[9px] font-bold pt-1">
                    <div className="flex justify-between text-zinc-400 mb-1.5">
                      <span>Proficiency: {skill.level}%</span>
                      <span>Target: {skill.targetLevel}%</span>
                    </div>
                    <div className="relative h-2 rounded-full bg-zinc-800/80 overflow-visible border border-zinc-900">
                      {/* Current level progress bar */}
                      <div className="absolute top-0 bottom-0 left-0 bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${skill.level}%` }} />
                      
                      {/* Target indicator ring (Gap indicator ring) */}
                      <div 
                        className={`absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 bg-zinc-950 flex items-center justify-center -translate-x-1/2 transition-all duration-300 shadow-md ${
                          skill.level >= skill.targetLevel 
                            ? 'border-emerald-500 shadow-emerald-500/10' 
                            : 'border-indigo-400 shadow-indigo-500/10'
                        }`}
                        style={{ left: `${skill.targetLevel}%` }}
                        title={`Target: ${skill.targetLevel}%`}
                      >
                        <div className={`w-1 h-1 rounded-full ${skill.level >= skill.targetLevel ? 'bg-emerald-400' : 'bg-indigo-400'}`} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Generated Learning Roadmap */}
        <div className="lg:col-span-2">
          <div className="glass-panel p-6 rounded-3xl border border-border/60 min-h-[400px] flex flex-col">
            <div className="pb-4 border-b border-border/60 flex justify-between items-center mb-6">
              <div>
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">AI Roadmap Planner</span>
                <h3 className="font-extrabold text-base leading-normal text-white mt-0.5">
                  Training Pathway: {selectedSkill ? selectedSkill.name : 'N/A'}
                </h3>
              </div>
              <Compass className="h-5 w-5 text-indigo-400" />
            </div>

            {loadingRoadmap ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Compiling Learning Pathway...</span>
              </div>
            ) : roadmap ? (
              <div className="space-y-6">
                
                {/* Meta details */}
                <div className="grid grid-cols-2 gap-4 bg-secondary/40 p-3.5 rounded-xl border border-border/60 text-xs">
                  <div>
                    <span className="text-zinc-500 block text-[9px] font-bold uppercase">Estimated Track Time</span>
                    <span className="font-semibold text-zinc-200 mt-1 block">{roadmap.estimatedHours} hours study</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[9px] font-bold uppercase">Pathway Difficulty</span>
                    <span className="font-semibold text-zinc-200 mt-1 block">{roadmap.difficulty}</span>
                  </div>
                </div>

                {/* Timeline Step pathway */}
                <div className="relative pl-8 space-y-6">
                  {/* Left Timeline Line */}
                  <div className="absolute left-3 top-3 bottom-3 w-0.5 bg-zinc-850 dark:bg-zinc-800" />

                  {roadmap.steps.map((step: any) => {
                    const status = getStepStatusStyles(step.status);
                    return (
                      <div key={step.id} className="relative">
                        {/* Dot indicator */}
                        <div className={`absolute -left-[30px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-zinc-900 flex items-center justify-center z-10 ${status.dot}`}>
                          {step.status === 'current' && (
                            <span className="absolute -inset-1 rounded-full border border-amber-500 animate-ping opacity-60" />
                          )}
                        </div>
                        
                        <div className={`p-5 rounded-2xl border transition-all duration-300 hover:shadow-lg ${status.color}`}>
                          <div className="flex justify-between items-start flex-wrap gap-2">
                            <div>
                              <div className="flex items-center gap-2.5 flex-wrap">
                                <h4 className="text-xs font-bold text-zinc-200">{step.title}</h4>
                                <span className={`text-[9px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-wider ${status.badge}`}>
                                  {status.badgeText}
                                </span>
                              </div>
                              <p className="text-[11px] text-muted-foreground leading-relaxed mt-2">{step.description}</p>
                            </div>
                            <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/5 border border-indigo-500/10 px-2.5 py-0.5 rounded-lg shrink-0">
                              {step.duration}
                            </span>
                          </div>
                          
                          {/* Resources tags */}
                          <div className="flex flex-wrap gap-2 mt-4 pt-3.5 border-t border-border/40">
                            {step.resources.map((res: string, idx: number) => (
                              <span key={idx} className="inline-flex items-center text-[9px] font-bold px-2.5 py-1 rounded bg-secondary/80 text-zinc-400 gap-1.5 border border-border/50 hover:bg-secondary transition-colors cursor-default">
                                <BookOpen className="h-3 w-3 text-indigo-400" />
                                {res}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center py-10 border border-dashed border-border/60 rounded-2xl">
                <span className="text-xs text-muted-foreground font-semibold">Select a skill target on the left to review its generated training pathway.</span>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ========================================== */}
      {/* ADD SKILL TARGET MODAL */}
      {/* ========================================== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl p-6 border border-border shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-4">Add Custom Skill Target</h3>
            <form onSubmit={handleAddSkill} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Skill Name</label>
                <input type="text" required placeholder="e.g. System Design, Docker, CI/CD" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-xs rounded-lg text-foreground focus:outline-none" />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-xs rounded-lg text-muted-foreground focus:outline-none">
                  <option value="Frontend">Frontend Development</option>
                  <option value="Backend">Backend / System Infrastructure</option>
                  <option value="DevOps">Cloud Ops & Infrastructure</option>
                  <option value="AI / ML">AI / Machine Learning</option>
                  <option value="Management">Product / Engineering Management</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Current level (1-100)</label>
                  <input type="number" min="0" max="100" required value={level} onChange={(e) => setLevel(Number(e.target.value))} className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-xs rounded-lg text-foreground focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Target level (1-100)</label>
                  <input type="number" min="0" max="100" required value={targetLevel} onChange={(e) => setTargetLevel(Number(e.target.value))} className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-xs rounded-lg text-foreground focus:outline-none" />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border border-border text-xs font-semibold rounded-lg text-muted-foreground hover:bg-secondary cursor-pointer">Cancel</button>
                <button type="submit" disabled={saving} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg flex items-center gap-1 cursor-pointer">
                  {saving && <Loader2 className="h-3 w-3 animate-spin" />}
                  Save Target
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
