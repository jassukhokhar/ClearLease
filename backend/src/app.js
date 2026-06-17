import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/authRoutes.js';
import leaseRoutes from './routes/leaseRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import comparisonRoutes from './routes/comparisonRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// --- Security & core middleware ---
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // allow PDF embeds
  })
);

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// --- Rate limiting ---
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try later.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many auth attempts, please try later.',
  },
});

app.use('/api', apiLimiter);

// --- Static: serve uploaded PDFs ---
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// --- Health check ---
app.get('/api/health', (req, res) =>
  res.json({ success: true, status: 'ok', service: 'ClearLease API' })
);

// --- Routes ---
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/leases', leaseRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/comparisons', comparisonRoutes);

// --- 404 + error handling ---
app.use(notFound);
app.use(errorHandler);

export default app;
