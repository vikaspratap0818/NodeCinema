import express from 'express';
import { getUsers, deleteUser, toggleBanUser, toggleFavorite, addWatchHistory, getUserProfile, updateProfile } from '../controllers/userController.js';
import protect from '../middleware/authMiddleware.js';
import admin from '../middleware/adminMiddleware.js';
import { validateFavorite, validateHistory } from '../middleware/validate.js';

const router = express.Router();

// User profile routes (must be before /:id to avoid conflicts)
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateProfile);

// Admin routes
router.route('/').get(protect, admin, getUsers);
router.route('/:id').delete(protect, admin, deleteUser);
router.route('/:id/ban').put(protect, admin, toggleBanUser);

// Favorites & History
router.post('/favorites', protect, validateFavorite, toggleFavorite);
router.post('/history', protect, validateHistory, addWatchHistory);

export default router;
