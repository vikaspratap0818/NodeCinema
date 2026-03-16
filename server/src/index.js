import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import { apiLimiter } from './middleware/rateLimiter.js';
import errorHandler from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import movieRoutes from './routes/movieRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Security Middleware ───
app.use(helmet({
  contentSecurityPolicy: false, // Disable for dev; configure properly for production
  crossOriginEmbedderPolicy: false
}));
app.use(mongoSanitize()); // Prevent NoSQL injection
app.use(apiLimiter);      // Global rate limiting

// ─── Core Middleware ───
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(cookieParser());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// ─── MongoDB Connection ───
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/movie-platform')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ─── API Routes ───
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/movies', movieRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

// 404 catch-all for unmatched API routes
app.all('/api/*path', (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// ─── Serve Frontend in Production ───
if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use(express.static(path.resolve('client/dist')));

  app.get(/^(?!\/api).+/, (req, res) => {
    res.sendFile(path.resolve('client/dist/index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

// ─── Global Error Handler (MUST be last) ───
app.use(errorHandler);

// ─── Start Server ───
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
