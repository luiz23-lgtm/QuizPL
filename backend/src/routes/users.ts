import express from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { query } from '../lib/db';

const router = express.Router();

// Calculate level based on XP (exponential)
const calculateLevel = (xp: number) => {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
};

const calculateXpForLevel = (level: number) => {
  return Math.pow(level - 1, 2) * 100;
};

router.get('/me', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    
    // Get user
    const userResult = await query(
      'SELECT id, name, email, role, avatar, xp, level, streak, last_activity_date, created_at FROM users WHERE id = $1',
      [userId]
    );
    const user = userResult.rows[0];
    
    if (!user) return res.sendStatus(404);

    // Get achievements
    const achievementsResult = await query(
      `SELECT ua.unlocked_at, a.* FROM user_achievements ua
       JOIN achievements a ON ua.achievement_id = a.id
       WHERE ua.user_id = $1`,
      [userId]
    );

    // Get quiz completions
    const completionsResult = await query(
      `SELECT qc.*, q.title, q.description FROM quiz_completions qc
       JOIN quizzes q ON qc.quiz_id = q.id
       WHERE qc.user_id = $1`,
      [userId]
    );

    // Get XP history
    const xpHistoryResult = await query(
      'SELECT * FROM xp_history WHERE user_id = $1 ORDER BY earned_at DESC LIMIT 20',
      [userId]
    );

    res.json({
      ...user,
      userAchievements: achievementsResult.rows.map(ua => ({
        unlockedAt: ua.unlocked_at,
        achievement: ua
      })),
      quizzesCompleted: completionsResult.rows.map(qc => ({
        ...qc,
        quiz: {
          title: qc.title,
          description: qc.description
        }
      })),
      xpHistory: xpHistoryResult.rows
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

router.put('/me', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { name, avatar } = req.body;
    const result = await query(
      'UPDATE users SET name = COALESCE($1, name), avatar = COALESCE($2, avatar) WHERE id = $3 RETURNING id, name, email, avatar, xp, level',
      [name, avatar, req.user?.id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

export { calculateLevel, calculateXpForLevel };
export default router;
