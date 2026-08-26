import express from 'express';
import { query } from '../../lib/db';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [totalUsers, totalQuizzes, totalQuestions, totalAnswers] =
      await Promise.all([
        query('SELECT COUNT(*) as count FROM users'),
        query('SELECT COUNT(*) as count FROM quizzes'),
        query('SELECT COUNT(*) as count FROM questions'),
        query('SELECT COUNT(*) as count FROM answers'),
      ]);

    res.json({
      totalUsers: parseInt(totalUsers.rows[0].count),
      totalQuizzes: parseInt(totalQuizzes.rows[0].count),
      totalQuestions: parseInt(totalQuestions.rows[0].count),
      totalAnswers: parseInt(totalAnswers.rows[0].count),
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ error: 'Failed to get dashboard data' });
  }
});

export default router;
