import express from 'express';
import { registerUser, loginUser, logoutUser } from '../controllers/authController.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { validateRegister, validateLogin } from '../middleware/validate.js';

const router = express.Router();

router.post('/register', authLimiter, validateRegister, registerUser);
router.post('/login', authLimiter, validateLogin, loginUser);
router.post('/logout', logoutUser);

export default router;
