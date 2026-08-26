import express from 'express';
import { optionalAuthenticateToken, AuthRequest } from '../middleware/auth';
import { query } from '../lib/db';

const router = express.Router();

router.get('/', optionalAuthenticateToken, async (req: AuthRequest, res) => {
  try {
    const usersResult = await query(
      `SELECT u.id, u.name, u.avatar, u.xp, u.level,
        (SELECT COUNT(*) FROM quiz_completions WHERE user_id = u.id) as quizzes_completed
       FROM users u
       ORDER BY u.xp DESC, u.id ASC
       LIMIT 100`
    );

    const users = usersResult.rows.map((user: any) => {
      const quizzesCompleted = parseInt(user.quizzes_completed || '0', 10);
      return {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        xp: user.xp,
        level: user.level,
        quizzesCompleted,
        _count: { quizzesCompleted }
      };
    });

    // Find current user's rank
    let currentUserRank = null;
    if (req.user?.id) {
      const allUsersResult = await query(
        'SELECT id FROM users ORDER BY xp DESC, id ASC'
      );
      const allUsers = allUsersResult.rows;
      const rankIndex = allUsers.findIndex((u: any) => Number(u.id) === Number(req.user?.id));
      if (rankIndex !== -1) {
        currentUserRank = rankIndex + 1;
      }
    }

    const rankedUsers = users.map((user, index) => ({
      ...user,
      rank: index + 1,
    }));

    res.json({ users: rankedUsers, currentUserRank });
  } catch (error) {
    console.error('Get ranking error:', error);
    res.status(500).json({ error: 'Failed to get ranking' });
  }
});

export default router;
