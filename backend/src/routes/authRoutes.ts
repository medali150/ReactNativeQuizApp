import express from 'express';
import { register, login, getMe, logout, getAllUsers, deleteUser } from '../controllers/authController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

// Admin routes
router.get('/users', protect, authorize('admin'), getAllUsers);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

export default router;
