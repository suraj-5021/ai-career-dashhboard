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
          const fileName = file ? file.name : 'Resume_FullStack.pdf';
          return {
            success: true,
            data: {
              fileName,
              targetTitle: 'Senior Full Stack Engineer',
              atsScore: 78,
              verdict: 'Good match, but missing core modern keywords and formatting optimizations.',
              metrics: { impactScore: 82, brevityScore: 75, styleScore: 80, skillsScore: 70 },
              keywordAnalysis: [
                { keyword: 'React 19', present: false, importance: 'High' },
                { keyword: 'TypeScript', present: true, importance: 'High' },
                { keyword: 'System Design', present: false, importance: 'High' },
                { keyword: 'Next.js', present: true, importance: 'Medium' },
                { keyword: 'CI/CD Pipelines', present: false, importance: 'Medium' }
              ],
              suggestions: [
                { section: 'Summary', tip: 'Start with a strong, metrics-driven professional summary highlighting years of full-stack experience.' },
                { section: 'Work Experience', tip: 'Quantify your accomplishments. Instead of "Responsible for Next.js features", write "Architected Next.js pages reducing LCP by 40%."' }
              ],
              missingSkills: ['System Design', 'Docker', 'Kubernetes', 'CI/CD Pipelines'],
              parsedInfo: { name: 'SURAJ KUMAR', email: 'user@career.os', education: 'Bachelor of Computer Science', experienceYears: 4 }
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
          return {
            success: true,
            data: {
              skill: skillName,
              difficulty: 'Intermediate to Advanced',
              estimatedHours: 45,
              steps: [
                { id: 1, title: 'Core Concepts & Paradigms', description: `Deep dive into advanced concurrency models and async structures in ${skillName}.`, duration: 'Week 1-2', resources: ['Documentation'], status: 'completed' },
                { id: 2, title: 'Performance Optimization', description: 'Memory profiling, rendering diagnostics, and cache controls.', duration: 'Week 3', resources: ['Profiling Guides'], status: 'current' },
                { id: 3, title: 'Deployment Pipelines', description: 'Writing CI/CD config scripts and automatic testing checks.', duration: 'Week 4-5', resources: ['CI Templates'], status: 'pending' }
              ]
            }
          };
        }
        throw err;
      }
    }
  },

  interview: {
    async getQuestions() {
      try {
        return await fetchAPI('/interview/questions');
      } catch (err) {
        if (isBackendOffline) return { success: true, data: clientQuestions };
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
            const words = userAnswer.trim().split(/\s+/).length;
            let score = 50;
            let feedback = 'Your answer is a bit short. Try expanding it with specific technical keywords, real-world examples, or metrics.';
            if (words > 20) {
              score = 75;
              feedback = 'Solid response. You addressed the core question directly. Mention how you measure success to elevate.';
            }
            if (words > 50) {
              score = 90;
              feedback = 'Outstanding. Excellent detail, clear structure, and strong professional context.';
            }
            clientQuestions[idx] = { ...clientQuestions[idx], userAnswer, feedback, score, isCompleted: true };
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
          const newQ = { _id: `q_${Date.now()}`, ...payload, userAnswer: '', feedback: '', score: 0, isCompleted: false };
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
  }
};
