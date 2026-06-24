import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import mammoth from 'mammoth';
const pdf = require('pdf-parse');

const SKILL_KEYWORDS = [
  'React', 'Next.js', 'TypeScript', 'Node.js', 'MongoDB', 'Express', 'Docker', 'Kubernetes',
  'GraphQL', 'RESTful APIs', 'CI/CD Pipelines', 'AWS', 'System Design', 'Git', 'HTML', 'CSS',
  'JavaScript', 'Python', 'Java', 'C++', 'SQL', 'PostgreSQL', 'Redis', 'Tailwind', 'SaaS',
  'Microservices', 'Linux', 'GCP', 'Azure', 'Webpack', 'Jest', 'Redux', 'Vue', 'Angular',
  'Svelte', 'Django', 'Flask', 'Spring Boot', 'Kafka', 'Elasticsearch', 'CI/CD', 'Jenkins',
  'Terraform', 'WebSockets', 'NextJS', 'ExpressJS', 'Serverless'
];

function getRequiredSkills(title: string): string[] {
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
  // Default Full Stack / Software Engineer
  return ['React', 'Node.js', 'TypeScript', 'RESTful APIs', 'MongoDB', 'Docker', 'System Design', 'CI/CD Pipelines'];
}

export async function analyzeResume(req: AuthRequest, res: Response) {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authorized' });
    return;
  }

  const targetTitle = req.body.targetTitle || 'Senior Full Stack Engineer';
  let text = '';
  let fileName = '';

  if (req.file) {
    fileName = req.file.originalname;
    const fileExtension = fileName.split('.').pop()?.toLowerCase();
    
    try {
      if (fileExtension === 'pdf') {
        const parsed = await pdf(req.file.buffer);
        text = parsed.text || '';
      } else if (fileExtension === 'docx') {
        const parsed = await mammoth.extractRawText({ buffer: req.file.buffer });
        text = parsed.value || '';
      } else {
        // Plain text
        text = req.file.buffer.toString('utf-8');
      }
    } catch (parseError: any) {
      console.error('Error parsing file:', parseError);
      res.status(400).json({ success: false, message: `Failed to parse file: ${parseError.message}` });
      return;
    }
  } else {
    // If no file, simulate using the target title to compile a target-relevant demo resume text
    fileName = 'Resume_Demo.pdf';
    text = `
      SURAJ KUMAR
      Email: user@career.os
      Target: ${targetTitle}
      EXPERIENCE
      Frontend Engineer
      - Developed user interfaces using React and JavaScript.
      - Optimized rendering performance.
      EDUCATION
      Computer Science Degree
      SKILLS
      TypeScript, HTML, CSS, RESTful APIs
    `;
  }

  try {
    const textLower = text.toLowerCase();

    // 1. Technical Skills detection
    const presentSkills: string[] = [];
    SKILL_KEYWORDS.forEach(skill => {
      const escaped = skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b`, 'i');
      if (regex.test(textLower)) {
        presentSkills.push(skill);
      }
    });

    const requiredSkills = getRequiredSkills(targetTitle);
    const presentRequired = requiredSkills.filter(s => 
      presentSkills.some(ps => ps.toLowerCase() === s.toLowerCase())
    );
    const missingSkills = requiredSkills.filter(s => 
      !presentSkills.some(ps => ps.toLowerCase() === s.toLowerCase())
    );

    const skillsScore = requiredSkills.length > 0 
      ? Math.round((presentRequired.length / requiredSkills.length) * 100)
      : 80;

    // 2. Sections evaluation
    const sectionsToCheck = [
      { name: 'Experience', keywords: ['experience', 'work', 'history', 'employment'] },
      { name: 'Education', keywords: ['education', 'college', 'university', 'degree', 'academic'] },
      { name: 'Skills', keywords: ['skills', 'technologies', 'tools', 'competencies'] },
      { name: 'Projects', keywords: ['projects', 'personal projects', 'portfolio'] },
      { name: 'Summary', keywords: ['summary', 'objective', 'profile', 'about me'] }
    ];

    const foundSections: string[] = [];
    const missingSections: string[] = [];

    sectionsToCheck.forEach(sec => {
      const found = sec.keywords.some(kw => textLower.includes(kw));
      if (found) {
        foundSections.push(sec.name);
      } else {
        missingSections.push(sec.name);
      }
    });

    const sectionsScore = Math.round((foundSections.length / sectionsToCheck.length) * 100);

    // 3. Formatting evaluation
    let formattingScore = 0;
    // Email Check
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const hasEmail = emailRegex.test(textLower);
    // Bullet Points Check
    const hasBullets = text.includes('•') || text.includes('-') || text.includes('*');
    // Word count Check
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    const lengthOk = wordCount >= 300 && wordCount <= 1200;

    if (hasEmail) formattingScore += 40;
    if (hasBullets) formattingScore += 30;
    if (lengthOk) {
      formattingScore += 30;
    } else {
      formattingScore += 15;
    }

    // 4. Impact / action verbs
    const actionVerbs = ['designed', 'developed', 'built', 'architected', 'led', 'managed', 'optimized', 'reduced', 'increased', 'implemented', 'engineered', 'created'];
    let verbCount = 0;
    actionVerbs.forEach(verb => {
      const matches = textLower.match(new RegExp(`\\b${verb}\\b`, 'g'));
      if (matches) verbCount += matches.length;
    });

    const metricsFound = (textLower.match(/%/g) || []).length + (textLower.match(/\b\d+\b/g) || []).length;
    const impactScore = Math.min(100, Math.round((verbCount * 6) + (metricsFound * 2)));

    // Calculate Overall ATS score
    const atsScore = Math.round((skillsScore * 0.40) + (sectionsScore * 0.25) + (formattingScore * 0.20) + (impactScore * 0.15));

    let verdict = 'Fair match, but requires standard keyword alignments and visual sections.';
    if (atsScore >= 85) verdict = 'Excellent match! Strong ATS compatibility index.';
    else if (atsScore >= 70) verdict = 'Good match, but missing core modern keywords and formatting optimizations.';
    else verdict = 'Weak match. Needs significant section updates and core keyword additions.';

    // Generate Suggestions list dynamically
    const suggestions: any[] = [];
    if (missingSkills.length > 0) {
      suggestions.push({
        section: 'Skills',
        tip: `Add missing technology keywords: ${missingSkills.slice(0, 3).join(', ')}. Recruiters filter candidates based on these exact tags.`
      });
    }
    if (missingSections.length > 0) {
      suggestions.push({
        section: 'Structure',
        tip: `Create a dedicated section for: ${missingSections.join(', ')} to ensure ATS parsers do not skip this data.`
      });
    }
    if (!hasEmail) {
      suggestions.push({
        section: 'Contact Info',
        tip: 'Ensure your email address and contact details are clearly listed in the header in plain text.'
      });
    }
    if (verbCount < 5) {
      suggestions.push({
        section: 'Work Experience',
        tip: "Start your responsibility bullet points with strong action verbs (e.g. 'Architected Next.js pages', 'Engineered Redis caching layers') rather than passive descriptions."
      });
    }
    if (metricsFound < 4) {
      suggestions.push({
        section: 'Impact',
        tip: 'Quantify your accomplishments. Instead of listing duties, state the business impact (e.g., "reduced latency by 30%", "managed 5 developers").'
      });
    }

    // Default suggestions fallback if everything is perfect
    if (suggestions.length === 0) {
      suggestions.push({
        section: 'Summary',
        tip: 'Resume formatting and keywords look solid! Keep fine-tuning metrics to capture recruiter attention.'
      });
    }

    // Create keyword checklist array for frontend display
    const keywordAnalysis = requiredSkills.map(reqSkill => {
      const present = presentSkills.some(ps => ps.toLowerCase() === reqSkill.toLowerCase());
      return {
        keyword: reqSkill,
        present,
        importance: reqSkill === 'System Design' || reqSkill === 'React' || reqSkill === 'Node.js' ? 'High' : 'Medium'
      };
    });

    res.json({
      success: true,
      data: {
        fileName,
        targetTitle,
        atsScore,
        verdict,
        metrics: {
          impactScore,
          brevityScore: formattingScore,
          styleScore: sectionsScore,
          skillsScore
        },
        keywordAnalysis,
        suggestions,
        missingSkills,
        parsedInfo: {
          name: req.user?.email.split('@')[0].toUpperCase() || 'SURAJ KUMAR',
          email: req.user?.email || 'user@career.os',
          education: foundSections.includes('Education') ? 'Extracted' : 'Not Found',
          experienceYears: verbCount > 3 ? Math.min(10, Math.round(verbCount / 2)) : 1
        }
      }
    });

  } catch (error: any) {
    console.error('Error in analyzeResume controller:', error);
    res.status(500).json({ success: false, message: error.message });
  }
}
