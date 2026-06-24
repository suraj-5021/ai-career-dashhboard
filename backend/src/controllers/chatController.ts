import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import User from '../models/User';
import Job from '../models/Job';
import Skill from '../models/Skill';
import Question from '../models/Question';
import { isConnected } from '../config/db';
import { mockUsers, mockJobs, mockSkills, mockQuestions } from '../config/mockStore';

// Dynamic simulated responder if GEMINI_API_KEY is not configured
function getSimulatedChatReply(
  message: string, 
  userProfile: any, 
  jobs: any[], 
  skills: any[], 
  questionsSolved: number
): string {
  const query = message.toLowerCase();
  const userName = userProfile.name.split(' ')[0];
  const targetRole = userProfile.targetTitle || 'Full Stack Engineer';
  
  const stats = {
    applied: jobs.filter(j => j.status === 'applied').length,
    interviewing: jobs.filter(j => j.status === 'interviewing').length,
    offered: jobs.filter(j => j.status === 'offered').length,
    rejected: jobs.filter(j => j.status === 'rejected').length
  };

  if (query.includes('resume') || query.includes('ats')) {
    const missing = skills.filter(s => s.level < s.targetLevel).map(s => s.name);
    const missingStr = missing.length > 0 ? missing.slice(0, 3).join(', ') : 'CI/CD Pipelines, Kubernetes';
    return `Hi ${userName}, looking at your profile for a ${targetRole} path, you currently have a profile completion of ${userProfile.profileCompletion || 78}%. To maximize your ATS compatibility, you need to address the competency gaps in: **${missingStr}**. I recommend going to the **Resume AI** module and uploading your resume file to generate a detailed improvement report.`;
  }

  if (query.includes('interview') || query.includes('practice') || query.includes('prep')) {
    return `Hi ${userName}, you have completed ${questionsSolved} practice questions so far. Since you are interviewing with companies like **${jobs.map(j => j.company).slice(0, 2).join(' or ') || 'Stripe'}**, I suggest starting a fresh **Mock Interview** session under the **Interview Prep** tab. We have customized pools for ${targetRole} covering both Technical depth and HR STAR techniques.`;
  }

  if (query.includes('roadmap') || query.includes('skills') || query.includes('learn')) {
    const skillList = skills.map(s => s.name).join(', ') || 'React, TypeScript, Node.js';
    return `For a **${targetRole}** track, the primary technical milestone is containerizing services and implementing high-availability. Since you already list **${skillList}**, you should target Docker, Kubernetes, and advanced System Design next. I have generated a custom training pathway for you under the **Skills & Roadmap** tab.`;
  }

  if (query.includes('job') || query.includes('track') || query.includes('apply') || query.includes('status')) {
    return `You are currently tracking **${jobs.length} applications** in your board:
- ${stats.applied} Applied
- ${stats.interviewing} Interviewing
- ${stats.offered} Offered
- ${stats.rejected} Rejected

You have an active interview loop with **${jobs.filter(j => j.status === 'interviewing').map(j => j.company).join(', ') || 'Stripe'}**. Keep updating the Kanban board in the **Application Tracker** module to sync your dashboard statistics automatically!`;
  }

  if (query.includes('hello') || query.includes('hi') || query.includes('hey')) {
    return `Hello ${userName}! I am your personalized CareerOS AI Assistant. I have loaded your active profile targeting **${targetRole}**. I can review your resume, suggest learning milestones, prepare you for upcoming interviews, or analyze your job application tracker. What can I help you with today?`;
  }

  return `I've analyzed your profile targeting **${targetRole}** with **${jobs.length} tracked applications** and **${skills.length} target skills**. To help you best, you can ask me:
1. "How can I improve my resume for ${targetRole}?"
2. "What are my next learning steps?"
3. "How should I prepare for my upcoming interviews?"
4. "Summarize my active job applications tracker status."`;
}

export async function chat(req: AuthRequest, res: Response) {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authorized' });
    return;
  }

  const { message } = req.body;
  if (!message) {
    res.status(400).json({ success: false, message: 'Message content is required' });
    return;
  }

  const userId = req.user.id;

  try {
    // 1. Gather rich user profile context (contextual prompt building)
    let userProfile: any;
    let jobs: any[] = [];
    let skills: any[] = [];
    let questionsSolved = 0;

    if (isConnected) {
      userProfile = await User.findById(userId);
      jobs = await Job.find({ userId });
      skills = await Skill.find({ userId });
      questionsSolved = await Question.countDocuments({ userId, isCompleted: true });
    } else {
      userProfile = mockUsers.find(u => u._id === userId || u.id === userId);
      jobs = mockJobs.filter(j => j.userId === userId);
      skills = mockSkills.filter(s => s.userId === userId);
      questionsSolved = mockQuestions.filter(q => q.userId === userId && q.isCompleted).length;
    }

    if (!userProfile) {
      userProfile = { name: 'User', targetTitle: 'Software Engineer', profileCompletion: 70 };
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // 2. If API Key is missing, run simulated contextual responder
    if (!apiKey) {
      console.warn('[AI Assistant] GEMINI_API_KEY is not defined in environment. Running fallback contextual response.');
      const reply = getSimulatedChatReply(message, userProfile, jobs, skills, questionsSolved);
      res.json({ success: true, reply });
      return;
    }

    // 3. Formulate the highly contextual prompt for Gemini
    const stats = {
      applied: jobs.filter(j => j.status === 'applied').length,
      interviewing: jobs.filter(j => j.status === 'interviewing').length,
      offered: jobs.filter(j => j.status === 'offered').length,
      rejected: jobs.filter(j => j.status === 'rejected').length
    };
    
    const skillList = skills.map(s => `${s.name} (Lvl ${s.level}/${s.targetLevel})`).join(', ') || 'None listed yet';
    const companies = jobs.map(j => `${j.company} (${j.position} - ${j.status})`).join(', ') || 'No active jobs tracked';

    const systemPrompt = `You are "CareerOS AI Assistant", a premium personalized career coach for ${userProfile.name}.
User Context:
- Target Role: ${userProfile.targetTitle || 'Full Stack Engineer'}
- Current Title: ${userProfile.currentTitle || 'Graduate'}
- Profile Completion Index: ${userProfile.profileCompletion}%
- Target Skills: ${skillList}
- Tracked Applications: ${jobs.length} total (${stats.applied} Applied, ${stats.interviewing} Interviewing, ${stats.offered} Offered, ${stats.rejected} Rejected)
- Specific Job Entries: ${companies}
- Interview Questions Solved: ${questionsSolved}

Capabilities you cover:
- Resume Review: Direct user to "Resume AI" tab to upload resumes, analyze keyword gaps.
- Career Advice: Actionable steps for networking, portfolio design, internship searches.
- Interview Prep: Direct user to "Interview Prep" tab to practice HR/Tech mock questions.
- Learning Recommendations: Advise on Docker, system design, Next.js, and how to use the interactive milestones under "Skills & Roadmap" page.

Response Constraints:
- Keep answers professional, concise (1-3 small paragraphs), and extremely action-oriented.
- Address the user by name (${userProfile.name.split(' ')[0]}).
- Ground all advice specifically in the user's target role and their active tracked applications/skills list.
- Use markdown formatting for highlights.

User query: "${message}"`;

    // 4. Invoke Gemini API
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: systemPrompt }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[AI Assistant API Error]', errorText);
      throw new Error(`Gemini service error: ${response.statusText}`);
    }

    const resData = await response.json();
    const reply = resData.candidates?.[0]?.content?.parts?.[0]?.text || 
                  "I'm processing your portfolio details. Ask me about resume analysis, roadmap pathways, or mock interview prep.";

    res.json({ success: true, reply });

  } catch (error: any) {
    console.error('Error in chat controller:', error);
    res.status(500).json({ success: false, message: error.message });
  }
}
