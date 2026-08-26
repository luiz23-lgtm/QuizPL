import express from 'express';
import { query } from '../../lib/db';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { subjectId, search } = req.query;
    let sql = `
      SELECT q.*, s.name as subject_name,
        (SELECT COUNT(*) FROM questions WHERE quiz_id = q.id) as questions_count
      FROM quizzes q
      JOIN subjects s ON q.subject_id = s.id
      WHERE 1=1
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
        return {
          ...quiz,
          subject: { id: quiz.subject_id, name: quiz.subject_name },
          questions: questionsResult.rows,
          _count: { questions: parseInt(quiz.questions_count) }
        };
      })
    );
    res.json(quizzes);
  } catch (error) {
    console.error('Get admin quizzes error:', error);
    res.status(500).json({ error: 'Failed to get quizzes' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const quizId = parseInt(req.params.id);
    const quizResult = await query(
      `SELECT q.*, s.name as subject_name 
       FROM quizzes q 
       JOIN subjects s ON q.subject_id = s.id 
       WHERE q.id = $1`,
      [quizId]
    );
    const quiz = quizResult.rows[0];
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

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
    console.error('Get admin quiz error:', error);
    res.status(500).json({ error: 'Failed to get quiz' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, description, imageUrl, subjectId, published } = req.body;
    const result = await query(
      `INSERT INTO quizzes (title, description, image_url, subject_id, published) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [title, description, imageUrl, parseInt(subjectId), published]
    );
    const quiz = result.rows[0];
    const subjectResult = await query(
      'SELECT * FROM subjects WHERE id = $1',
      [quiz.subject_id]
    );
    res.json({ ...quiz, subject: subjectResult.rows[0] });
  } catch (error) {
    console.error('Create quiz error:', error);
    res.status(500).json({ error: 'Failed to create quiz' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, imageUrl, subjectId, published } = req.body;
    const result = await query(
      `UPDATE quizzes 
       SET title = COALESCE($1, title), 
           description = COALESCE($2, description), 
           image_url = COALESCE($3, image_url), 
           subject_id = COALESCE($4, subject_id), 
           published = COALESCE($5, published) 
       WHERE id = $6 
       RETURNING *`,
      [title, description, imageUrl, subjectId ? parseInt(subjectId) : null, published, parseInt(id)]
    );
    const quiz = result.rows[0];
    const subjectResult = await query(
      'SELECT * FROM subjects WHERE id = $1',
      [quiz.subject_id]
    );
    res.json({ ...quiz, subject: subjectResult.rows[0] });
  } catch (error) {
    console.error('Update quiz error:', error);
    res.status(500).json({ error: 'Failed to update quiz' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM quizzes WHERE id = $1', [parseInt(id)]);
    res.sendStatus(204);
  } catch (error) {
    console.error('Delete quiz error:', error);
    res.status(500).json({ error: 'Failed to delete quiz' });
  }
});

export default router;
