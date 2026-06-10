import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Skill from '../models/Skill';
import { isConnected } from '../config/db';
import { mockSkills } from '../config/mockStore';

export async function getSkills(req: AuthRequest, res: Response) {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authorized' });
    return;
  }

  try {
    if (isConnected) {
      const skills = await Skill.find({ userId: req.user.id });
      res.json({ success: true, data: skills });
    } else {
      const skills = mockSkills.filter(s => s.userId === req.user?.id);
      res.json({ success: true, data: skills });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function createSkill(req: AuthRequest, res: Response) {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authorized' });
    return;
  }

  const { name, level, targetLevel, category } = req.body;

  if (!name || !category) {
    res.status(400).json({ success: false, message: 'Name and Category are required' });
    return;
  }

  try {
    if (isConnected) {
      const skill = await Skill.create({
        userId: req.user.id,
        name,
        level: level || 10,
        targetLevel: targetLevel || 80,
        category,
        certifications: []
      });
      res.status(201).json({ success: true, data: skill });
    } else {
      const newSkill = {
        _id: `mock_skill_${Date.now()}`,
        userId: req.user.id,
        name,
        level: level || 10,
        targetLevel: targetLevel || 80,
        category,
        certifications: [],
        createdAt: new Date()
      };
      mockSkills.push(newSkill);
      res.status(201).json({ success: true, data: newSkill });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getRoadmap(req: AuthRequest, res: Response) {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authorized' });
    return;
  }

  const { skillName } = req.query;

  if (!skillName) {
    res.status(400).json({ success: false, message: 'Skill name is required' });
    return;
  }

  try {
    // Generate a premium learning roadmap structure
    const roadmap = {
      skill: skillName,
      difficulty: 'Intermediate to Advanced',
      estimatedHours: 45,
      steps: [
        {
          id: 1,
          title: 'Core Concepts & Paradigms',
          description: `Deep dive into advanced concurrency models, design patterns, and asynchronous workflows in ${skillName}.`,
          duration: 'Week 1-2',
          resources: ['Official Documentation', 'Recommended Book: Advanced Patterns'],
          status: 'completed'
        },
        {
          id: 2,
          title: 'Performance Optimization',
          description: 'Memory profiling, debugging CPU usage, analyzing network operations, and caching mechanisms.',
          duration: 'Week 3',
          resources: ['Chrome DevTools guide', 'Server Benchmarking tutorials'],
          status: 'current'
        },
        {
          id: 3,
          title: 'Integration & Testing Pipelines',
          description: 'Configuring test suites, implementing end-to-end integration flows, and automating deployment checks.',
          duration: 'Week 4',
          resources: ['CI/CD integration checklists'],
          status: 'pending'
        },
        {
          id: 4,
          title: 'Real-world Capstone Deployment',
          description: 'Deploying a production-grade load-tested service on cloud infrastructures with auto-monitoring alerts.',
          duration: 'Week 5',
          resources: ['AWS/Vercel guides', 'Grafana Setup Checklist'],
          status: 'pending'
        }
      ]
    };

    res.json({ success: true, data: roadmap });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
