import express from 'express';
import { query } from '../../lib/db';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const usersResult = await query(
      `SELECT u.*, 
        (SELECT COUNT(*) FROM quiz_completions WHERE user_id = u.id) as quizzes_completed
       FROM users u
       ORDER BY u.xp DESC, u.id ASC
       LIMIT 100`
    );
    const users = usersResult.rows;

    const rankedUsers = await Promise.all(
      users.map(async (user: any, index: number) => {
        const achievementsResult = await query(
          `SELECT a.* FROM user_achievements ua
           JOIN achievements a ON ua.achievement_id = a.id
           WHERE ua.user_id = $1`,
          [user.id]
        );
        const quizzesCompleted = parseInt(user.quizzes_completed || '0', 10);
        return {
          ...user,
          rank: index + 1,
          quizzesCompleted,
          _count: { quizzesCompleted },
          userAchievements: achievementsResult.rows.map((ua: any) => ({
            achievement: ua
          }))
        };
      })
    );

    res.json(rankedUsers);
  } catch (error) {
    console.error('Get admin ranking error:', error);
    res.status(500).json({ error: 'Failed to get ranking' });
  }
});

export default router;
