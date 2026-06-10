import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';

export async function analyzeResume(req: AuthRequest, res: Response) {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authorized' });
    return;
  }

  // File is optional since we simulate realistic parsing if no actual PDF is parsed.
  const fileName = req.file ? req.file.originalname : 'Resume_FullStack.pdf';
  const targetTitle = req.body.targetTitle || 'Senior Full Stack Engineer';

  try {
    // Generate a premium ATS scoring response
    setTimeout(() => {
      res.json({
        success: true,
        data: {
          fileName,
          targetTitle,
          atsScore: 78,
          verdict: 'Good match, but missing core modern keywords and formatting optimizations.',
          metrics: {
            impactScore: 82,
            brevityScore: 75,
            styleScore: 80,
            skillsScore: 70
          },
          keywordAnalysis: [
            { keyword: 'React 19', present: false, importance: 'High' },
            { keyword: 'TypeScript', present: true, importance: 'High' },
            { keyword: 'System Design', present: false, importance: 'High' },
            { keyword: 'Next.js', present: true, importance: 'Medium' },
            { keyword: 'CI/CD Pipelines', present: false, importance: 'Medium' },
            { keyword: 'RESTful APIs', present: true, importance: 'Medium' },
            { keyword: 'Docker', present: false, importance: 'Low' }
          ],
          suggestions: [
            { section: 'Summary', tip: 'Start with a strong, metrics-driven professional summary highlighting years of full-stack experience.' },
            { section: 'Work Experience', tip: 'Quantify your accomplishments. Instead of "Responsible for Next.js features", write "Architected Next.js pages reducing LCP by 40%."' },
            { section: 'Skills', tip: 'Group technical skills by category (e.g. Languages, Frameworks, Databases) to improve readability for recruitment bots.' }
          ],
          missingSkills: [
            'System Design',
            'Docker',
            'Kubernetes',
            'CI/CD Pipelines',
            'GraphQL'
          ],
          parsedInfo: {
            name: req.user?.email.split('@')[0].toUpperCase() || 'SURAJ KUMAR',
            email: req.user?.email || 'user@career.os',
            education: 'Bachelor of Computer Science / Engineering',
            experienceYears: 4
          }
        }
      });
    }, 1200); // Small delay to simulate file parsing animations on frontend
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
