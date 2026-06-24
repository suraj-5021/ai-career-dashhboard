import bcrypt from 'bcrypt';
import User from '../models/User';
import Job from '../models/Job';
import Skill from '../models/Skill';
import Question from '../models/Question';
import Notification from '../models/Notification';
import { isConnected } from './db';

// In-Memory collections for database fallback
export let mockUsers: any[] = [];
export let mockJobs: any[] = [];
export let mockSkills: any[] = [];
export let mockQuestions: any[] = [];
export let mockNotifications: any[] = [];

// Seed the collections with startup-quality data
export async function seedMockStore() {
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  // 1. Seed Users
  const usersData = [
    {
      _id: '666a00000000000000000001',
      name: 'Suraj Kumar',
      email: 'user@career.os',
      password: hashedPassword,
      role: 'user',
      isVerified: true,
      profileCompletion: 78,
      skills: ['React', 'Next.js', 'TypeScript', 'Node.js', 'MongoDB'],
      bio: 'Full Stack Developer passionate about scalable architectures and AI integrations.',
      currentTitle: 'Frontend Engineer',
      targetTitle: 'Senior Full Stack Engineer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    },
    {
      _id: '666a00000000000000000002',
      name: 'Startup Admin',
      email: 'admin@career.os',
      password: hashedPassword,
      role: 'admin',
      isVerified: true,
      profileCompletion: 100,
      skills: ['System Design', 'Scaling', 'Management'],
      bio: 'Platform admin overseeing career development roadmaps.',
      currentTitle: 'Platform Administrator',
      targetTitle: 'Director of Engineering',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&h=256&q=80',
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
    }
  ];

  // 2. Seed Job Applications
  const jobsData = [
    {
      _id: '666b00000000000000000001',
      userId: '666a00000000000000000001',
      company: 'Stripe',
      position: 'Senior Full Stack Engineer',
      status: 'interviewing',
      dateApplied: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      salaryRange: '$160k - $190k',
      location: 'San Francisco, CA',
      jobType: 'Hybrid',
      notes: 'Applied through a referral. Completed the initial technical phone screen. Next step is the onsite loop.',
      interviews: [
        { _id: '666b10000000000000000001', stage: 'Recruiter Screen', date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), notes: 'Went great! Recruiter was very helpful.' },
        { _id: '666b10000000000000000002', stage: 'Technical Assessment', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), notes: 'System design questions on Stripe payment gateways integration models.' }
      ],
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
    },
    {
      _id: '666b00000000000000000002',
      userId: '666a00000000000000000001',
      company: 'Vercel',
      position: 'Developer Relations Engineer',
      status: 'offered',
      dateApplied: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
      salaryRange: '$140k - $170k',
      location: 'Remote',
      jobType: 'Remote',
      notes: 'Final round panel went extremely well. Recruiter extended verbal offer! Reviewing official details.',
      interviews: [
        { _id: '666b20000000000000000001', stage: 'Panel Onsite Loop', date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), notes: 'Presented project walkthrough. Met VP of DevRel.' }
      ],
      createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000)
    },
    {
      _id: '666b00000000000000000003',
      userId: '666a00000000000000000001',
      company: 'Linear',
      position: 'Frontend Engineer',
      status: 'applied',
      dateApplied: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      salaryRange: '$130k - $160k',
      location: 'Remote',
      jobType: 'Remote',
      notes: 'Applied on Linear Careers portal. Received auto-reply confirmation email.',
      interviews: [],
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      _id: '666b00000000000000000004',
      userId: '666a00000000000000000001',
      company: 'Google',
      position: 'Software Engineer III',
      status: 'rejected',
      dateApplied: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
      salaryRange: '$180k - $210k',
      location: 'Mountain View, CA',
      jobType: 'Onsite',
      notes: 'Rejected after the virtual onsite. Got positive feedback on coding, but missed some system design requirements.',
      interviews: [
        { _id: '666b30000000000000000001', stage: 'Technical Phone Screen', date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000), notes: 'Graph algorithms question. Solved in 30 mins.' }
      ],
      createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000)
    }
  ];

  // 3. Seed Skills
  const skillsData = [
    { _id: '666c00000000000000000001', userId: '666a00000000000000000001', name: 'React & Next.js', level: 85, targetLevel: 95, category: 'Frontend', certifications: ['Vercel Certified React Developer'] },
    { _id: '666c00000000000000000002', userId: '666a00000000000000000001', name: 'TypeScript', level: 80, targetLevel: 90, category: 'Frontend', certifications: [] },
    { _id: '666c00000000000000000003', userId: '666a00000000000000000001', name: 'System Design', level: 45, targetLevel: 80, category: 'Backend', certifications: [] },
    { _id: '666c00000000000000000004', userId: '666a00000000000000000001', name: 'Docker & Kubernetes', level: 30, targetLevel: 75, category: 'DevOps', certifications: [] },
    { _id: '666c00000000000000000005', userId: '666a00000000000000000001', name: 'Node.js & Express', level: 75, targetLevel: 85, category: 'Backend', certifications: [] }
  ];

  // 4. Seed Interview Prep Questions
  const questionsData = [
    {
      _id: '666d00000000000000000001',
      userId: '666a00000000000000000001',
      question: 'Explain the difference between Next.js SSR (Server-Side Rendering) and SSG (Static Site Generation). When would you use each?',
      category: 'Technical',
      difficulty: 'Medium',
      suggestedAnswer: 'SSR generates HTML on each request, making it ideal for pages with frequently changing dynamic data. SSG generates HTML at build time, yielding superior performance and caching capabilities, ideal for static pages like blogs, documentation, and marketing pages.',
      userAnswer: 'SSR renders on the server for every request, which is slower but gets fresh data. SSG builds the pages ahead of time, which is fast but requires rebuilding if content changes.',
      feedback: 'Excellent answer. You clearly understand the fundamental performance and caching trade-offs between SSR and SSG. Consider adding mention of Incremental Static Regeneration (ISR) as a hybrid approach.',
      score: 88,
      isCompleted: true,
      createdAt: new Date()
    },
    {
      _id: '666d00000000000000000002',
      userId: '666a00000000000000000001',
      question: 'Tell me about a time you had a conflict with a team member. How did you resolve it?',
      category: 'Behavioral',
      difficulty: 'Easy',
      suggestedAnswer: 'Describe a situation where a disagreement arose regarding technology choice or design. Emphasize communication, listening, focusing on data/metrics, compromising, and prioritizing the product/team goal over personal opinions.',
      userAnswer: '',
      feedback: '',
      score: 0,
      isCompleted: false,
      createdAt: new Date()
    },
    {
      _id: '666d00000000000000000003',
      userId: '666a00000000000000000001',
      question: 'Design a highly available notification delivery system (like Pusher or WebSockets service) that handles millions of connections.',
      category: 'System Design',
      difficulty: 'Hard',
      suggestedAnswer: 'Use a load-balanced set of WebSocket servers. Maintain state in Redis for connection routing. Implement a message broker (RabbitMQ/Kafka) to decouple publication from client streaming. Scale horizontally, and support poll fallbacks.',
      userAnswer: '',
      feedback: '',
      score: 0,
      isCompleted: false,
      createdAt: new Date()
    }
  ];

  // 5. Seed Notifications
  const notificationsData = [
    {
      _id: '666e00000000000000000001',
      userId: '666a00000000000000000001',
      title: 'Interview Scheduled',
      message: 'Your onsite interview with Stripe is scheduled for tomorrow at 10:00 AM PST.',
      type: 'warning',
      read: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      _id: '666e00000000000000000002',
      userId: '666a00000000000000000001',
      title: 'Resume Analyzed Successfully',
      message: 'Your resume analysis is complete. ATS Score: 82/100. Check suggestions to reach 90+.',
      type: 'success',
      read: true,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
    },
    {
      _id: '666e00000000000000000003',
      userId: '666a00000000000000000001',
      title: 'New Mock Question Released',
      message: 'A new hard-difficulty system design question has been added based on your Senior Full Stack Engineer role interest.',
      type: 'info',
      read: false,
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
    }
  ];

  mockUsers = [...usersData];
  mockJobs = [...jobsData];
  mockSkills = [...skillsData];
  mockQuestions = [...questionsData];
  mockNotifications = [...notificationsData];
  console.log('[Mock Seed] In-Memory collections successfully initialized.');

  if (isConnected) {
    console.log('[Atlas Seed] DB is connected. Checking and seeding collections...');
    try {
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        console.log('[Atlas Seed] Users collection is empty. Seeding users...');
        await User.insertMany(usersData);
      } else {
        console.log(`[Atlas Seed] Users collection already has ${userCount} document(s). Skipping.`);
      }

      const jobCount = await Job.countDocuments();
      if (jobCount === 0) {
        console.log('[Atlas Seed] Jobs collection is empty. Seeding jobs...');
        await Job.insertMany(jobsData);
      } else {
        console.log(`[Atlas Seed] Jobs collection already has ${jobCount} document(s). Skipping.`);
      }

      const skillCount = await Skill.countDocuments();
      if (skillCount === 0) {
        console.log('[Atlas Seed] Skills collection is empty. Seeding skills...');
        await Skill.insertMany(skillsData);
      } else {
        console.log(`[Atlas Seed] Skills collection already has ${skillCount} document(s). Skipping.`);
      }

      const questionCount = await Question.countDocuments();
      if (questionCount === 0) {
        console.log('[Atlas Seed] Questions collection is empty. Seeding questions...');
        await Question.insertMany(questionsData);
      } else {
        console.log(`[Atlas Seed] Questions collection already has ${questionCount} document(s). Skipping.`);
      }

      const notificationCount = await Notification.countDocuments();
      if (notificationCount === 0) {
        console.log('[Atlas Seed] Notifications collection is empty. Seeding notifications...');
        await Notification.insertMany(notificationsData);
      } else {
        console.log(`[Atlas Seed] Notifications collection already has ${notificationCount} document(s). Skipping.`);
      }
      console.log('[Atlas Seed] Database seeding completed successfully.');
    } catch (err: any) {
      console.error('[Atlas Seed Error] Seeding failed:', err.message);
    }
  }
}
