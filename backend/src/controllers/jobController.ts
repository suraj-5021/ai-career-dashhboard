import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Job from '../models/Job';
import { isConnected } from '../config/db';
import { mockJobs } from '../config/mockStore';

export async function getJobs(req: AuthRequest, res: Response) {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authorized' });
    return;
  }

  try {
    if (isConnected) {
      const jobs = await Job.find({ userId: req.user.id }).sort({ createdAt: -1 });
      res.json({ success: true, data: jobs });
    } else {
      const jobs = mockJobs.filter(j => j.userId === req.user?.id);
      res.json({ success: true, data: jobs });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function createJob(req: AuthRequest, res: Response) {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authorized' });
    return;
  }

  const { company, position, status, salaryRange, location, jobType, notes } = req.body;

  if (!company || !position) {
    res.status(400).json({ success: false, message: 'Company and position are required' });
    return;
  }

  try {
    if (isConnected) {
      const job = await Job.create({
        userId: req.user.id,
        company,
        position,
        status: status || 'applied',
        salaryRange: salaryRange || '',
        location: location || '',
        jobType: jobType || 'Remote',
        notes: notes || '',
        interviews: []
      });
      res.status(201).json({ success: true, data: job });
    } else {
      const newJob = {
        _id: `mock_job_${Date.now()}`,
        userId: req.user.id,
        company,
        position,
        status: status || 'applied',
        dateApplied: new Date(),
        salaryRange: salaryRange || '',
        location: location || '',
        jobType: jobType || 'Remote',
        notes: notes || '',
        interviews: [],
        createdAt: new Date()
      };
      mockJobs.unshift(newJob);
      res.status(201).json({ success: true, data: newJob });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function updateJob(req: AuthRequest, res: Response) {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authorized' });
    return;
  }

  const { id } = req.params;
  const updateData = req.body;

  try {
    if (isConnected) {
      const job = await Job.findOneAndUpdate(
        { _id: id, userId: req.user.id },
        { $set: updateData },
        { new: true }
      );
      if (!job) {
        res.status(404).json({ success: false, message: 'Job application not found' });
        return;
      }
      res.json({ success: true, data: job });
    } else {
      const idx = mockJobs.findIndex(j => j._id === id && j.userId === req.user?.id);
      if (idx === -1) {
        res.status(404).json({ success: false, message: 'Job application not found' });
        return;
      }
      mockJobs[idx] = {
        ...mockJobs[idx],
        ...updateData
      };
      res.json({ success: true, data: mockJobs[idx] });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function deleteJob(req: AuthRequest, res: Response) {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authorized' });
    return;
  }

  const { id } = req.params;

  try {
    if (isConnected) {
      const job = await Job.findOneAndDelete({ _id: id, userId: req.user.id });
      if (!job) {
        res.status(404).json({ success: false, message: 'Job application not found' });
        return;
      }
      res.json({ success: true, message: 'Job deleted successfully' });
    } else {
      const idx = mockJobs.findIndex(j => j._id === id && j.userId === req.user?.id);
      if (idx === -1) {
        res.status(404).json({ success: false, message: 'Job application not found' });
        return;
      }
      mockJobs.splice(idx, 1);
      res.json({ success: true, message: 'Job deleted successfully' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function addInterview(req: AuthRequest, res: Response) {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authorized' });
    return;
  }

  const { id } = req.params;
  const { stage, date, notes } = req.body;

  if (!stage || !date) {
    res.status(400).json({ success: false, message: 'Stage and Date are required' });
    return;
  }

  try {
    if (isConnected) {
      const job = await Job.findOneAndUpdate(
        { _id: id, userId: req.user.id },
        { $push: { interviews: { stage, date, notes } } },
        { new: true }
      );
      if (!job) {
        res.status(404).json({ success: false, message: 'Job application not found' });
        return;
      }
      res.json({ success: true, data: job });
    } else {
      const idx = mockJobs.findIndex(j => j._id === id && j.userId === req.user?.id);
      if (idx === -1) {
        res.status(404).json({ success: false, message: 'Job application not found' });
        return;
      }
      const newInterview = {
        _id: `mock_int_${Date.now()}`,
        stage,
        date: new Date(date),
        notes: notes || ''
      };
      mockJobs[idx].interviews.push(newInterview);
      res.json({ success: true, data: mockJobs[idx] });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
