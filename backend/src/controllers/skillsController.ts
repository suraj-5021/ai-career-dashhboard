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
    const nameLower = (skillName as string).toLowerCase();
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

    const roadmap = {
      skill: skillName,
      difficulty,
      estimatedHours,
      steps
    };

    res.json({ success: true, data: roadmap });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
