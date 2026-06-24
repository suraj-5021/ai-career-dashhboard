const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper to check if we should run in mock-only mode
let isBackendOffline = false;

// Client-side state simulator for standalone offline mode
let clientUsers: any[] = [
  {
    id: 'user_1',
    name: 'Suraj Kumar',
    email: 'user@career.os',
    role: 'user',
    profileCompletion: 78,
    skills: ['React', 'Next.js', 'TypeScript', 'Node.js', 'MongoDB'],
    bio: 'Full Stack Developer passionate about scalable architectures and AI integrations.',
    currentTitle: 'Frontend Engineer',
    targetTitle: 'Senior Full Stack Engineer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
    createdAt: new Date()
  },
  {
    id: 'admin_1',
    name: 'Startup Admin',
    email: 'admin@career.os',
    role: 'admin',
    profileCompletion: 100,
    skills: ['System Design', 'Scaling'],
    bio: 'Platform admin.',
    currentTitle: 'Platform Administrator',
    targetTitle: 'Director',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&h=256&q=80',
    createdAt: new Date()
  }
];

let clientJobs: any[] = [
  {
    _id: 'job_1',
    company: 'Stripe',
    position: 'Senior Full Stack Engineer',
    status: 'interviewing',
    dateApplied: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    salaryRange: '$160k - $190k',
    location: 'San Francisco, CA',
    jobType: 'Hybrid',
    notes: 'Applied through a referral. Completed the initial technical phone screen. Next step is the onsite loop.',
    interviews: [
      { _id: 'int_1', stage: 'Recruiter Screen', date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), notes: 'Went great! Recruiter was very helpful.' },
      { _id: 'int_2', stage: 'Technical Assessment', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), notes: 'System design questions on Stripe payment gateways integration models.' }
    ]
  },
  {
    _id: 'job_2',
    company: 'Vercel',
    position: 'Developer Relations Engineer',
    status: 'offered',
    dateApplied: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
    salaryRange: '$140k - $170k',
    location: 'Remote',
    jobType: 'Remote',
    notes: 'Final round panel went extremely well. Recruiter extended verbal offer! Reviewing official details.',
    interviews: [
      { _id: 'int_3', stage: 'Panel Onsite Loop', date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), notes: 'Presented project walkthrough. Met VP of DevRel.' }
    ]
  },
  {
    _id: 'job_3',
    company: 'Linear',
    position: 'Frontend Engineer',
    status: 'applied',
    dateApplied: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    salaryRange: '$130k - $160k',
    location: 'Remote',
    jobType: 'Remote',
    notes: 'Applied on Linear Careers portal. Received auto-reply confirmation email.',
    interviews: []
  },
  {
    _id: 'job_4',
    company: 'Google',
    position: 'Software Engineer III',
    status: 'rejected',
    dateApplied: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
    salaryRange: '$180k - $210k',
    location: 'Mountain View, CA',
    jobType: 'Onsite',
    notes: 'Rejected after the virtual onsite. Got positive feedback on coding, but missed some system design requirements.',
    interviews: [
      { _id: 'int_4', stage: 'Technical Phone Screen', date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000), notes: 'Graph algorithms question. Solved in 30 mins.' }
    ]
  }
];

let clientSkills: any[] = [
  { _id: 'skill_1', name: 'React & Next.js', level: 85, targetLevel: 95, category: 'Frontend', certifications: ['Vercel Certified React Developer'] },
  { _id: 'skill_2', name: 'TypeScript', level: 80, targetLevel: 90, category: 'Frontend', certifications: [] },
  { _id: 'skill_3', name: 'System Design', level: 45, targetLevel: 80, category: 'Backend', certifications: [] },
  { _id: 'skill_4', name: 'Docker & Kubernetes', level: 30, targetLevel: 75, category: 'DevOps', certifications: [] },
  { _id: 'skill_5', name: 'Node.js & Express', level: 75, targetLevel: 85, category: 'Backend', certifications: [] }
];

let clientQuestions: any[] = [
  {
    _id: 'q_1',
    question: 'Explain the difference between Next.js SSR (Server-Side Rendering) and SSG (Static Site Generation). When would you use each?',
    category: 'Technical',
    difficulty: 'Medium',
    suggestedAnswer: 'SSR generates HTML on each request, making it ideal for pages with frequently changing dynamic data. SSG generates HTML at build time, yielding superior performance and caching capabilities, ideal for static pages like blogs, documentation, and marketing pages.',
    userAnswer: 'SSR renders on the server for every request, which is slower but gets fresh data. SSG builds the pages ahead of time, which is fast but requires rebuilding if content changes.',
    feedback: 'Excellent answer. You clearly understand the fundamental performance and caching trade-offs between SSR and SSG. Consider adding mention of Incremental Static Regeneration (ISR) as a hybrid approach.',
    score: 88,
    isCompleted: true
  },
  {
    _id: 'q_2',
    question: 'Tell me about a time you had a conflict with a team member. How did you resolve it?',
    category: 'Behavioral',
    difficulty: 'Easy',
    suggestedAnswer: 'Describe a situation where a disagreement arose regarding technology choice or design. Emphasize communication, listening, focusing on data/metrics, compromising, and prioritizing the product/team goal over personal opinions.',
    userAnswer: '',
    feedback: '',
    score: 0,
    isCompleted: false
  },
  {
    _id: 'q_3',
    question: 'Design a highly available notification delivery system (like Pusher or WebSockets service) that handles millions of connections.',
    category: 'System Design',
    difficulty: 'Hard',
    suggestedAnswer: 'Use a load-balanced set of WebSocket servers. Maintain state in Redis for connection routing. Implement a message broker (RabbitMQ/Kafka) to decouple publication from client streaming. Scale horizontally, and support poll fallbacks.',
    userAnswer: '',
    feedback: '',
    score: 0,
    isCompleted: false
  }
];

let clientNotifications: any[] = [
  {
    _id: 'not_1',
    title: 'Interview Scheduled',
    message: 'Your onsite interview with Stripe is scheduled for tomorrow at 10:00 AM PST.',
    type: 'warning',
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    _id: 'not_2',
    title: 'Resume Analyzed Successfully',
    message: 'Your resume analysis is complete. ATS Score: 82/100. Check suggestions to reach 90+.',
    type: 'success',
    read: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
  },
  {
    _id: 'not_3',
    title: 'New Mock Question Released',
    message: 'A new hard-difficulty system design question has been added based on your Senior Full Stack Engineer role interest.',
    type: 'info',
    read: false,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
  }
];

// Helper wrapper for API requests
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('careeros-token') : null;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers
  };

  if (isBackendOffline) {
    throw new Error('Backend Offline - Simulating');
  }

  try {
    const res = await fetch(`${API_URL}${endpoint}`, config);
    if (!res.ok) {
      if (res.status === 401 && typeof window !== 'undefined') {
        // Handle token expiration / refresh logic
        const refreshToken = localStorage.getItem('careeros-refresh-token');
        if (refreshToken) {
          const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
          });
          if (refreshRes.ok) {
            const data = await refreshRes.json();
            localStorage.setItem('careeros-token', data.accessToken);
            if (data.refreshToken) localStorage.setItem('careeros-refresh-token', data.refreshToken);
            // Retry the original request
            return fetchAPI(endpoint, options);
          }
        }
        // Force logout if refresh fails
        localStorage.removeItem('careeros-token');
        localStorage.removeItem('careeros-refresh-token');
        window.location.href = '/login';
      }
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || 'API request failed');
    }
    return await res.json();
  } catch (error: any) {
    // If connection refused or network error, switch to mock simulator
    if (error.message.includes('fetch') || error.message.includes('Failed to fetch') || error.message.includes('NetworkError') || error.message.includes('ECONNREFUSED')) {
      console.warn(`[API Connection Refused] Switching to frontend client-side simulator for: ${endpoint}`);
      isBackendOffline = true;
      throw new Error('Backend Offline - Simulating');
    }
    throw error;
  }
}

// Exported API controllers (combines live fetch calls and standalone simulator fallbacks)
export const api = {
  auth: {
    async register(payload: any) {
      try {
        return await fetchAPI('/auth/register', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      } catch (err) {
        if (isBackendOffline) {
          const newUser = {
            id: `user_${Date.now()}`,
            name: payload.name,
            email: payload.email,
            role: 'user',
            profileCompletion: 25,
            skills: [],
            bio: '',
            currentTitle: 'Software Engineer',
            targetTitle: 'Senior Full Stack Engineer',
            avatar: ''
          };
          clientUsers.push(newUser);
          localStorage.setItem('careeros-token', 'mock-token-abc');
          localStorage.setItem('careeros-refresh-token', 'mock-refresh-token-xyz');
          return { success: true, user: newUser, accessToken: 'mock-token-abc', refreshToken: 'mock-refresh-token-xyz' };
        }
        throw err;
      }
    },
    async login(payload: any) {
      try {
        return await fetchAPI('/auth/login', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      } catch (err) {
        if (isBackendOffline) {
          const user = clientUsers.find(u => u.email === payload.email);
          if (!user || payload.password !== 'password123') {
            throw new Error('Invalid credentials. (For demo, use email: user@career.os and password: password123)');
          }
          localStorage.setItem('careeros-token', 'mock-token-abc');
          localStorage.setItem('careeros-refresh-token', 'mock-refresh-token-xyz');
          return { success: true, user, accessToken: 'mock-token-abc', refreshToken: 'mock-refresh-token-xyz' };
        }
        throw err;
      }
    },
    async getMe() {
      try {
        return await fetchAPI('/auth/me');
      } catch (err) {
        if (isBackendOffline) {
          const token = localStorage.getItem('careeros-token');
          if (!token) throw new Error('Not authorized');
          // Defaults to standard mock user
          return { success: true, user: clientUsers[0] };
        }
        throw err;
      }
    },
    async updateProfile(payload: any) {
      try {
        return await fetchAPI('/auth/profile', {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
      } catch (err) {
        if (isBackendOffline) {
          clientUsers[0] = { ...clientUsers[0], ...payload, profileCompletion: 85 };
          return { success: true, user: clientUsers[0] };
        }
        throw err;
      }
    }
  },

  jobs: {
    async getJobs() {
      try {
        return await fetchAPI('/jobs');
      } catch (err) {
        if (isBackendOffline) return { success: true, data: clientJobs };
        throw err;
      }
    },
    async createJob(payload: any) {
      try {
        return await fetchAPI('/jobs', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      } catch (err) {
        if (isBackendOffline) {
          const newJob = {
            _id: `job_${Date.now()}`,
            ...payload,
            dateApplied: new Date(),
            interviews: []
          };
          clientJobs.unshift(newJob);
          return { success: true, data: newJob };
        }
        throw err;
      }
    },
    async updateJob(id: string, payload: any) {
      try {
        return await fetchAPI(`/jobs/${id}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
      } catch (err) {
        if (isBackendOffline) {
          const idx = clientJobs.findIndex(j => j._id === id);
          if (idx !== -1) {
            clientJobs[idx] = { ...clientJobs[idx], ...payload };
            return { success: true, data: clientJobs[idx] };
          }
          throw new Error('Job not found');
        }
        throw err;
      }
    },
    async deleteJob(id: string) {
      try {
        return await fetchAPI(`/jobs/${id}`, { method: 'DELETE' });
      } catch (err) {
        if (isBackendOffline) {
          clientJobs = clientJobs.filter(j => j._id !== id);
          return { success: true };
        }
        throw err;
      }
    },
    async addInterview(id: string, payload: any) {
      try {
        return await fetchAPI(`/jobs/${id}/interviews`, {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      } catch (err) {
        if (isBackendOffline) {
          const idx = clientJobs.findIndex(j => j._id === id);
          if (idx !== -1) {
            const newInt = { _id: `int_${Date.now()}`, ...payload, date: new Date(payload.date) };
            clientJobs[idx].interviews.push(newInt);
            return { success: true, data: clientJobs[idx] };
          }
          throw new Error('Job not found');
        }
        throw err;
      }
    }
  },

  resume: {
    async analyzeResume(formData: FormData) {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('careeros-token') : null;
        const res = await fetch(`${API_URL}/resume/analyze`, {
          method: 'POST',
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: formData
        });
        if (!res.ok) throw new Error('Resume analyze failed');
        return await res.json();
      } catch (err) {
        if (isBackendOffline || err instanceof Error) {
          // Simulated Resume Parsing delay
          await new Promise(resolve => setTimeout(resolve, 1500));
          const file = formData.get('resume') as File;
          const targetTitle = (formData.get('targetTitle') as string) || 'Senior Full Stack Engineer';
          const fileName = file ? file.name : 'Resume_Demo.pdf';
          const fileSize = file ? file.size : 12450;
          
          // Compute a hash of file details to generate deterministic but unique values for different files
          let nameHash = 0;
          for (let i = 0; i < fileName.length; i++) {
            nameHash = (nameHash << 5) - nameHash + fileName.charCodeAt(i);
            nameHash |= 0;
          }
          nameHash = Math.abs(nameHash) + fileSize;

          // Unique score between 65 and 96
          const atsScore = 65 + (nameHash % 32);
          
          // Determine present skills and missing skills dynamically
          const requiredSkills = [
            'React', 'TypeScript', 'Node.js', 'System Design', 'Docker', 'Kubernetes', 'CI/CD Pipelines', 'RESTful APIs'
          ];
          
          // Pick subset of skills based on hash to simulate found vs missing
          const presentRequired: string[] = [];
          const missingSkills: string[] = [];
          requiredSkills.forEach((skill, idx) => {
            const isPresent = (nameHash + idx * 7) % 3 !== 0;
            if (isPresent) {
              presentRequired.push(skill);
            } else {
              missingSkills.push(skill);
            }
          });

          const skillsScore = requiredSkills.length > 0 
            ? Math.round((presentRequired.length / requiredSkills.length) * 100)
            : 75;

          const impactScore = 60 + (nameHash % 35);
          const brevityScore = 55 + ((nameHash * 3) % 40);
          const styleScore = 70 + ((nameHash * 7) % 25);

          let verdict = 'Good match, but missing core modern keywords and formatting optimizations.';
          if (atsScore >= 85) verdict = 'Excellent match! Strong ATS compatibility index.';
          else if (atsScore < 70) verdict = 'Weak match. Needs significant section updates and core keyword additions.';

          const keywordAnalysis = requiredSkills.map((reqSkill, idx) => {
            const present = presentRequired.includes(reqSkill);
            return {
              keyword: reqSkill,
              present,
              importance: idx % 3 === 0 ? 'High' : 'Medium'
            };
          });

          const suggestions = [
            { section: 'Skills', tip: `Add missing technology keywords: ${missingSkills.slice(0, 3).join(', ') || 'Docker'}. Recruiters filter candidates based on these exact tags.` },
            { section: 'Work Experience', tip: `Quantify accomplishments in your bullet points (e.g. 'reduced latency by ${15 + (nameHash % 25)}%', 'led team of ${(nameHash % 6) + 2} developers').` },
            { section: 'Structure', tip: 'Use dedicated sections for Work Experience, Education, and Skills to optimize parse formatting.' }
          ];

          return {
            success: true,
            data: {
              fileName,
              targetTitle,
              atsScore,
              verdict,
              metrics: { impactScore, brevityScore, styleScore, skillsScore },
              keywordAnalysis,
              suggestions,
              missingSkills,
              parsedInfo: { 
                name: 'SURAJ KUMAR', 
                email: 'user@career.os', 
                education: 'Bachelor of Computer Science', 
                experienceYears: 1 + (nameHash % 6)
              }
            }
          };
        }
        throw err;
      }
    }
  },

  skills: {
    async getSkills() {
      try {
        return await fetchAPI('/skills');
      } catch (err) {
        if (isBackendOffline) return { success: true, data: clientSkills };
        throw err;
      }
    },
    async createSkill(payload: any) {
      try {
        return await fetchAPI('/skills', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      } catch (err) {
        if (isBackendOffline) {
          const newSkill = { _id: `skill_${Date.now()}`, ...payload, certifications: [] };
          clientSkills.push(newSkill);
          return { success: true, data: newSkill };
        }
        throw err;
      }
    },
    async getRoadmap(skillName: string) {
      try {
        return await fetchAPI(`/skills/roadmap?skillName=${encodeURIComponent(skillName)}`);
      } catch (err) {
        if (isBackendOffline) {
          const nameLower = skillName.toLowerCase();
          let steps = [];
          let difficulty = 'Intermediate to Advanced';
          let estimatedHours = 45;

          if (nameLower.includes('docker') || nameLower.includes('kubernetes') || nameLower.includes('devops')) {
            difficulty = 'Advanced DevOps Track';
            estimatedHours = 55;
            steps = [
              { id: 1, title: 'Week 1-2: Containerization Fundamentals', description: 'Writing multi-stage Dockerfiles, caching image layers, and networking container clusters.', duration: '12 hours', resources: ['Docker Basics Handbook'], status: 'completed' },
              { id: 2, title: 'Week 3-4: Kubernetes Pod Orchestration', description: 'Deploying local minikube setups, managing service YAML configs, ingress controllers, and secret keys.', duration: '18 hours', resources: ['Kubernetes Docs - Getting Started'], status: 'current' },
              { id: 3, title: 'Week 5: CI/CD Github Actions Automation', description: 'Configuring git workflow triggers to automatically compile Docker images and push to AWS registry.', duration: '15 hours', resources: ['Actions Config blue prints'], status: 'pending' },
              { id: 4, title: 'Week 6: AWS Capstone Deployment', description: 'Hosting the containerized app on Elastic Container Service (ECS) with horizontal autoscaling.', duration: '10 hours', resources: ['ECS Deployment guide'], status: 'pending' }
            ];
          } else if (nameLower.includes('system design') || nameLower.includes('backend') || nameLower.includes('database')) {
            difficulty = 'Intermediate System Design';
            estimatedHours = 60;
            steps = [
              { id: 1, title: 'Week 1-2: Scale Vertically vs Horizontally', description: 'Understanding reverse proxies, load balancing algorithms, DNS server distributions, and sticky sessions.', duration: '15 hours', resources: ['System Design Primer'], status: 'completed' },
              { id: 2, title: 'Week 3-4: Database Replication & Sharding', description: 'Designing primary-replica read scaling, write partitioning, indexes, and cache-aside patterns using Redis.', duration: '20 hours', resources: ['High Performance SQL setups'], status: 'current' },
              { id: 3, title: 'Week 5: Asynchronous Event Brokers', description: 'Implementing pub/sub message pipelines with RabbitMQ/Kafka to decouple database writes.', duration: '15 hours', resources: ['Kafka Event queues guides'], status: 'pending' },
              { id: 4, title: 'Week 6: Disaster Recovery Capstone', description: 'Setting up active-active replica databases, multi-region failovers, and backup audits.', duration: '10 hours', resources: ['AWS Multi-region replication guides'], status: 'pending' }
            ];
          } else {
            // Frontend / React / default
            difficulty = 'Frontend Engineer Track';
            estimatedHours = 40;
            steps = [
              { id: 1, title: 'Week 1-2: Advanced Virtual DOM & React 19', description: 'Deep dive into state hooks, memoization limits, custom rendering loops, and form state hooks.', duration: '12 hours', resources: ['React 19 Official blog guides'], status: 'completed' },
              { id: 2, title: 'Week 3: Next.js SSR vs SSG Architectures', description: 'Configuring dynamic server-side rendering, static builds, incremental regeneration (ISR), and middleware routers.', duration: '10 hours', resources: ['Next.js App Router guidelines'], status: 'current' },
              { id: 3, title: 'Week 4: Global Client Store integration', description: 'Configuring slice-based Zustand storage, context routers, and custom middleware handlers.', duration: '8 hours', resources: ['Zustand State APIs documentation'], status: 'pending' },
              { id: 5, title: 'Week 5: Performance Core Web Vitals Optimization', description: 'Analyzing Largest Contentful Paint (LCP), cumulative layout shifts (CLS), and image load weights.', duration: '10 hours', resources: ['Google Lighthouse Auditing manuals'], status: 'pending' }
            ];
          }

          return {
            success: true,
            data: {
              skill: skillName,
              difficulty,
              estimatedHours,
              steps
            }
          };
        }
        throw err;
      }
    }
  },

  interview: {
    async getQuestions(session?: boolean, domain?: string) {
      try {
        const queryParams = [];
        if (session) queryParams.push('session=true');
        if (domain) queryParams.push(`domain=${encodeURIComponent(domain)}`);
        const qs = queryParams.length > 0 ? '?' + queryParams.join('&') : '';
        return await fetchAPI(`/interview/questions${qs}`);
      } catch (err) {
        if (isBackendOffline || err instanceof Error) {
          const userObj = clientUsers[0];
          const target = domain || userObj?.targetTitle || 'Frontend';
          const targetDomain = target.toLowerCase();

          if (session) {
            let selectedDomain: 'Frontend' | 'Backend' | 'DevOps' | 'Data Analyst' | 'Cyber Security' | 'MERN Developer' = 'Frontend';
            if (targetDomain.includes('devops') || targetDomain.includes('infra') || targetDomain.includes('cloud')) {
              selectedDomain = 'DevOps';
            } else if (targetDomain.includes('backend') || targetDomain.includes('system') || targetDomain.includes('database')) {
              selectedDomain = 'Backend';
            } else if (targetDomain.includes('data') || targetDomain.includes('analyst') || targetDomain.includes('statistics')) {
              selectedDomain = 'Data Analyst';
            } else if (targetDomain.includes('security') || targetDomain.includes('cyber') || targetDomain.includes('owasp')) {
              selectedDomain = 'Cyber Security';
            } else if (targetDomain.includes('mern') || targetDomain.includes('full stack') || targetDomain.includes('fullstack')) {
              selectedDomain = 'MERN Developer';
            }

            let technicalPool = clientQuestionBank.filter(q => q.category === 'Technical');
            if (selectedDomain === 'MERN Developer') {
              technicalPool = technicalPool.filter(q => q.domain === 'Frontend' || q.domain === 'Backend');
            } else {
              technicalPool = technicalPool.filter(q => q.domain === selectedDomain);
            }

            const hrPool = clientQuestionBank.filter(q => q.category === 'HR');
            const aptitudePool = clientQuestionBank.filter(q => q.category === 'Aptitude');

            const shuffleAndPick = (pool: any[], n: number) => {
              return [...pool].sort(() => 0.5 - Math.random()).slice(0, n);
            };

            const selectedTech = shuffleAndPick(technicalPool, 6);
            const selectedHR = shuffleAndPick(hrPool, 2);
            const selectedApt = shuffleAndPick(aptitudePool, 2);

            const sessionQuestions = [...selectedTech, ...selectedHR, ...selectedApt].map((q, idx) => ({
              _id: `mock_session_q_${idx}_${Date.now()}`,
              question: q.question,
              category: q.category,
              difficulty: q.difficulty,
              suggestedAnswer: q.suggestedAnswer,
              userAnswer: '',
              feedback: '',
              score: 0,
              isCompleted: false,
              createdAt: new Date(Date.now() + idx * 1000)
            }));

            // Clear previous incomplete mock questions for user
            for (let i = clientQuestions.length - 1; i >= 0; i--) {
              if (!clientQuestions[i].isCompleted) {
                clientQuestions.splice(i, 1);
              }
            }

            clientQuestions.push(...sessionQuestions);
            return { success: true, data: sessionQuestions };
          } else {
            // Normal fetch of questions pool
            let questions = clientQuestions;
            if (questions.length === 0 || !questions.some(q => q._id.startsWith('mock_session_q'))) {
              let selectedDomain: 'Frontend' | 'Backend' | 'DevOps' | 'Data Analyst' | 'Cyber Security' | 'MERN Developer' = 'Frontend';
              if (targetDomain.includes('devops') || targetDomain.includes('infra') || targetDomain.includes('cloud')) {
                selectedDomain = 'DevOps';
              } else if (targetDomain.includes('backend') || targetDomain.includes('system') || targetDomain.includes('database')) {
                selectedDomain = 'Backend';
              } else if (targetDomain.includes('data') || targetDomain.includes('analyst') || targetDomain.includes('statistics')) {
                selectedDomain = 'Data Analyst';
              } else if (targetDomain.includes('security') || targetDomain.includes('cyber') || targetDomain.includes('owasp')) {
                selectedDomain = 'Cyber Security';
              } else if (targetDomain.includes('mern') || targetDomain.includes('full stack') || targetDomain.includes('fullstack')) {
                selectedDomain = 'MERN Developer';
              }

              const initialPool = clientQuestionBank.filter(q => q.domain === selectedDomain || q.domain === 'General').slice(0, 5);
              const seeds = initialPool.map((q, idx) => ({
                _id: `mock_q_seeded_${idx}_${Date.now()}`,
                question: q.question,
                category: q.category,
                difficulty: q.difficulty,
                suggestedAnswer: q.suggestedAnswer,
                userAnswer: '',
                feedback: '',
                score: 0,
                isCompleted: false,
                createdAt: new Date()
              }));
              clientQuestions = seeds;
              questions = seeds;
            }
            return { success: true, data: questions };
          }
        }
        throw err;
      }
    },
    async submitAnswer(id: string, userAnswer: string) {
      try {
        return await fetchAPI(`/interview/questions/${id}/answer`, {
          method: 'POST',
          body: JSON.stringify({ userAnswer })
        });
      } catch (err) {
        if (isBackendOffline) {
          const idx = clientQuestions.findIndex(q => q._id === id);
          if (idx !== -1) {
            const qDoc = clientQuestions[idx];
            const evaluation = gradeUserAnswerSimulated(
              userAnswer,
              qDoc.suggestedAnswer,
              qDoc.category,
              qDoc.difficulty
            );
            clientQuestions[idx] = {
              ...clientQuestions[idx],
              userAnswer,
              feedback: evaluation.feedback,
              score: evaluation.score,
              isCompleted: true
            };
            return { success: true, data: clientQuestions[idx] };
          }
          throw new Error('Question not found');
        }
        throw err;
      }
    },
    async addQuestion(payload: any) {
      try {
        return await fetchAPI('/interview/questions', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      } catch (err) {
        if (isBackendOffline) {
          const newQ = {
            _id: `mock_q_custom_${Date.now()}`,
            question: payload.question,
            category: payload.category,
            difficulty: payload.difficulty || 'Medium',
            suggestedAnswer: payload.suggestedAnswer,
            userAnswer: '',
            feedback: '',
            score: 0,
            isCompleted: false,
            createdAt: new Date()
          };
          clientQuestions.push(newQ);
          return { success: true, data: newQ };
        }
        throw err;
      }
    }
  },

  notifications: {
    async getNotifications() {
      try {
        return await fetchAPI('/notifications');
      } catch (err) {
        if (isBackendOffline) return { success: true, data: clientNotifications };
        throw err;
      }
    },
    async markAsRead(id: string) {
      try {
        return await fetchAPI(`/notifications/${id}/read`, { method: 'PUT' });
      } catch (err) {
        if (isBackendOffline) {
          const idx = clientNotifications.findIndex(n => n._id === id);
          if (idx !== -1) clientNotifications[idx].read = true;
          return { success: true, data: clientNotifications[idx] };
        }
        throw err;
      }
    },
    async markAllAsRead() {
      try {
        return await fetchAPI('/notifications/read-all', { method: 'PUT' });
      } catch (err) {
        if (isBackendOffline) {
          clientNotifications.forEach(n => n.read = true);
          return { success: true };
        }
        throw err;
      }
    }
  },

  admin: {
    async getMetrics() {
      try {
        return await fetchAPI('/admin/metrics');
      } catch (err) {
        if (isBackendOffline) {
          return {
            success: true,
            data: {
              system: { uptime: '14m 23s', cpuUsage: '1.8%', memoryUsage: '34 MB / 128 MB', apiLatency: '15ms', dbConnection: 'Simulated (In-Memory Fallback)', activeSockets: 1 },
              stats: { totalUsers: clientUsers.length, totalJobs: clientJobs.length, totalQuestionsSolved: clientQuestions.filter(q => q.isCompleted).length }
            }
          };
        }
        throw err;
      }
    },
    async getUsers() {
      try {
        return await fetchAPI('/admin/users');
      } catch (err) {
        if (isBackendOffline) return { success: true, data: clientUsers.map(({ password, ...u }) => u) };
        throw err;
      }
    },
    async updateUserRole(id: string, role: string) {
      try {
        return await fetchAPI(`/admin/users/${id}/role`, {
          method: 'PUT',
          body: JSON.stringify({ role })
        });
      } catch (err) {
        if (isBackendOffline) {
          const idx = clientUsers.findIndex(u => u.id === id);
          if (idx !== -1) clientUsers[idx].role = role;
          return { success: true, data: clientUsers[idx] };
        }
        throw err;
      }
    }
  },
  chat: {
    async sendMessage(message: string) {
      try {
        return await fetchAPI('/chat', {
          method: 'POST',
          body: JSON.stringify({ message })
        });
      } catch (err) {
        if (isBackendOffline) {
          const userObj = clientUsers[0] || { name: 'Suraj', targetTitle: 'Full Stack Developer', profileCompletion: 78 };
          const jobs = clientJobs;
          const skills = clientSkills;
          const questionsSolved = clientQuestions.filter(q => q.isCompleted).length;
          
          const userName = userObj.name ? userObj.name.split(' ')[0] : 'Suraj';
          const targetRole = userObj.targetTitle || 'Full Stack Engineer';
          const query = message.toLowerCase();
          
          const stats = {
            applied: jobs.filter(j => j.status === 'applied').length,
            interviewing: jobs.filter(j => j.status === 'interviewing').length,
            offered: jobs.filter(j => j.status === 'offered').length,
            rejected: jobs.filter(j => j.status === 'rejected').length
          };

          if (query.includes('resume') || query.includes('ats')) {
            const missing = skills.filter(s => s.level < s.targetLevel).map(s => s.name);
            const missingStr = missing.length > 0 ? missing.slice(0, 3).join(', ') : 'CI/CD Pipelines, Kubernetes';
            return {
              success: true,
              reply: `Hi ${userName}, looking at your profile for a ${targetRole} path, you currently have a profile completion of ${userObj.profileCompletion || 78}%. To maximize your ATS compatibility, you need to address the competency gaps in: **${missingStr}**. I recommend going to the **Resume AI** module and uploading your resume file to generate a detailed improvement report.`
            };
          }

          if (query.includes('interview') || query.includes('practice') || query.includes('prep')) {
            return {
              success: true,
              reply: `Hi ${userName}, you have completed ${questionsSolved} practice questions so far. Since you are interviewing with companies like **${jobs.map(j => j.company).slice(0, 2).join(' or ') || 'Stripe'}**, I suggest starting a fresh **Mock Interview** session under the **Interview Prep** tab. We have customized pools for ${targetRole} covering both Technical depth and HR STAR techniques.`
            };
          }

          if (query.includes('roadmap') || query.includes('skills') || query.includes('learn')) {
            const skillList = skills.map(s => s.name).join(', ') || 'React, TypeScript, Node.js';
            return {
              success: true,
              reply: `For a **${targetRole}** track, the primary technical milestone is containerizing services and implementing high-availability. Since you already list **${skillList}**, you should target Docker, Kubernetes, and advanced System Design next. I have generated a custom training pathway for you under the **Skills & Roadmap** tab.`
            };
          }

          if (query.includes('job') || query.includes('track') || query.includes('apply') || query.includes('status')) {
            return {
              success: true,
              reply: `You are currently tracking **${jobs.length} applications** in your board:\n- ${stats.applied} Applied\n- ${stats.interviewing} Interviewing\n- ${stats.offered} Offered\n- ${stats.rejected} Rejected\n\nYou have an active interview loop with **${jobs.filter(j => j.status === 'interviewing').map(j => j.company).join(', ') || 'Stripe'}**. Keep updating the Kanban board in the **Application Tracker** module to sync your dashboard statistics automatically!`
            };
          }

          if (query.includes('hello') || query.includes('hi') || query.includes('hey')) {
            return {
              success: true,
              reply: `Hello ${userName}! I am your personalized CareerOS AI Assistant. I have loaded your active profile targeting **${targetRole}**. I can review your resume, suggest learning milestones, prepare you for upcoming interviews, or analyze your job application tracker. What can I help you with today?`
            };
          }

          return {
            success: true,
            reply: `Hi ${userName}, I've analyzed your profile targeting **${targetRole}** with **${jobs.length} tracked applications** and **${skills.length} target skills**. To help you best, you can ask me:\n1. "How can I improve my resume for ${targetRole}?"\n2. "What are my next learning steps?"\n3. "How should I prepare for my upcoming interviews?"\n4. "Summarize my active job applications tracker status."`
          };
        }
        throw err;
      }
    }
  }
};

// ====================================================
// CLIENT-SIDE SIMULATOR HELPER FUNCTIONS
// ====================================================

export function gradeUserAnswerSimulated(
  userAnswer: string, 
  suggestedAnswer: string, 
  category: string, 
  difficulty: string
): { score: number; feedback: string } {
  const answer = userAnswer.trim();
  const lowerAnswer = answer.toLowerCase();

  const dontKnowPhrases = ["i don't know", "i dont know", "no idea", "not sure", "don't know", "dunno", "skip", "have no idea", "no clue"];
  const isDontKnow = dontKnowPhrases.some(phrase => lowerAnswer.includes(phrase));
  const wordCount = answer.split(/\s+/).filter(Boolean).length;

  if (isDontKnow || wordCount < 5) {
    return {
      score: 10,
      feedback: "Your response is too brief or indicates you aren't familiar with this topic. In a real interview, if you don't know the exact answer, try explaining related foundational concepts, your general troubleshooting approach, or ask clarifying questions rather than just saying you don't know."
    };
  }

  let lengthScore = 0;
  if (wordCount >= 40) lengthScore = 25;
  else if (wordCount >= 25) lengthScore = 18;
  else if (wordCount >= 10) lengthScore = 10;
  else lengthScore = 5;

  const stopWords = new Set(['the', 'and', 'a', 'to', 'of', 'in', 'is', 'that', 'it', 'for', 'on', 'with', 'as', 'this', 'by', 'an', 'be', 'are', 'which', 'or']);
  const cleanSuggestedWords = suggestedAnswer
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
    .split(/\s+/)
    .filter(w => w.length > 3 && !stopWords.has(w));
  
  const uniqueKeywords = Array.from(new Set(cleanSuggestedWords));
  let matchedKeywords = 0;
  uniqueKeywords.forEach(kw => {
    if (lowerAnswer.includes(kw)) matchedKeywords++;
  });

  const keywordRatio = uniqueKeywords.length > 0 ? matchedKeywords / uniqueKeywords.length : 0.5;
  const keywordScore = Math.round(keywordRatio * 35);

  const connectors = ['because', 'therefore', 'contrast', 'example', 'optimize', 'scalability', 'performance', 'latency', 'mitigate', 'implement', 'configure', 'architecture', 'caching', 'index'];
  let connectorMatches = 0;
  connectors.forEach(word => {
    if (lowerAnswer.includes(word)) connectorMatches++;
  });
  const depthScore = Math.min(25, (connectorMatches * 5) + (difficulty === 'Hard' ? 5 : 10));

  const sentences = answer.split(/[.!?]+/).filter(s => s.trim().length > 0);
  let clarityScore = 5;
  if (sentences.length >= 2) clarityScore = 15;
  else if (sentences.length === 1 && answer.includes(',')) clarityScore = 10;

  let finalScore = lengthScore + keywordScore + depthScore + clarityScore;
  finalScore = Math.min(100, Math.max(15, finalScore));

  let feedback = "";
  if (finalScore >= 85) {
    feedback = `Excellent response! You scored ${finalScore}/100. Your answer shows strong technical depth, covers key concepts like "${uniqueKeywords.slice(0, 3).join(', ')}", and is well structured. You effectively addressed the ${category} criteria at a ${difficulty} level.`;
  } else if (finalScore >= 70) {
    feedback = `Good job. You scored ${finalScore}/100. You covered many important points and detailed the context directly. To reach an outstanding rating (85+), expand on technical details or give a concrete example of how you would implement or troubleshoot this in production.`;
  } else if (finalScore >= 45) {
    feedback = `Fair attempt. You scored ${finalScore}/100. Your response covers the basic elements, but lacks depth or key keywords. Consider studying the blueprint answer key and adding terms like "${uniqueKeywords.slice(0, 3).filter(k => !lowerAnswer.includes(k)).join(', ') || 'related frameworks'}".`;
  } else {
    feedback = `Your response scored ${finalScore}/100 and needs improvement. It is a bit too brief or misses critical technical aspects of the question. Review the suggested blueprint answer, expand your explanations using the STAR method, and practice defining the underlying core mechanics.`;
  }

  return { score: finalScore, feedback };
}

export const clientQuestionBank = [
  // ==========================================
  // FRONTEND DEVELOPER QUESTIONS
  // ==========================================
  {
    question: "What is Tailwind CSS and how does its utility-first approach compare to traditional semantic CSS stylesheets?",
    category: "Technical",
    difficulty: "Easy",
    domain: "Frontend",
    suggestedAnswer: "Tailwind CSS provides low-level utility classes that let you build custom designs directly in your markup. Compared to traditional semantic CSS, it eliminates the need to write custom class names, keeps style sheets small by reusing classes, and avoids cascading style side-effects. However, it can make HTML look cluttered and has a learning curve for class name memorization."
  },
  {
    question: "Explain the concept of React state and props. What are the key differences between them?",
    category: "Technical",
    difficulty: "Easy",
    domain: "Frontend",
    suggestedAnswer: "State represents the local, mutable data private to a component that can change over time (e.g., via useState). Props (properties) are immutable inputs passed down from parent components to child components to configure them. When state changes, the component re-renders. When props change, the child component re-renders to reflect the new values."
  },
  {
    question: "What is Next.js Incremental Static Regeneration (ISR) and how does it optimize page loading performance?",
    category: "Technical",
    difficulty: "Medium",
    domain: "Frontend",
    suggestedAnswer: "ISR allows developers to update static pages after building the site, without needing to rebuild the entire application. It combines the speed of Static Site Generation (SSG) with fresh data of Server-Side Rendering (SSR). Pages are served from cache, and rebuilt in the background only when a request comes in after the revalidate timer expires."
  },
  {
    question: "How does Redux Toolkit simplify state management compared to traditional Redux boilerplate?",
    category: "Technical",
    difficulty: "Medium",
    domain: "Frontend",
    suggestedAnswer: "Redux Toolkit (RTK) simplifies Redux by providing configureStore() to set up standard middleware, createSlice() to auto-generate action creators and reducers, and built-in Immer integration to write mutable-looking code that safely updates state immutably. It removes 80% of traditional Redux boilerplate like constants and manual root reducer configurations."
  },
  {
    question: "Explain how event delegation works in vanilla JavaScript and React. How does it improve performance?",
    category: "Technical",
    difficulty: "Medium",
    domain: "Frontend",
    suggestedAnswer: "Event delegation is a technique where a single event listener is attached to a parent element rather than individual child elements. It leverages event bubbling, where events bubble up from target elements to parents. It reduces memory usage by creating fewer listeners and automatically handles dynamically added child elements without binding new events."
  },
  {
    question: "Explain the virtual DOM diffing algorithm in React. How do keys help, and what happens when they are index-based?",
    category: "Technical",
    difficulty: "Hard",
    domain: "Frontend",
    suggestedAnswer: "React uses a virtual DOM to optimize UI updates. The diffing algorithm compares two virtual trees (reconciliation) in O(N) complexity by assuming components of different types produce different trees and keys identify stable elements. Keys help React match children across renders. Using array indices as keys can cause rendering bugs, incorrect state mapping in inputs, and poor performance when items are sorted or inserted at the top."
  },
  {
    question: "How does TypeScript's structural type system differ from a nominal type system, and how do you use generics to enforce type safety?",
    category: "Technical",
    difficulty: "Hard",
    domain: "Frontend",
    suggestedAnswer: "TypeScript uses structural typing (duck typing), meaning types are compatible if they share the same shape (methods/properties), regardless of their declared names. Nominal systems (like Java/C#) match types by explicit declarations. Generics allow us to write reusable, type-safe code by parameterizing types (e.g., Stack<T>), letting the type be determined dynamically when invoked while enforcing compiler constraints."
  },
  {
    question: "Design an API integration layer in Next.js that implements request deduplication, caching, and retry logic.",
    category: "Technical",
    difficulty: "Hard",
    domain: "Frontend",
    suggestedAnswer: "Use a fetch wrapper or Axios interceptor. For deduplication, maintain a map of active promises keyed by URL/params and return the existing promise if a duplicate request occurs concurrently. For caching, utilize an in-memory Map or Redis cache with custom TTLs. For retry, implement exponential backoff with a max retry cap (e.g., retrying up to 3 times after 1s, 2s, and 4s delays if a 5xx status is encountered)."
  },

  // ==========================================
  // BACKEND DEVELOPER QUESTIONS
  // ==========================================
  {
    question: "What is a REST API and what are the standard HTTP methods used to create, read, update, and delete resources?",
    category: "Technical",
    difficulty: "Easy",
    domain: "Backend",
    suggestedAnswer: "A REST (Representational State Transfer) API is an architectural style for designing networked applications using HTTP protocol. It maps CRUD operations to HTTP methods: POST creates a resource, GET reads a resource, PUT updates a resource (fully replacement), PATCH updates a resource partially, and DELETE removes a resource. Status codes (2xx, 4xx, 5xx) communicate result outcomes."
  },
  {
    question: "Explain the role of the Node.js Event Loop. Why is it single-threaded but able to handle high concurrent operations?",
    category: "Technical",
    difficulty: "Easy",
    domain: "Backend",
    suggestedAnswer: "The Event Loop is the engine that handles asynchronous operations in Node.js. Node is single-threaded for Javascript execution, but delegates blocking I/O tasks (file system, network, database) to the OS kernel or thread pool (libuv) which run multi-threaded. When tasks complete, callbacks are pushed to queues, and the Event Loop processes them sequentially, avoiding thread context-switch overhead."
  },
  {
    question: "How does JWT (JSON Web Token) authentication work? Explain access tokens, refresh tokens, and secure storage.",
    category: "Technical",
    difficulty: "Medium",
    domain: "Backend",
    suggestedAnswer: "JWT is a stateless auth protocol. Upon login, the server issues an Access Token (short-lived, e.g. 15m) signed with a secret containing user payload. The client attaches this in HTTP headers for requests. A Refresh Token (long-lived, e.g. 7d) is stored in a secure HTTP-only cookie and used to obtain new access tokens when they expire. Access tokens should not be stored in localStorage due to XSS vulnerability."
  },
  {
    question: "Explain the differences between SQL normalization and denormalization. When should you denormalize a database?",
    category: "Technical",
    difficulty: "Medium",
    domain: "Backend",
    suggestedAnswer: "Normalization structures database tables to reduce redundancy and improve data integrity (up to 3NF, using foreign keys). Denormalization intentionally adds redundant data to speed up read queries by avoiding expensive JOIN operations. You should denormalize in high-read architectures (like data warehouses or dashboard landing pages) where read performance is critical."
  },
  {
    question: "How do you handle middleware in Express.js? Explain the request-response cycle and error-handling middleware.",
    category: "Technical",
    difficulty: "Medium",
    domain: "Backend",
    suggestedAnswer: "Middleware in Express are functions that run during the request-response cycle, receiving (req, res, next) objects. They can modify requests, execute code, end cycles, or call next() to pass control. Error-handling middleware is defined with four arguments (err, req, res, next) and is placed at the end of the router queue to catch thrown errors."
  },
  {
    question: "Design a scalable rate limiter for Express APIs using Redis. How do sliding window algorithms work?",
    category: "Technical",
    difficulty: "Hard",
    domain: "Backend",
    suggestedAnswer: "A sliding window rate limiter stores timestamps of user requests in a Redis Sorted Set (ZSET) keyed by user IP. For each request, remove elements older than current time minus window size (e.g. 1 minute). Count the remaining elements using ZCARD. If count exceeds limit, reject request. Otherwise, add the new timestamp using ZADD and set a key TTL to expire the set."
  },
  {
    question: "Compare SQL vs. NoSQL indexing. How do B-Trees compare to MongoDB's wildcard indexes in query execution?",
    category: "Technical",
    difficulty: "Hard",
    domain: "Backend",
    suggestedAnswer: "SQL databases use B-Trees for primary and secondary indexing, keeping elements sorted for logarithmic search, insertions, and range queries. MongoDB also uses B-Trees for standard keys, but offers Wildcard Indexes to index all subdocuments dynamically. Wildcard indexes are convenient for polymorphic fields but consume substantial storage and slow down write operations compared to structured B-Tree keys."
  },
  {
    question: "Explain database transactions in MongoDB. How do you implement ACID properties using sessions and two-phase commits?",
    category: "Technical",
    difficulty: "Hard",
    domain: "Backend",
    suggestedAnswer: "MongoDB supports multi-document ACID transactions via Sessions (client.startSession()). You start a transaction within a session, execute operations passing the session object, and commit or abort the transaction. If any operation fails, all changes are rolled back. Under the hood, this uses replica set oplogs and locks to ensure Atomicity, Consistency, Isolation, and Durability."
  },

  // ==========================================
  // DEVOPS ENGINEER QUESTIONS
  // ==========================================
  {
    question: "What is a Docker container, and how does it differ from a Virtual Machine?",
    category: "Technical",
    difficulty: "Easy",
    domain: "DevOps",
    suggestedAnswer: "Docker containers share the host OS kernel and isolate processes using namespaces and cgroups, making them lightweight (MBs) and fast to boot (seconds). Virtual Machines run a full guest OS on top of a hypervisor, consuming significant memory and disk storage (GBs) and booting much slower. Containers offer high density and portability for microservices."
  },
  {
    question: "What is CI/CD, and why is it important in modern software engineering loops?",
    category: "Technical",
    difficulty: "Easy",
    domain: "DevOps",
    suggestedAnswer: "CI (Continuous Integration) is the automated process of building and testing code changes whenever developers commit to a central repository. CD (Continuous Deployment) automatically deploys passing builds to production environments. It is critical because it shortens feedback loops, catches bugs early, ensures deployment consistency, and minimizes manual delivery risks."
  },
  {
    question: "Explain Kubernetes Pods, Deployments, and Services. How does traffic flow from outside to a pod?",
    category: "Technical",
    difficulty: "Medium",
    domain: "DevOps",
    suggestedAnswer: "A Pod is the smallest deployable unit in Kubernetes, hosting one or more containers. A Deployment manages Pod replicas, handling scaling and rolling updates. A Service exposes Pods to networking. Incoming traffic enters through an Ingress Controller, which routes it to a ClusterIP Service. The service load balances the TCP/UDP traffic to individual Pod IPs using iptables or IPVS rules."
  },
  {
    question: "Explain rolling updates vs. blue-green deployments in AWS. What are the cost and uptime tradeoffs?",
    category: "Technical",
    difficulty: "Medium",
    domain: "DevOps",
    suggestedAnswer: "Rolling updates replace old pods/instances gradually with new ones, keeping capacity constant. It consumes no extra resources (low cost) but can lead to mixed-version states and slow rollbacks. Blue-Green deployments spin up an identical target environment (Green) running the new version alongside the old one (Blue), shifting traffic at once. It has zero downtime and instant rollbacks, but doubles infrastructure costs during deployment."
  },
  {
    question: "How do you monitor application performance using Prometheus and Grafana? What are the Golden Signals of monitoring?",
    category: "Technical",
    difficulty: "Medium",
    domain: "DevOps",
    suggestedAnswer: "Prometheus pulls metrics (time-series data) from application HTTP scrapers, and Grafana queries Prometheus to render charts. The four Golden Signals of monitoring are: Latency (time taken to service requests), Traffic (demand/requests per second), Errors (rate of failed requests), and Saturation (system resource utilization like CPU or memory)."
  },
  {
    question: "Design a secure multi-tenant Kubernetes cluster structure. How do network policies and RBAC restrict access?",
    category: "Technical",
    difficulty: "Hard",
    domain: "DevOps",
    suggestedAnswer: "Create separate Namespaces for tenants. Apply Kubernetes RBAC (Role-Based Access Control) to restrict namespace access using Roles and RoleBindings mapped to user groups. Implement Network Policies to restrict cross-namespace pod communication, blocking ingress traffic by default. Enable ResourceQuotas and LimitRanges to prevent a tenant from exhausting node resources."
  },
  {
    question: "Explain horizontal pod autoscaling (HPA) in Kubernetes. How do metrics adapters scale pods using custom Prometheus queries?",
    category: "Technical",
    difficulty: "Hard",
    domain: "DevOps",
    suggestedAnswer: "HPA scales the number of replica pods based on CPU/memory metrics or custom API queries. To scale based on custom metrics, deploy the Prometheus Adapter (metrics-server wrapper) which registers custom APIs in the K8s aggregation layer. HPA queries this endpoint, compares the metric value (e.g. HTTP request rate) against target thresholds, and modifies the Deployment's replica count."
  },
  {
    question: "Design a disaster recovery backup strategy on AWS for a database cluster using multi-region replication and Route53 failover.",
    category: "Technical",
    difficulty: "Hard",
    domain: "DevOps",
    suggestedAnswer: "Deploy an Amazon Aurora Global Database with active-passive cross-region replication (latency < 1s). Set up automatic snapshots saved in S3, replicated to secondary regions. Use AWS Route53 with Failover Routing Policies linked to CloudWatch health checks. If the primary database region fails, CloudWatch triggers a DNS failover, Route53 updates routes to the secondary region, and an AWS Lambda promotes the secondary db reader to writer."
  },

  // ==========================================
  // DATA ANALYST QUESTIONS
  // ==========================================
  {
    question: "What is SQL JOIN and what is the difference between an INNER JOIN, LEFT JOIN, and RIGHT JOIN?",
    category: "Technical",
    difficulty: "Easy",
    domain: "Data Analyst",
    suggestedAnswer: "SQL JOIN is used to combine rows from two or more tables based on a related column. INNER JOIN returns only records that have matching values in both tables. LEFT JOIN returns all records from the left table, and matching records from the right table (returning NULL if no match). RIGHT JOIN does the opposite, returning all records from the right table and matching ones from the left."
  },
  {
    question: "What is the difference between descriptive and inferential statistics?",
    category: "Technical",
    difficulty: "Easy",
    domain: "Data Analyst",
    suggestedAnswer: "Descriptive statistics summarizes and describes the characteristics of a dataset (e.g., mean, median, standard deviation, count). Inferential statistics uses sample data to make predictions, generalizations, or test hypotheses about a larger population (e.g., t-tests, ANOVA, linear regression, confidence intervals)."
  },
  {
    question: "How do you handle missing or null data in a Python pandas DataFrame? What are the implications of imputation?",
    category: "Technical",
    difficulty: "Medium",
    domain: "Data Analyst",
    suggestedAnswer: "In Pandas, you can detect missing data with df.isnull() and drop them with df.dropna(), or fill them using df.fillna() (imputation with mean, median, or ffill). Imputing maintains sample size and avoids discarding data, but it can introduce bias, underestimate standard errors, and weaken relationships between variables if the data is not missing at random."
  },
  {
    question: "What is Power BI DAX? Explain the difference between a Calculated Column and a Measure.",
    category: "Technical",
    difficulty: "Medium",
    domain: "Data Analyst",
    suggestedAnswer: "DAX (Data Analysis Expressions) is the formula language in Power BI. A Calculated Column is computed row-by-row during data refresh, stored in the database, and consumes memory. A Measure is computed on-the-fly when visuals are updated, dynamically reacting to filter contexts, and consumes CPU rather than persistent storage."
  },
  {
    question: "Explain the Central Limit Theorem and its importance in statistical hypothesis testing.",
    category: "Technical",
    difficulty: "Medium",
    domain: "Data Analyst",
    suggestedAnswer: "The CLT states that if you take sufficiently large random samples from any population (usually N >= 30), the distribution of the sample means will be approximately normal, regardless of the population's underlying distribution. This allows us to use parametric statistics (like z-scores and t-tests) and normal probability tables to perform hypothesis testing."
  },
  {
    question: "Explain how to write a recursive Common Table Expression (CTE) in SQL to traverse hierarchical database structures.",
    category: "Technical",
    difficulty: "Hard",
    domain: "Data Analyst",
    suggestedAnswer: "A recursive CTE uses the WITH RECURSIVE syntax. It consists of two parts joined by UNION ALL: an Anchor Member (which queries the base/top level of hierarchy, e.g. parent_id IS NULL) and a Recursive Member (which references the CTE itself and joins it back to the source table, e.g., CTE.id = source.parent_id). A termination condition is met when the recursive join yields no more rows."
  },
  {
    question: "What is A/B testing? How do you calculate sample size, statistical power, and p-value to verify test results?",
    category: "Technical",
    difficulty: "Hard",
    domain: "Data Analyst",
    suggestedAnswer: "A/B testing compares two versions (Control and Treatment) to measure changes in conversion. Calculate sample size using baseline conversion, MDE, significance level (5%), and power (80%). The p-value is the probability of observing test results at least as extreme as the actual results, assuming the null hypothesis is true. Reject null hypothesis if p-value < 0.05."
  },
  {
    question: "Design an interactive executive dashboard in Power BI that processes star-schema data models and maintains sub-second query latency.",
    category: "Technical",
    difficulty: "Hard",
    domain: "Data Analyst",
    suggestedAnswer: "Organize the dataset into a strict Star Schema (Fact tables linked to Dimension tables via 1-to-many relationships). Avoid bi-directional filters and nested DAX queries. Use Aggregation Tables to pre-summarize detailed facts. Enable DirectQuery only for real-time transactions, and use Import Mode for general visuals. Limit card visual counts per report page, and filter out unused columns in Power Query."
  },

  // ==========================================
  // CYBER SECURITY QUESTIONS
  // ==========================================
  {
    question: "What is OWASP Top 10, and why is it a reference standard for web application security?",
    category: "Technical",
    difficulty: "Easy",
    domain: "Cyber Security",
    suggestedAnswer: "OWASP Top 10 is a regularly updated report outlining the ten most critical security risks facing web applications. It serves as a global reference because it is based on industry consensus, details attack vectors, provides mitigation guides, and helps developers build security checks into the software lifecycle."
  },
  {
    question: "What is the difference between symmetric and asymmetric encryption?",
    category: "Technical",
    difficulty: "Easy",
    domain: "Cyber Security",
    suggestedAnswer: "Symmetric encryption uses a single shared key to both encrypt and decrypt data (e.g. AES), making it fast and efficient for bulk data. Asymmetric encryption uses a mathematically linked key pair: a Public Key for encryption and a Private Key for decryption (e.g. RSA). It is slower but solves the key distribution problem, enabling secure handshakes and digital signatures."
  },
  {
    question: "Explain how Cross-Site Scripting (XSS) works and how to prevent it in modern React frontend applications.",
    category: "Technical",
    difficulty: "Medium",
    domain: "Cyber Security",
    suggestedAnswer: "XSS occurs when an application inserts unsanitized user input into web pages, executing malicious scripts in the user's browser. React automatically escapes strings rendered in JSX, preventing simple XSS. However, XSS can still occur via dangerouslySetInnerHTML, javascript: URLs in anchor tags, or direct DOM manipulation. Prevent it by sanitizing input (e.g. DOMPurify) and setting a Content Security Policy (CSP)."
  },
  {
    question: "How does OAuth 2.0 work? Explain the difference between Authentication and Authorization.",
    category: "Technical",
    difficulty: "Medium",
    domain: "Cyber Security",
    suggestedAnswer: "OAuth 2.0 is an authorization framework. The user logs in to an IDP which issues an Access Token to a third-party app, granting access to resources without sharing credentials. Authentication verifies *who* a user is (e.g., logging in via OIDC), whereas Authorization verifies *what* permission access level they have (OAuth 2.0 scopes)."
  },
  {
    question: "Explain SQL Injection (SQLi) and how parameterized queries prevent malicious database commands.",
    category: "Technical",
    difficulty: "Medium",
    domain: "Cyber Security",
    suggestedAnswer: "SQLi occurs when user inputs are concatenated directly into SQL statements, allowing attackers to manipulate queries. Parameterized queries (prepared statements) solve this by separating the SQL code structure from the user data parameters. The database compiles the SQL query structure first, then inserts parameters, treating inputs strictly as literal values rather than executable commands."
  },
  {
    question: "Design a secure authentication system that resists brute-force, credential stuffing, and session hijacking.",
    category: "Technical",
    difficulty: "Hard",
    domain: "Cyber Security",
    suggestedAnswer: "Store passwords using bcrypt or Argon2 hashing with unique salts. Implement Multi-Factor Authentication (MFA) via TOTP. Resist brute-force using rate limiting and temporary account lockouts. Mitigate credential stuffing via IP reputation checks and CAPTCHAs. Prevent session hijacking by using secure HTTP-only, SameSite=Strict cookies for JWTs, rotate session IDs upon auth change, and track active user agent fingerprints."
  },
  {
    question: "Explain how a man-in-the-middle (MITM) attack works on TLS handshakes, and how Certificate Pinning mitigates it.",
    category: "Technical",
    difficulty: "Hard",
    domain: "Cyber Security",
    suggestedAnswer: "In a MITM attack, an attacker intercepts TLS handshakes, presenting a fake certificate to the client to decrypt and forward traffic. Certificate Pinning mitigates this by embedding the server's public key or root certificate hash directly in the client application. The client compares the server's presented certificate chain against this pinned copy, closing connections immediately if there is a mismatch."
  },
  {
    question: "Explain how to perform static and dynamic vulnerability analysis (SAST/DAST) in an automated DevSecOps build pipeline.",
    category: "Technical",
    difficulty: "Hard",
    domain: "Cyber Security",
    suggestedAnswer: "SAST scans source code during builds without executing it (e.g. SonarQube), catching OWASP flaws and key leaks early. DAST runs automated attacks against the compiled, running application in staging (e.g. OWASP ZAP), catching runtime config and environment auth flaws. Integrate SAST on git commit hooks and DAST during nightly CD pipelines."
  },

  // ==========================================
  // HR / BEHAVIORAL QUESTIONS
  // ==========================================
  {
    question: "Tell me about a time you had a conflict with a team member. How did you resolve it?",
    category: "HR",
    difficulty: "Medium",
    domain: "General",
    suggestedAnswer: "Detail a professional disagreement (e.g., technical design choice). Frame it constructively: list the perspectives, focus on objective data, schedule a private conversation, find a compromise aligned with project goals, and commit to the decided route."
  },
  {
    question: "Describe a project you are proud of. What was your role and how did you measure success?",
    category: "HR",
    difficulty: "Medium",
    domain: "General",
    suggestedAnswer: "Use the STAR model. Describe the situation, your responsibilities, the action steps (e.g. refactoring code, containerizing services), and quantify results (e.g. reduced build times by 40%, cut latency by 150ms)."
  },
  {
    question: "Describe a time you failed or made a mistake on a task. What did you learn and how did you handle it?",
    category: "HR",
    difficulty: "Hard",
    domain: "General",
    suggestedAnswer: "Acknowledge the mistake honestly (e.g., broke a staging pipeline, missed an edge-case bug). Focus on active resolution steps taken immediately, and describe the long-term process changes (e.g., added pre-commit tests) to prevent reoccurrence."
  },
  {
    question: "How do you explain a complex technical concept to a non-technical stakeholder?",
    category: "HR",
    difficulty: "Easy",
    domain: "General",
    suggestedAnswer: "Emphasize empathy and simplicity. Avoid acronyms and technical jargon. Use real-world analogies (e.g., comparing caching to a desk workspace). Focus on the 'why' and business outcome rather than implementation detail."
  },

  // ==========================================
  // COMMUNICATION / APTITUDE QUESTIONS
  // ==========================================
  {
    question: "Estimate the number of tennis balls that can fit inside a standard yellow school bus. Explain your Fermi estimation logic.",
    category: "Aptitude",
    difficulty: "Medium",
    domain: "General",
    suggestedAnswer: "Apply Fermi estimation: estimate bus volume (approx 8ft x 6ft x 30ft = 1,440 cubic feet, convert to inches). Estimate tennis ball volume (diameter 2.7 in, volume approx 10 cubic inches). Calculate ideal packing density (approx 60-70% for spheres). Divide total volume by ball volume, multiply by packing density, resulting in approx 150,000 to 200,000 tennis balls."
  },
  {
    question: "Design a toll booth payment system for a highway. How do you optimize traffic flow and handle payment failures?",
    category: "Aptitude",
    difficulty: "Hard",
    domain: "General",
    suggestedAnswer: "Propose a multi-tier system: contactless automatic lanes (RFID/license tag readers), physical credit/cash lanes, and online backup portals. Optimize throughput via buffer lanes and overhead signaling. Handle failures gracefully: snap a license plate photo, allow cars to proceed to clear lanes, and issue a digital invoice to avoid highway gridlocks."
  }
];

function getRequiredSkillsSimulated(title: string): string[] {
  const t = title.toLowerCase();
  if (t.includes('frontend')) {
    return ['React', 'TypeScript', 'HTML', 'CSS', 'JavaScript', 'Next.js', 'Redux', 'RESTful APIs'];
  }
  if (t.includes('backend')) {
    return ['Node.js', 'TypeScript', 'RESTful APIs', 'SQL', 'MongoDB', 'Redis', 'System Design', 'Docker'];
  }
  if (t.includes('devops') || t.includes('infrastructure') || t.includes('cloud')) {
    return ['Docker', 'Kubernetes', 'CI/CD Pipelines', 'AWS', 'Linux', 'Terraform', 'Git', 'System Design'];
  }
  return ['React', 'Node.js', 'TypeScript', 'RESTful APIs', 'MongoDB', 'Docker', 'System Design', 'CI/CD Pipelines'];
}
