import express from 'express';
import { getUsers, deleteUser, toggleBanUser, toggleFavorite, addWatchHistory } from '../controllers/userController.js';
import protect from '../middleware/authMiddleware.js';
import admin from '../middleware/adminMiddleware.js';

const router = express.Router();

router.route('/').get(protect, admin, getUsers);
router.route('/:id').delete(protect, admin, deleteUser);
router.route('/:id/ban').put(protect, admin, toggleBanUser);

router.post('/favorites', protect, toggleFavorite);
router.post('/history', protect, addWatchHistory);

export default router;
