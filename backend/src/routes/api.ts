import { Router } from 'express';
import multer from 'multer';
import { protect, adminOnly } from '../middleware/authMiddleware';
import * as authController from '../controllers/authController';
import * as jobController from '../controllers/jobController';
import * as resumeController from '../controllers/resumeController';
import * as skillsController from '../controllers/skillsController';
import * as prepController from '../controllers/prepController';
import * as notificationController from '../controllers/notificationController';
import * as adminController from '../controllers/adminController';
import * as chatController from '../controllers/chatController';

const router = Router();

// Multer configuration for memory uploads (Simulating Resume Parsing)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// ==========================================
// PUBLIC ROUTES
// ==========================================
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/refresh', authController.refresh);

// ==========================================
// PROTECTED ROUTES (Requires Login)
// ==========================================
router.use(protect as any); // Apply protection to all routes below this line

// Chat Assistant
router.post('/chat', chatController.chat);

// Auth profile updates
router.get('/auth/me', authController.getMe);
router.put('/auth/profile', authController.updateProfile);

// Job Applications (Tracker)
router.get('/jobs', jobController.getJobs);
router.post('/jobs', jobController.createJob);
router.put('/jobs/:id', jobController.updateJob);
router.delete('/jobs/:id', jobController.deleteJob);
router.post('/jobs/:id/interviews', jobController.addInterview);

// AI Resume Analyzer
router.post('/resume/analyze', upload.single('resume'), resumeController.analyzeResume);

// Skills Dashboard
router.get('/skills', skillsController.getSkills);
router.post('/skills', skillsController.createSkill);
router.get('/skills/roadmap', skillsController.getRoadmap);

// Interview Preparation
router.get('/interview/questions', prepController.getQuestions);
router.post('/interview/questions', prepController.addQuestion);
router.post('/interview/questions/:id/answer', prepController.submitAnswer);

// Notifications
router.get('/notifications', notificationController.getNotifications);
router.put('/notifications/:id/read', notificationController.markAsRead);
router.put('/notifications/read-all', notificationController.markAllAsRead);

// ==========================================
// ADMIN-ONLY ROUTES (Requires Admin Role)
// ==========================================
router.get('/admin/metrics', adminOnly as any, adminController.getSystemMetrics);
router.get('/admin/users', adminOnly as any, adminController.getUsersAdmin);
router.put('/admin/users/:id/role', adminOnly as any, adminController.updateUserRole);

export default router;
