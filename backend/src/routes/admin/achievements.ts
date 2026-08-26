import express from 'express';
import { query } from '../../lib/db';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const achievementsResult = await query(
      `SELECT a.*, (SELECT COUNT(*) FROM user_achievements WHERE achievement_id = a.id) as user_achievements_count
       FROM achievements a`
    );
    const achievements = achievementsResult.rows.map((achievement: any) => ({
      ...achievement,
      _count: { userAchievements: parseInt(achievement.user_achievements_count) }
    }));
    res.json(achievements);
  } catch (error) {
    console.error('Get admin achievements error:', error);
    res.status(500).json({ error: 'Failed to get achievements' });
  }
});

export default router;
