import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';

import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import budgetRoutes from './routes/budgetRoutes.js';
import reportRoutes from './routes/reportRoutes.js';

dotenv.config();
connectDB();

const app = express();

// ---- Security & core middleware ----
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  windowMs: (Number(process.env.RATE_LIMIT_WINDOW_MIN) || 15) * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX) || 200,
  message: { success: false, message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// ---- Routes ----
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Expense Tracker API is running', time: new Date() });
});

app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/reports', reportRoutes);

// ---- Serve frontend in production ----
if (process.env.NODE_ENV === 'production') {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const frontendPath = path.join(__dirname, '..', 'frontend', 'dist');

  app.use(express.static(frontendPath));
  app.get('*', (req, res) => res.sendFile(path.join(frontendPath, 'index.html')));
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
