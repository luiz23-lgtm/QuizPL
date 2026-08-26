import express from 'express';
import { query } from '../../lib/db';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const subjectsResult = await query(
      `SELECT s.*, (SELECT COUNT(*) FROM quizzes WHERE subject_id = s.id) as quizzes_count
       FROM subjects s`
    );
    const subjects = subjectsResult.rows.map((subject: any) => ({
      ...subject,
      _count: { quizzes: parseInt(subject.quizzes_count) }
    }));
    res.json(subjects);
  } catch (error) {
    console.error('Get subjects error:', error);
    res.status(500).json({ error: 'Failed to get subjects' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    const result = await query(
      'INSERT INTO subjects (name) VALUES ($1) RETURNING *',
      [name]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Create subject error:', error);
    res.status(500).json({ error: 'Failed to create subject' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const result = await query(
      'UPDATE subjects SET name = $1 WHERE id = $2 RETURNING *',
      [name, parseInt(id)]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update subject error:', error);
    res.status(500).json({ error: 'Failed to update subject' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM subjects WHERE id = $1', [parseInt(id)]);
    res.sendStatus(204);
  } catch (error) {
    console.error('Delete subject error:', error);
    res.status(500).json({ error: 'Failed to delete subject' });
  }
});

export default router;
