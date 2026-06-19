'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { 
  Plus, Search, Filter, Briefcase, MapPin, 
  DollarSign, Loader2, Calendar, FileText, Trash2, Edit, Inbox
} from 'lucide-react';

type JobStatus = 'applied' | 'interviewing' | 'offered' | 'rejected';

export default function TrackerPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('All');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState<any | null>(null);
  const [showInterviewModal, setShowInterviewModal] = useState<any | null>(null);
  
  // Form fields
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [status, setStatus] = useState<JobStatus>('applied');
  const [salaryRange, setSalaryRange] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('Remote');
  const [notes, setNotes] = useState('');
  
  // Interview fields
  const [intStage, setIntStage] = useState('');
  const [intDate, setIntDate] = useState('');
  const [intNotes, setIntNotes] = useState('');

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const res = await api.jobs.getJobs();
      if (res.success) setJobs(res.data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('jobId', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: JobStatus) => {
    const id = e.dataTransfer.getData('jobId');
    if (!id) return;

    // Optimistic UI update
    setJobs(prev => prev.map(j => j._id === id ? { ...j, status: targetStatus } : j));

    try {
      await api.jobs.updateJob(id, { status: targetStatus });
    } catch (err) {
      // Revert if error
      loadJobs();
    }
  };

  // API submissions
  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !position) return;
    setSaving(true);
    try {
      const res = await api.jobs.createJob({
        company, position, status, salaryRange, location, jobType, notes
      });
      if (res.success) {
        setJobs(prev => [res.data, ...prev]);
        setShowAddModal(false);
        resetForm();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!intStage || !intDate || !showInterviewModal) return;
    setSaving(true);
    const id = showInterviewModal._id;
    try {
      const res = await api.jobs.addInterview(id, {
        stage: intStage,
        date: intDate,
        notes: intNotes
      });
      if (res.success) {
        setJobs(prev => prev.map(j => j._id === id ? res.data : j));
        setShowInterviewModal(null);
        setIntStage('');
        setIntDate('');
        setIntNotes('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job application?')) return;
    try {
      await api.jobs.deleteJob(id);
      setJobs(prev => prev.filter(j => j._id !== id));
      setShowDetailsModal(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: JobStatus) => {
    try {
      setJobs(prev => prev.map(j => j._id === id ? { ...j, status: newStatus } : j));
      if (showDetailsModal) setShowDetailsModal((prev: any) => ({ ...prev, status: newStatus }));
      await api.jobs.updateJob(id, { status: newStatus });
    } catch (err) {
      loadJobs();
    }
  };

  const resetForm = () => {
    setCompany('');
    setPosition('');
    setStatus('applied');
    setSalaryRange('');
    setLocation('');
    setJobType('Remote');
    setNotes('');
  };

  // Filtering
  const filteredJobs = jobs.filter(j => {
    const matchSearch = j.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        j.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = jobTypeFilter === 'All' || j.jobType === jobTypeFilter;
    return matchSearch && matchType;
  });

  const columns: { title: string; status: JobStatus; colorClass: string; bgClass: string }[] = [
    { title: 'Applied', status: 'applied', colorClass: 'text-indigo-400 border-indigo-500/25', bgClass: 'bg-indigo-500/5' },
    { title: 'Interviewing', status: 'interviewing', colorClass: 'text-amber-400 border-amber-500/25', bgClass: 'bg-amber-500/5' },
    { title: 'Offered', status: 'offered', colorClass: 'text-emerald-400 border-emerald-500/25', bgClass: 'bg-emerald-500/5' },
    { title: 'Rejected', status: 'rejected', colorClass: 'text-rose-400 border-rose-500/25', bgClass: 'bg-rose-500/5' }
  ];

  if (loading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Utilities */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Application Tracker</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Drag-and-drop or select cards to manage application status phases</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/15"
        >
          <Plus className="h-4 w-4" />
          Add Job Application
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-card border border-border p-3 rounded-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by company or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-secondary/60 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 text-foreground"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={jobTypeFilter}
            onChange={(e) => setJobTypeFilter(e.target.value)}
            className="px-3.5 py-2 bg-secondary/60 border border-border/80 text-xs rounded-xl text-muted-foreground focus:outline-none"
          >
            <option value="All">All Types</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Onsite">Onsite</option>
          </select>
        </div>
      </div>

      {/* Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {columns.map(col => {
          const colJobs = filteredJobs.filter(j => j.status === col.status);
          return (
            <div
              key={col.status}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.status)}
              className={`rounded-2xl border border-border/80 flex flex-col p-4 min-h-[300px] lg:min-h-[500px] transition-colors ${col.bgClass}`}
            >
              {/* Column Header */}
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-border/60">
                <span className={`text-xs font-extrabold uppercase tracking-wider ${col.colorClass}`}>{col.title}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-855 bg-zinc-800 text-zinc-400 font-bold">{colJobs.length}</span>
              </div>

              {/* Cards list */}
              <div className="flex-1 space-y-3 overflow-y-auto no-scrollbar flex flex-col">
                {colJobs.map(job => {
                  const borderLClass = 
                    job.status === 'applied' ? 'border-l-4 border-l-indigo-500' :
                    job.status === 'interviewing' ? 'border-l-4 border-l-amber-500' :
                    job.status === 'offered' ? 'border-l-4 border-l-emerald-500' :
                    'border-l-4 border-l-rose-500';

                  return (
                    <div
                      key={job._id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, job._id)}
                      onClick={() => setShowDetailsModal(job)}
                      className={`p-4 rounded-xl bg-card border border-border/80 ${borderLClass} cursor-grab active:cursor-grabbing hover:border-indigo-500/40 hover:shadow-lg transition-all text-left relative group`}
                    >
                      <h4 className="text-xs font-extrabold truncate">{job.position}</h4>
                      <span className="text-[10px] text-muted-foreground font-semibold mt-0.5 block">{job.company}</span>
                      
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        <span className="inline-flex items-center text-[9px] font-bold px-1.5 py-0.5 rounded bg-secondary/80 text-muted-foreground gap-1">
                          <MapPin className="h-2.5 w-2.5" />
                          {job.location || 'N/A'}
                        </span>
                        <span className="inline-flex items-center text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/5 text-indigo-400">
                          {job.jobType}
                        </span>
                      </div>

                      {job.interviews?.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between text-[9px] text-amber-400 font-bold">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-2.5 w-2.5" />
                            {job.interviews.length} Loop scheduled
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}

                {colJobs.length === 0 && (
                  <div className="flex-1 flex flex-col items-center justify-center min-h-[150px] rounded-xl border border-dashed border-zinc-800 bg-zinc-900/10 p-4 text-center select-none transition-colors duration-200">
                    <Inbox className="h-6 w-6 text-zinc-600 mb-2 stroke-[1.5]" />
                    <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">No applications</span>
                    <span className="text-[9px] text-zinc-650 text-zinc-600 mt-1 max-w-[120px] leading-relaxed">Drag cards here to update status</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================== */}
      {/* MODALS SECTION */}
      {/* ========================================== */}

      {/* 1. Add Job Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="glass-panel w-full max-w-lg rounded-2xl p-6 border border-border shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-5">Add Tracked Application</h3>
            <form onSubmit={handleCreateJob} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Company</label>
                  <input type="text" required value={company} onChange={(e) => setCompany(e.target.value)} className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-xs rounded-lg text-foreground focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Position / Role</label>
                  <input type="text" required value={position} onChange={(e) => setPosition(e.target.value)} className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-xs rounded-lg text-foreground focus:outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value as JobStatus)} className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-xs rounded-lg text-muted-foreground focus:outline-none">
                    <option value="applied">Applied</option>
                    <option value="interviewing">Interviewing</option>
                    <option value="offered">Offered</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Job Type</label>
                  <select value={jobType} onChange={(e) => setJobType(e.target.value)} className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-xs rounded-lg text-muted-foreground focus:outline-none">
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Onsite">Onsite</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Location</label>
                  <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. San Francisco, CA" className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-xs rounded-lg text-foreground focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Salary Range</label>
                  <input type="text" value={salaryRange} onChange={(e) => setSalaryRange(e.target.value)} placeholder="e.g. $140k - $160k" className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-xs rounded-lg text-foreground focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Notes / Description</label>
                <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-xs rounded-lg text-foreground focus:outline-none resize-none" />
              </div>
              <div className="flex justify-end gap-2.5 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border border-border text-xs font-semibold rounded-lg text-muted-foreground hover:bg-secondary cursor-pointer">Cancel</button>
                <button type="submit" disabled={saving} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg flex items-center gap-1 cursor-pointer">
                  {saving && <Loader2 className="h-3 w-3 animate-spin" />}
                  Save Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Job Detail Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="glass-panel w-full max-w-lg rounded-2xl p-6 border border-border shadow-2xl relative max-h-[90vh] overflow-y-auto text-left">
            <button onClick={() => setShowDetailsModal(null)} className="absolute right-4 top-4 text-zinc-500 hover:text-zinc-300 font-bold">&times;</button>
            
            <h3 className="text-lg font-bold text-white leading-normal">{showDetailsModal.position}</h3>
            <span className="text-xs text-indigo-400 font-bold block mt-0.5">{showDetailsModal.company}</span>

            {/* Status updates shortcuts for mobile touch screens */}
            <div className="mt-4 pt-3 border-t border-border/60">
              <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-2">Stage Status (Mobile Shortcut)</label>
              <div className="grid grid-cols-4 gap-2">
                {columns.map(col => {
                  const isActive = showDetailsModal.status === col.status;
                  const activeClasses = 
                    col.status === 'applied' ? 'bg-indigo-500/10 border-indigo-500/60 text-indigo-400 shadow-sm shadow-indigo-500/5' :
                    col.status === 'interviewing' ? 'bg-amber-500/10 border-amber-500/60 text-amber-400 shadow-sm shadow-amber-500/5' :
                    col.status === 'offered' ? 'bg-emerald-500/10 border-emerald-500/60 text-emerald-400 shadow-sm shadow-emerald-500/5' :
                    'bg-rose-500/10 border-rose-500/60 text-rose-400 shadow-sm shadow-rose-500/5';
                  
                  return (
                    <button
                      key={col.status}
                      onClick={() => handleStatusUpdate(showDetailsModal._id, col.status)}
                      className={`py-1.5 rounded-lg border text-[10px] font-bold text-center transition-all cursor-pointer ${
                        isActive 
                          ? activeClasses 
                          : 'border-border bg-secondary hover:bg-secondary/80 text-muted-foreground'
                      }`}
                    >
                      {col.title}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-4 bg-secondary/40 p-3.5 rounded-xl border border-border/50">
                <div>
                  <span className="text-zinc-500 block text-[10px] font-bold uppercase">Location</span>
                  <span className="font-semibold text-zinc-200 mt-1 block">{showDetailsModal.location || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px] font-bold uppercase">Job Type</span>
                  <span className="font-semibold text-zinc-200 mt-1 block">{showDetailsModal.jobType}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px] font-bold uppercase">Salary Range</span>
                  <span className="font-semibold text-zinc-200 mt-1 block">{showDetailsModal.salaryRange || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px] font-bold uppercase">Date Added</span>
                  <span className="font-semibold text-zinc-200 mt-1 block">{new Date(showDetailsModal.dateApplied || showDetailsModal.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div>
                <span className="text-zinc-500 block text-[10px] font-bold uppercase mb-1.5">Notes & Reminders</span>
                <p className="p-3 bg-secondary/40 border border-border/50 rounded-xl text-zinc-300 leading-normal">{showDetailsModal.notes || 'No description updates recorded.'}</p>
              </div>

              {/* Interviews timeline listing */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-zinc-500 text-[10px] font-bold uppercase">Interview Schedule</span>
                  <button
                    onClick={() => {
                      setShowInterviewModal(showDetailsModal);
                      setShowDetailsModal(null);
                    }}
                    className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold cursor-pointer"
                  >
                    + Add Stage Schedule
                  </button>
                </div>
                <div className="space-y-2.5">
                  {showDetailsModal.interviews?.length === 0 ? (
                    <div className="text-center py-4 border border-dashed border-border/50 rounded-xl text-[10px] text-muted-foreground font-semibold">No interviews scheduled yet</div>
                  ) : (
                    showDetailsModal.interviews?.map((int: any) => (
                      <div key={int._id} className="p-3 rounded-xl bg-secondary/50 border border-border/50 flex flex-col gap-1">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-xs">{int.stage}</span>
                          <span className="text-[10px] text-zinc-500 font-semibold">{new Date(int.date).toLocaleDateString()}</span>
                        </div>
                        {int.notes && <p className="text-[10px] text-muted-foreground leading-normal mt-0.5">{int.notes}</p>}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-8 pt-4 border-t border-border">
              <button
                onClick={() => handleDeleteJob(showDetailsModal._id)}
                className="px-3.5 py-2 hover:bg-red-500/10 text-red-500 border border-transparent hover:border-red-500/20 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
                Remove Card
              </button>
              <button onClick={() => setShowDetailsModal(null)} className="px-4 py-2 border border-border text-xs font-semibold rounded-lg text-muted-foreground hover:bg-secondary cursor-pointer">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Add Interview Modal */}
      {showInterviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl p-6 border border-border shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-4">Schedule Interview Loop</h3>
            <span className="text-xs text-indigo-400 font-bold block mb-4">For {showInterviewModal.position} at {showInterviewModal.company}</span>
            <form onSubmit={handleAddInterview} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Interview Stage</label>
                <input type="text" required placeholder="e.g. Technical Screen, System Design Panel" value={intStage} onChange={(e) => setIntStage(e.target.value)} className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-xs rounded-lg text-foreground focus:outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Date & Time</label>
                <input type="datetime-local" required value={intDate} onChange={(e) => setIntDate(e.target.value)} className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-xs rounded-lg text-muted-foreground focus:outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Interview Prep Notes</label>
                <textarea rows={3} placeholder="Topics to cover, interviewer names, panel descriptions..." value={intNotes} onChange={(e) => setIntNotes(e.target.value)} className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-xs rounded-lg text-foreground focus:outline-none resize-none" />
              </div>
              <div className="flex justify-end gap-2.5 pt-2">
                <button type="button" onClick={() => {
                  setShowDetailsModal(showInterviewModal);
                  setShowInterviewModal(null);
                }} className="px-4 py-2 border border-border text-xs font-semibold rounded-lg text-muted-foreground hover:bg-secondary cursor-pointer">Back</button>
                <button type="submit" disabled={saving} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg flex items-center gap-1 cursor-pointer">
                  {saving && <Loader2 className="h-3 w-3 animate-spin" />}
                  Schedule Stage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
