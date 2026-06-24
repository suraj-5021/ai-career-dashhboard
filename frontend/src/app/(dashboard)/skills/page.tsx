'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { 
  Award, Sparkles, BookOpen, Compass, 
  CheckCircle2, Plus, ArrowRight, Loader2, Calendar, Check, Circle
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

  // Custom roadmap inputs
  const [currentYear, setCurrentYear] = useState('Junior');
  const [userSkills, setUserSkills] = useState('React, JavaScript, HTML, CSS');
  const [targetCareer, setTargetCareer] = useState('Full Stack Developer');
  const [customRoadmap, setCustomRoadmap] = useState<any | null>(null);
  const [generatingCustom, setGeneratingCustom] = useState(false);

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
        setCustomRoadmap(null); // Clear custom roadmap when skill is selected
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

  // Generate Custom Month-wise roadmap
  const handleGenerateRoadmap = (e: React.FormEvent) => {
    e.preventDefault();
    setGeneratingCustom(true);
    setSelectedSkill(null); // Deselect individual skill roadmap
    setRoadmap(null);

    setTimeout(() => {
      const careerKey = targetCareer.toLowerCase();
      let steps = [];
      let difficulty = 'Custom Target Pathway';
      let estimatedHours = 60;

      if (careerKey.includes('mern') || careerKey.includes('full stack') || careerKey.includes('fullstack')) {
        difficulty = 'MERN Stack Developer Track';
        estimatedHours = 75;
        steps = [
          {
            id: 1,
            title: 'Month 1: Modern React 19 & Next.js App Router',
            description: `Transitioning from standard React to server components, server actions, and layout-driven routing structures using ${userSkills || 'React, Next.js'}.`,
            duration: 'Week 1-4',
            resources: ['Next.js React 19 upgrade documentation', 'React Compiler Architecture guides'],
            status: 'completed'
          },
          {
            id: 2,
            title: 'Month 2: Node.js & Express API Architectures',
            description: 'Building scalable RESTful backend services, implementing JWT authorization, request validations, and CORS security configurations.',
            duration: 'Week 5-8',
            resources: ['REST API Design Best Practices', 'Node.js Express authorization guides'],
            status: 'current'
          },
          {
            id: 3,
            title: 'Month 3: MongoDB Schema Design & Performance',
            description: 'Design robust schemas, aggregation pipelines, database tuning, query plan analysis, and secondary index optimizations.',
            duration: 'Week 9-12',
            resources: ['MongoDB University - Schema Design course', 'Mongoose Indexes documentation'],
            status: 'pending'
          },
          {
            id: 4,
            title: 'Month 4: Full-Stack Deployment & CI/CD Pipelines',
            description: 'Docker containerization, GitHub Actions pipelines, and hosting on cloud platforms like AWS ECS or Vercel serverless.',
            duration: 'Week 13-16',
            resources: ['Docker Multi-stage building guides', 'AWS ECS / Vercel deployment manuals'],
            status: 'pending'
          }
        ];
      } else if (careerKey.includes('frontend') || careerKey.includes('front-end')) {
        difficulty = 'Professional Frontend Track';
        estimatedHours = 50;
        steps = [
          {
            id: 1,
            title: 'Month 1: Advanced TypeScript & Semantic HTML5/CSS3',
            description: `Structural typing, generic programming, and highly accessible semantic markup layouts leveraging ${userSkills || 'TypeScript, HTML, CSS'}.`,
            duration: 'Week 1-4',
            resources: ['TypeScript Deep Dive manual', 'W3C Accessibility checklist'],
            status: 'completed'
          },
          {
            id: 2,
            title: 'Month 2: Component State & Custom Render Loops',
            description: 'Zustand global stores, context API patterns, performance hooks memoization (useMemo/useCallback) and custom hook wrappers.',
            duration: 'Week 5-8',
            resources: ['Zustand state API guidelines', 'React render tuning manuals'],
            status: 'current'
          },
          {
            id: 3,
            title: 'Month 3: Responsive Layouts & Tailwind CSS Customization',
            description: 'Dynamic theme configurations, utility grid layouts, component styling libraries (Shadcn/Radix UI), and cross-browser styling.',
            duration: 'Week 9-12',
            resources: ['Tailwind CSS documentation', 'Shadcn UI Customization blueprints'],
            status: 'pending'
          },
          {
            id: 4,
            title: 'Month 4: Web Performance & Lighthouse Audit Loops',
            description: 'Core Web Vitals (LCP, FID, CLS) optimization, asset compression, image lazy-loading, code splitting, and bundle analyzer scripts.',
            duration: 'Week 13-16',
            resources: ['Google Lighthouse optimization manuals', 'Webpack & Vite Bundle tuning guides'],
            status: 'pending'
          }
        ];
      } else if (careerKey.includes('backend') || careerKey.includes('back-end')) {
        difficulty = 'Advanced Backend Track';
        estimatedHours = 70;
        steps = [
          {
            id: 1,
            title: 'Month 1: Node.js Core and Express Frameworks',
            description: `Event loop delegation, concurrency models, error-handling middleware patterns, and server configurations using ${userSkills || 'Node.js, Express'}.`,
            duration: 'Week 1-4',
            resources: ['Node.js Event Loop documentation', 'Express Middleware templates'],
            status: 'completed'
          },
          {
            id: 2,
            title: 'Month 2: SQL and NoSQL Database Design',
            description: 'PostgreSQL index tuning, database schema normalization, transactions, query plan analysis, and secondary index optimizations.',
            duration: 'Week 5-8',
            resources: ['Designing Data-Intensive Applications', 'Postgres Query Execution Plans tutorial'],
            status: 'current'
          },
          {
            id: 3,
            title: 'Month 3: Caching Layers & Message Brokers',
            description: 'Redis cache-aside configurations, pub/sub communication models, RabbitMQ or Kafka event queue decoupling.',
            duration: 'Week 9-12',
            resources: ['Redis Caching patterns manual', 'Apache Kafka - Getting Started guide'],
            status: 'pending'
          },
          {
            id: 4,
            title: 'Month 4: Scalable System Design & Resilience',
            description: 'Load balancing, reverse proxies, horizontal scaling, system sharding, replication failover routines, and SRE monitoring.',
            duration: 'Week 13-16',
            resources: ['System Design Primer', 'AWS Multi-AZ replication manuals'],
            status: 'pending'
          }
        ];
      } else if (careerKey.includes('devops') || careerKey.includes('infra') || careerKey.includes('cloud')) {
        difficulty = 'Advanced DevOps Track';
        estimatedHours = 80;
        steps = [
          {
            id: 1,
            title: 'Month 1: Linux Admin & Docker Containerization',
            description: `Bash scripting automation, network namespaces, volume bindings, and multi-stage Dockerfile caches using ${userSkills || 'Docker, Linux'}.`,
            duration: 'Week 1-4',
            resources: ['Linux Command Line handbook', 'Docker Official Best Practices'],
            status: 'completed'
          },
          {
            id: 2,
            title: 'Month 2: Kubernetes Orchestration & Cluster Management',
            description: 'Minikube configs, pod ingress controllers, persistent volumes, configMaps, secrets, and horizontal pod autoscaling (HPA).',
            duration: 'Week 5-8',
            resources: ['Kubernetes Docs - Getting Started', 'K8s Cluster networking blueprints'],
            status: 'current'
          },
          {
            id: 3,
            title: 'Month 3: Continuous Delivery (CI/CD) Pipelines',
            description: 'GitHub Actions workflow yaml files, automated test runners, ECR pushes, and AWS rolling updates integration.',
            duration: 'Week 9-12',
            resources: ['GitHub Actions official guides', 'AWS ECR/ECS deployment workflows'],
            status: 'pending'
          },
          {
            id: 4,
            title: 'Month 4: Infrastructure as Code & Cloud deployment',
            description: 'Terraform modules, provisioning AWS resources (ALB, ECS, S3, RDS), Prometheus and Grafana alerting limits.',
            duration: 'Week 13-16',
            resources: ['Terraform Up & Running', 'Prometheus monitoring Golden Signals guidelines'],
            status: 'pending'
          }
        ];
      } else if (careerKey.includes('data') || careerKey.includes('analyst') || careerKey.includes('power bi')) {
        difficulty = 'Data Analytics Track';
        estimatedHours = 55;
        steps = [
          {
            id: 1,
            title: 'Month 1: Advanced SQL queries & Database Schema Normalization',
            description: `Window functions, recursive CTEs, subqueries optimization, and database schema normalizations using ${userSkills || 'SQL, Databases'}.`,
            duration: 'Week 1-4',
            resources: ['SQL for Data Analysis manual', 'Database Schema structures guides'],
            status: 'completed'
          },
          {
            id: 2,
            title: 'Month 2: Python Data Science Ecosystem',
            description: 'Pandas DataFrames, NumPy aggregations, Matplotlib visualization sheets, missing data imputations, and pandas cleansing scripts.',
            duration: 'Week 5-8',
            resources: ['Python Data Science Handbook', 'Pandas Data cleaning best practices'],
            status: 'current'
          },
          {
            id: 3,
            title: 'Month 3: Business Intelligence & Power BI',
            description: 'DAX calculated columns, measures, star schema modeling, interactive visual setups, and dashboard filter metrics.',
            duration: 'Week 9-12',
            resources: ['Power BI DAX expressions manuals', 'Star Schema modeling tutorials'],
            status: 'pending'
          },
          {
            id: 4,
            title: 'Month 4: Spreadsheet Automation & Statistics',
            description: 'Excel macro builders, probability distributions, A/B testing hypothesis checks, and statistical model summaries.',
            duration: 'Week 13-16',
            resources: ['Advanced Excel Macros guides', 'Practical Statistics for Data Scientists'],
            status: 'pending'
          }
        ];
      } else if (careerKey.includes('security') || careerKey.includes('cyber') || careerKey.includes('owasp')) {
        difficulty = 'Cyber Security Architect Track';
        estimatedHours = 75;
        steps = [
          {
            id: 1,
            title: 'Month 1: OWASP Web Vulnerabilities & Mitigation',
            description: `SQL injection, Cross-Site Scripting (XSS) mitigations, CSP policies, and CSRF token configurations using ${userSkills || 'OWASP, Web App Security'}.`,
            duration: 'Week 1-4',
            resources: ['OWASP Top 10 guidelines', 'Web Security Academy tutorials'],
            status: 'completed'
          },
          {
            id: 2,
            title: 'Month 2: Cryptographic Algorithms & TLS Protocols',
            description: 'Symmetric/asymmetric encryption methods (AES, RSA), TLS handshake flow, and mobile certificate pinning validations.',
            duration: 'Week 5-8',
            resources: ['Practical Cryptography developers handbook', 'TLS Handshake step-by-step guides'],
            status: 'current'
          },
          {
            id: 3,
            title: 'Month 3: Authentication Systems & OAuth 2.0 Flow',
            description: 'Stateless JWT auth, OAuth 2.0 token grant flows, MFA TOTP configurations, and SameSite cookie headers.',
            duration: 'Week 9-12',
            resources: ['OAuth 2.0 Simplified', 'JWT authentication security configurations manual'],
            status: 'pending'
          },
          {
            id: 4,
            title: 'Month 4: Vulnerability Audits & Pipeline Testing',
            description: 'Automated SAST/DAST security scanner integration, penetration audit checklists, and security firewall rules.',
            duration: 'Week 13-16',
            resources: ['SonarQube SAST setup guides', 'OWASP ZAP dynamic scanner manual'],
            status: 'pending'
          }
        ];
      } else {
        // Default Full Stack / MERN
        difficulty = 'Full Stack Developer Track';
        estimatedHours = 65;
        steps = [
          {
            id: 1,
            title: 'Month 1: Advanced Frontend & Form Actions',
            description: `Transitioning from standard React to React 19 / Next.js Server Actions. Learn Form State hooks, compiler bundles, and client-server rendering optimization patterns using ${userSkills || 'React, JavaScript, HTML, CSS'}.`,
            duration: 'Week 1-4',
            resources: ['Next.js React 19 upgrade documentation', 'React Compiler Architecture video series'],
            status: 'completed'
          },
          {
            id: 2,
            title: 'Month 2: Backend Architecture & Database Optimization',
            description: 'Design robust RESTful and GraphQL APIs. Configure Node.js backend controllers, implement query indexing in MongoDB, and add Redis caching clusters.',
            duration: 'Week 5-8',
            resources: ['System Design primer - API Performance', 'Redis Caching strategies in Node.js'],
            status: 'current'
          },
          {
            id: 3,
            title: 'Month 3: Containerization & DevOps Basics',
            description: 'Write Multi-stage Dockerfiles. Understand network bridging, image size reduction, and configure basic GitHub Actions workflows for building and testing containers.',
            duration: 'Week 9-12',
            resources: ['Docker official documentation - Best Practices', 'GitHub Actions workflow integration blueprints'],
            status: 'pending'
          },
          {
            id: 4,
            title: 'Month 4: Cloud Infrastructure & Capstone Deployment',
            description: 'Deploy the containerized stack on AWS ECS or Vercel. Set up basic monitoring dashboards, alerts for server resource utilization, and scale the application.',
            duration: 'Week 13-16',
            resources: ['AWS ECS / Vercel Serverless scaling manuals', 'SRE Alerting guides'],
            status: 'pending'
          }
        ];
      }

      const simulatedCustom = {
        career: targetCareer,
        year: currentYear,
        skills: userSkills,
        difficulty,
        estimatedHours,
        steps
      };
      setCustomRoadmap(simulatedCustom);
      setGeneratingCustom(false);
    }, 1000);
  };

  const toggleStepStatus = (stepId: number) => {
    if (customRoadmap) {
      const updatedSteps = customRoadmap.steps.map((step: any) => {
        if (step.id === stepId) {
          const nextStatus = step.status === 'completed' ? 'pending' : step.status === 'current' ? 'completed' : 'current';
          return { ...step, status: nextStatus };
        }
        return step;
      });
      setCustomRoadmap({ ...customRoadmap, steps: updatedSteps });
    } else if (roadmap) {
      const updatedSteps = roadmap.steps.map((step: any) => {
        if (step.id === stepId) {
          const nextStatus = step.status === 'completed' ? 'pending' : step.status === 'current' ? 'completed' : 'current';
          return { ...step, status: nextStatus };
        }
        return step;
      });
      setRoadmap({ ...roadmap, steps: updatedSteps });
    }
  };

  const getStepStatusStyles = (status: string) => {
    switch (status) {
      case 'completed': return { 
        color: 'border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/30 transition-all', 
        dot: 'bg-emerald-400 border-emerald-450',
        badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        badgeText: 'Completed'
      };
      case 'current': return { 
        color: 'border-amber-500/20 bg-amber-500/5 hover:border-amber-500/30 transition-all', 
        dot: 'bg-amber-400 border-amber-450',
        badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        badgeText: 'In Progress'
      };
      default: return { 
        color: 'border-zinc-800 bg-secondary/20 hover:border-zinc-700 transition-all', 
        dot: 'bg-zinc-700 border-zinc-650',
        badge: 'bg-zinc-800/50 text-zinc-500 border-zinc-800/80',
        badgeText: 'Up Next'
      };
    }
  };

  // Progress metrics calculation for the active roadmap
  const activeRoadmap = customRoadmap || roadmap;
  const totalSteps = activeRoadmap?.steps?.length || 0;
  const completedSteps = activeRoadmap?.steps?.filter((s: any) => s.status === 'completed').length || 0;
  const progressPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

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
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Skills & Career Roadmap</h1>
          <p className="text-xs text-muted-foreground mt-0.5 font-medium">Analyze technology proficiency targets and generate interactive training roadmaps</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto px-4 py-3 rounded-xl bg-indigo-650 hover:bg-indigo-600 text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/15 min-h-[44px]"
        >
          <Plus className="h-4 w-4" />
          Add Skill Target
        </button>
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Skills Metrics Tracker & Roadmap Inputs */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Custom Roadmap Generator Card */}
          <div className="glass-panel p-5 rounded-3xl border border-border/50 bg-zinc-950/10 space-y-4">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block px-1">AI Roadmap Builder</span>
            
            <form onSubmit={handleGenerateRoadmap} className="space-y-4">
              <div>
                <label className="block text-[9px] font-extrabold text-zinc-400 uppercase mb-1">Current Year / Grade</label>
                <select 
                  value={currentYear} 
                  onChange={(e) => setCurrentYear(e.target.value)} 
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-xs rounded-xl text-zinc-350 focus:outline-none min-h-[44px]"
                >
                  <option value="Freshman">Freshman / 1st Year</option>
                  <option value="Sophomore">Sophomore / 2nd Year</option>
                  <option value="Junior">Junior / 3rd Year</option>
                  <option value="Senior">Senior / 4th Year</option>
                  <option value="Self-Taught">Self-Taught / Professional</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-extrabold text-zinc-400 uppercase mb-1">Current Skills</label>
                <input 
                  type="text" 
                  value={userSkills} 
                  onChange={(e) => setUserSkills(e.target.value)} 
                  placeholder="e.g. React, JavaScript, HTML" 
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 text-xs rounded-xl text-foreground focus:outline-none min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-[9px] font-extrabold text-zinc-400 uppercase mb-1">Target Career Role</label>
                <input 
                  type="text" 
                  value={targetCareer} 
                  onChange={(e) => setTargetCareer(e.target.value)} 
                  placeholder="e.g. Full Stack Developer" 
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 text-xs rounded-xl text-foreground focus:outline-none min-h-[44px]"
                />
              </div>

              <button
                type="submit"
                disabled={generatingCustom}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-indigo-600/10 cursor-pointer min-h-[44px]"
              >
                {generatingCustom ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating timeline...
                  </>
                ) : (
                  <>
                    <Compass className="h-4 w-4" />
                    Generate Custom Roadmap
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Skill Targets Panel */}
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block px-1">Skills Targets Tracker</span>
            
            <div className="space-y-3.5 max-h-[350px] overflow-y-auto no-scrollbar pr-1">
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
                        <div className="absolute top-0 bottom-0 left-0 bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${skill.level}%` }} />
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
        </div>

        {/* Right Side: Generated Learning Roadmap */}
        <div className="lg:col-span-2">
          <div className="glass-panel p-6 rounded-3xl border border-border/60 min-h-[500px] flex flex-col">
            
            {activeRoadmap ? (
              <div className="space-y-6 flex-1 flex flex-col">
                
                {/* Header details */}
                <div className="pb-4 border-b border-border/60 flex justify-between items-center shrink-0">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">AI Interactive Roadmap</span>
                    <h3 className="font-extrabold text-base leading-normal text-white mt-0.5">
                      {customRoadmap ? `Career: ${customRoadmap.career} (${customRoadmap.year} Track)` : `Training Pathway: ${roadmap.skill}`}
                    </h3>
                  </div>
                  <Compass className="h-5 w-5 text-indigo-400" />
                </div>

                {/* Progress Tracker Widget */}
                <div className="bg-secondary/40 p-4 rounded-2xl border border-border/60 text-xs shrink-0 space-y-2">
                  <div className="flex justify-between items-center font-bold text-zinc-300 text-[10px] uppercase">
                    <span>Roadmap Progress</span>
                    <span className="text-indigo-400 font-sans">{progressPercent}% Completed</span>
                  </div>
                  <div className="overflow-hidden h-2 text-xs flex rounded-full bg-zinc-800 border border-zinc-900">
                    <div style={{ width: `${progressPercent}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500 transition-all duration-500"></div>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-zinc-500 font-medium">
                    <span>{completedSteps} of {totalSteps} milestones achieved</span>
                    <span>Est. Study: {activeRoadmap.estimatedHours} hours</span>
                  </div>
                </div>

                {/* Timeline Step pathway */}
                <div className="relative pl-8 space-y-6 flex-1 pt-2">
                  {/* Left Timeline Line */}
                  <div className="absolute left-3.5 top-3 bottom-3 w-0.5 bg-zinc-850 dark:bg-zinc-800" />

                  {activeRoadmap.steps.map((step: any) => {
                    const status = getStepStatusStyles(step.status);
                    return (
                      <div key={step.id} className="relative animate-fade-in">
                        {/* Bullet Circle Toggle button (Min 44px touch friendly hover zone) */}
                        <div className="absolute -left-[38px] top-1.5 z-10 flex items-center justify-center h-7 w-7">
                          <button
                            onClick={() => toggleStepStatus(step.id)}
                            className={`h-5 w-5 rounded-full border-2 bg-zinc-950 flex items-center justify-center transition-all cursor-pointer ${
                              step.status === 'completed'
                                ? 'border-emerald-500 text-emerald-450'
                                : step.status === 'current'
                                ? 'border-amber-500 text-amber-450'
                                : 'border-zinc-700 text-zinc-500'
                            } hover:scale-115`}
                            aria-label={`Mark milestone ${step.id} as complete`}
                          >
                            {step.status === 'completed' ? (
                              <Check className="h-3 w-3 stroke-[3]" />
                            ) : step.status === 'current' ? (
                              <Circle className="h-2 w-2 fill-amber-400 stroke-none" />
                            ) : null}
                          </button>
                        </div>
                        
                        {/* Milestone Card */}
                        <div className={`p-5 rounded-2xl border transition-all duration-300 hover:shadow-lg ${status.color}`}>
                          <div className="flex justify-between items-start flex-wrap gap-2">
                            <div className="space-y-1">
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
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed border-border/60 rounded-2xl">
                <Compass className="h-10 w-10 text-zinc-600 mb-3" />
                <span className="text-xs text-muted-foreground font-semibold mb-2">No active roadmap path selected.</span>
                <span className="text-[10px] text-zinc-500 max-w-xs font-medium">Select a skill target on the left or enter details in the AI Roadmap Builder to compile your interactive timeline.</span>
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
          <div className="glass-panel w-full max-w-md rounded-2xl p-6 border border-border shadow-2xl relative animate-fade-in">
            <h3 className="text-lg font-bold text-white mb-4">Add Custom Skill Target</h3>
            <form onSubmit={handleAddSkill} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Skill Name</label>
                <input type="text" required placeholder="e.g. System Design, Docker, CI/CD" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 text-xs rounded-xl text-foreground focus:outline-none min-h-[44px]" />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-xs rounded-xl text-muted-foreground focus:outline-none min-h-[44px]">
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
                  <input type="number" min="0" max="100" required value={level} onChange={(e) => setLevel(Number(e.target.value))} className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 text-xs rounded-xl text-foreground focus:outline-none min-h-[44px]" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Target level (1-100)</label>
                  <input type="number" min="0" max="100" required value={targetLevel} onChange={(e) => setTargetLevel(Number(e.target.value))} className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 text-xs rounded-xl text-foreground focus:outline-none min-h-[44px]" />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2.5 border border-border text-xs font-semibold rounded-xl text-muted-foreground hover:bg-secondary cursor-pointer min-h-[44px]">Cancel</button>
                <button type="submit" disabled={saving} className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl flex items-center gap-1 cursor-pointer min-h-[44px]">
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
