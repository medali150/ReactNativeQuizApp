import express from 'express';
import {
  getAllQuizzes,
  getQuiz,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  submitQuiz,
  getUserSubmissions,
  getCategories,
  getQuizzesByCategory,
} from '../controllers/quizController';
import { generateQuizWithAI, getAIStatus } from '../controllers/aiQuizController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Public routes (protected by authentication)
router.get('/', protect, getAllQuizzes);
router.get('/categories', protect, getCategories);
router.get('/category/:category', protect, getQuizzesByCategory);
router.get('/submissions', protect, getUserSubmissions);
router.get('/:id', protect, getQuiz);
router.post('/:id/submit', protect, submitQuiz);

// Admin routes
router.post('/', protect, authorize('admin'), createQuiz);
router.put('/:id', protect, authorize('admin'), updateQuiz);
router.delete('/:id', protect, authorize('admin'), deleteQuiz);

// AI routes (Admin only)
router.post('/generate/ai', protect, authorize('admin'), generateQuizWithAI);
router.get('/ai/status', protect, authorize('admin'), getAIStatus);

export default router;
