import express from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { query } from '../lib/db';
import pool from '../lib/db';
import { calculateLevel } from './users';

const router = express.Router();

interface QuizAnswer {
  questionId: number;
  selectedOption: string;
}

// Get all published quizzes (with filters)
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { subjectId, search } = req.query;
    const userId = req.user?.id;
    
    let sql = `
      SELECT q.*, s.name as subject_name
      FROM quizzes q
      JOIN subjects s ON q.subject_id = s.id
      WHERE q.published = true
    `;
    const params: any[] = [];

    if (subjectId) {
      sql += ` AND q.subject_id = $${params.length + 1}`;
      params.push(parseInt(subjectId as string));
    }

    if (search) {
      sql += ` AND q.title ILIKE $${params.length + 1}`;
      params.push(`%${search}%`);
    }

    sql += ` ORDER BY q.created_at DESC`;

    const quizzesResult = await query(sql, params);
    const quizzes = await Promise.all(
      quizzesResult.rows.map(async (quiz: any) => {
        const questionsResult = await query(
          'SELECT * FROM questions WHERE quiz_id = $1',
          [quiz.id]
        );
        
        // Check if user completed this quiz
        let completed = false;
        if (userId) {
          const completionResult = await query(
            'SELECT id FROM quiz_completions WHERE user_id = $1 AND quiz_id = $2',
            [userId, quiz.id]
          );
          completed = completionResult.rows.length > 0;
        }
        
        return {
          ...quiz,
          subject: { id: quiz.subject_id, name: quiz.subject_name },
          questions: questionsResult.rows,
          completions: completed ? [{ userId }] : []
        };
      })
    );

    res.json(quizzes);
  } catch (error) {
    console.error('Get quizzes error:', error);
    res.status(500).json({ error: 'Failed to get quizzes' });
  }
});

// Get single quiz with questions
router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const quizId = parseInt(req.params.id as string);
    
    const quizResult = await query(
      `SELECT q.*, s.name as subject_name 
       FROM quizzes q 
       JOIN subjects s ON q.subject_id = s.id 
       WHERE q.id = $1`,
      [quizId]
    );
    const quiz = quizResult.rows[0];

    if (!quiz || !quiz.published) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const questionsResult = await query(
      'SELECT * FROM questions WHERE quiz_id = $1',
      [quizId]
    );

    res.json({
      ...quiz,
      subject: { id: quiz.subject_id, name: quiz.subject_name },
      questions: questionsResult.rows
    });
  } catch (error) {
    console.error('Get quiz error:', error);
    res.status(500).json({ error: 'Failed to get quiz' });
  }
});

// Submit quiz answers
router.post('/:id/submit', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { answers } = req.body;
    const quizId = parseInt(req.params.id as string);
    const userId = req.user?.id as number;

    // Check if already completed
    const existingCompletion = await query(
      'SELECT * FROM quiz_completions WHERE user_id = $1 AND quiz_id = $2',
      [userId, quizId]
    );

    if (existingCompletion.rows.length > 0) {
      const completion = existingCompletion.rows[0];
      const questionsCountResult = await query(
        'SELECT COUNT(*) as count FROM questions WHERE quiz_id = $1',
        [quizId]
      );
      const totalQuestions = parseInt(questionsCountResult.rows[0]?.count || '0', 10);
      const userResult = await query(
        'SELECT id, name, email, role, avatar, xp, level, streak FROM users WHERE id = $1',
        [userId]
      );
      return res.json({
        completion,
        user: userResult.rows[0],
        correctCount: completion.score,
        totalQuestions,
        xpEarned: 0,
        unlockedAchievements: [],
        alreadyCompleted: true
      });
    }

    // Get quiz with questions
    const quizResult = await query(
      'SELECT * FROM quizzes WHERE id = $1',
      [quizId]
    );
    const quiz = quizResult.rows[0];

    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    const questionsResult = await query(
      'SELECT * FROM questions WHERE quiz_id = $1',
      [quizId]
    );
    const questions = questionsResult.rows;

    const normalizeOpt = (val?: any): string => {
      if (!val) return '';
      const str = String(val).trim().toUpperCase();
      if (str === '1' || str === 'OPTIONA' || str === 'OPTION_A') return 'A';
      if (str === '2' || str === 'OPTIONB' || str === 'OPTION_B') return 'B';
      if (str === '3' || str === 'OPTIONC' || str === 'OPTION_C') return 'C';
      if (str === '4' || str === 'OPTIOND' || str === 'OPTION_D') return 'D';
      return str;
    };

    let correctCount = 0;
    let totalXp = 0;
    const userAnswers: Array<{ questionId: number; selectedOption: string; isCorrect: boolean }> = [];

    for (const question of questions) {
      const userAnswer = answers.find(
        (a: QuizAnswer) => a.questionId === question.id
      );
      const normalizedUser = normalizeOpt(userAnswer?.selectedOption);
      const normalizedCorrect = normalizeOpt(question.correct_option);
      const isCorrect = normalizedUser.length > 0 && normalizedUser === normalizedCorrect;

      if (isCorrect) {
        correctCount++;
        totalXp += question.xp_reward;
      }

      userAnswers.push({
        questionId: question.id,
        selectedOption: userAnswer?.selectedOption || '',
        isCorrect,
      });
    }

    // Start transaction using a dedicated client so BEGIN/COMMIT/ROLLBACK
    // are all executed on the same connection from the pool.
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Create answers
      for (const answer of userAnswers) {
        // Only insert if selectedOption is non-empty (unanswered questions are skipped)
        if (answer.selectedOption) {
          await client.query(
            `INSERT INTO answers (user_id, question_id, selected_option, is_correct) 
             VALUES ($1, $2, $3, $4) 
             ON CONFLICT (user_id, question_id) DO UPDATE 
             SET selected_option = $3, is_correct = $4`,
            [userId, answer.questionId, answer.selectedOption, answer.isCorrect]
          );
        }
      }

      // Update user
      const userResult = await client.query(
        'SELECT * FROM users WHERE id = $1',
        [userId]
      );
      const user = userResult.rows[0];
      if (!user) throw new Error('User not found');

      const newXp = user.xp + totalXp;
      const newLevel = calculateLevel(newXp);

      await client.query(
        'UPDATE users SET xp = $1, level = $2, last_activity_date = NOW() WHERE id = $3',
        [newXp, newLevel, userId]
      );

      // Create XP history
      await client.query(
        'INSERT INTO xp_history (user_id, amount, reason) VALUES ($1, $2, $3)',
        [userId, totalXp, `Completed quiz: ${quiz.title}`]
      );

      // Create completion
      const completionResult = await client.query(
        `INSERT INTO quiz_completions (user_id, quiz_id, score) 
         VALUES ($1, $2, $3) 
         RETURNING *`,
        [userId, quizId, correctCount]
      );
      const completion = completionResult.rows[0];

      // Check achievements
      const achievementsResult = await client.query('SELECT * FROM achievements');
      const achievements = achievementsResult.rows;
      const unlockedAchievements: any[] = [];

      for (const achievement of achievements) {
        const alreadyUnlocked = await client.query(
          'SELECT id FROM user_achievements WHERE user_id = $1 AND achievement_id = $2',
          [userId, achievement.id]
        );

        if (alreadyUnlocked.rows.length > 0) continue;

        let unlocked = false;
        switch (achievement.type) {
          case 'FIRST_ACTIVITY':
            unlocked = true;
            break;
          case 'FIRST_QUIZ':
            unlocked = true;
            break;
          case 'QUIZ_COUNT': {
            const quizCountResult = await client.query(
              'SELECT COUNT(*) as count FROM quiz_completions WHERE user_id = $1',
              [userId]
            );
            const quizCount = parseInt(quizCountResult.rows[0].count);
            unlocked = quizCount >= achievement.requirement;
            break;
          }
          case 'STREAK':
            unlocked = user.streak >= achievement.requirement;
            break;
        }

        if (unlocked) {
          await client.query(
            'INSERT INTO user_achievements (user_id, achievement_id) VALUES ($1, $2)',
            [userId, achievement.id]
          );
          unlockedAchievements.push(achievement);
        }
      }

      await client.query('COMMIT');

      const updatedUserResult = await client.query(
        'SELECT id, name, email, role, avatar, xp, level, streak FROM users WHERE id = $1',
        [userId]
      );

      res.json({
        completion: { ...completion, quiz },
        user: updatedUserResult.rows[0],
        correctCount,
        totalQuestions: questions.length,
        xpEarned: totalXp,
        unlockedAchievements,
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Submit quiz error:', error);
    res.status(500).json({
      error: 'Failed to submit quiz',
      detail: error?.message || String(error),
    });
  }
});

export default router;
