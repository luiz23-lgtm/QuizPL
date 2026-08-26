import express from 'express';
import { query } from '../../lib/db';

const router = express.Router();

// All question routes require authentication and admin role (applied in parent router)

// Get questions by quiz ID
router.get('/quiz/:quizId', async (req, res) => {
  try {
    const questionsResult = await query(
      'SELECT * FROM questions WHERE quiz_id = $1',
      [parseInt(req.params.quizId)]
    );
    res.json(questionsResult.rows);
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({ error: 'Failed to get questions' });
  }
});

router.post('/', async (req, res) => {
  try {
    const {
      quizId,
      text,
      imageUrl,
      optionA,
      optionB,
      optionC,
      optionD,
      correctOption,
      explanation,
      xpReward,
    } = req.body;

    const result = await query(
      `INSERT INTO questions (quiz_id, text, image_url, option_a, option_b, option_c, option_d, correct_option, explanation, xp_reward) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
       RETURNING *`,
      [parseInt(quizId), text, imageUrl, optionA, optionB, optionC, optionD, correctOption, explanation, xpReward ? parseInt(xpReward) : 10]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Create question error:', error);
    res.status(500).json({ error: 'Failed to create question' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      text,
      imageUrl,
      optionA,
      optionB,
      optionC,
      optionD,
      correctOption,
      explanation,
      xpReward,
    } = req.body;

    const result = await query(
      `UPDATE questions 
       SET text = COALESCE($1, text), 
           image_url = COALESCE($2, image_url), 
           option_a = COALESCE($3, option_a), 
           option_b = COALESCE($4, option_b), 
           option_c = COALESCE($5, option_c), 
           option_d = COALESCE($6, option_d), 
           correct_option = COALESCE($7, correct_option), 
           explanation = COALESCE($8, explanation), 
           xp_reward = COALESCE($9, xp_reward) 
       WHERE id = $10 
       RETURNING *`,
      [text, imageUrl, optionA, optionB, optionC, optionD, correctOption, explanation, xpReward ? parseInt(xpReward) : null, parseInt(id)]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update question error:', error);
    res.status(500).json({ error: 'Failed to update question' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const questionId = parseInt(id);

    // Delete answers first to avoid FK constraint violation
    await query('DELETE FROM answers WHERE question_id = $1', [questionId]);
    await query('DELETE FROM questions WHERE id = $1', [questionId]);

    res.sendStatus(204);
  } catch (error) {
    console.error('Delete question error:', error);
    res.status(500).json({ error: 'Failed to delete question' });
  }
});

export default router;
