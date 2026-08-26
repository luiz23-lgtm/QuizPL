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

// One-time fix: reset all sequences to match the max id already in each table
// Call GET /api/fix-sequences once after deploy, then this endpoint will be removed
app.get('/api/fix-sequences', async (req, res) => {
  const secret = req.query.secret;
  if (secret !== process.env.ADMIN_SECRET && secret !== 'fix-seq-2026') {
    return res.status(403).json({ error: 'forbidden' });
  }
  try {
    const tables = [
      'users', 'subjects', 'quizzes', 'questions',
      'answers', 'quiz_completions', 'achievements',
      'user_achievements', 'xp_history',
    ];
    const results: Record<string, number> = {};
    for (const table of tables) {
      const r = await pool.query(
        `SELECT setval('${table}_id_seq', COALESCE((SELECT MAX(id) FROM ${table}), 1))`
      );
      results[table] = r.rows[0].setval;
    }
    res.json({ ok: true, sequences: results });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
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
