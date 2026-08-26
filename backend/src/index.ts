import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import authRouter from './routes/auth';
import usersRouter from './routes/users';
import quizzesRouter from './routes/quizzes';
import rankingRouter from './routes/ranking';
import achievementsRouter from './routes/achievements';
import adminRouter from './routes/admin';
import pool from './lib/db';
const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/quizzes', quizzesRouter);
app.use('/api/ranking', rankingRouter);
app.use('/api/achievements', achievementsRouter);
app.use('/api/admin', adminRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  try {
    await pool.connect();
    console.log('Connected to PostgreSQL database');
  } catch (error) {
    console.error('Failed to connect to database:', error);
  }
});
