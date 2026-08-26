import express from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { query } from '../lib/db';

const router = express.Router();

router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const [allAchievements, userAchievements] = await Promise.all([
      query('SELECT * FROM achievements'),
      query(
        `SELECT ua.*, a.* FROM user_achievements ua
         JOIN achievements a ON ua.achievement_id = a.id
         WHERE ua.user_id = $1`,
        [req.user?.id]
      ),
    ]);

    const achievements = allAchievements.rows.map((achievement: any) => {
      const unlocked = userAchievements.rows.find(
        (ua: any) => ua.achievement_id === achievement.id
      );
      return {
        ...achievement,
        unlocked: !!unlocked,
        unlockedAt: unlocked?.unlocked_at || null,
      };
    });

    res.json(achievements);
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({ error: 'Failed to get achievements' });
  }
});

export default router;
