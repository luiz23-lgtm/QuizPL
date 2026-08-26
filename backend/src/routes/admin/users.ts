import express from 'express';
import bcrypt from 'bcrypt';
import { query } from '../../lib/db';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const usersResult = await query(
      `SELECT u.*,
        (SELECT COUNT(*) FROM quiz_completions WHERE user_id = u.id) as quizzes_completed,
        (SELECT COUNT(*) FROM answers WHERE user_id = u.id) as answers_count
       FROM users u
       ORDER BY u.xp DESC`
    );
    const users = usersResult.rows.map((user: any) => ({
      ...user,
      _count: {
        quizzesCompleted: parseInt(user.quizzes_completed),
        answers: parseInt(user.answers_count)
      }
    }));
    res.json(users);
  } catch (error) {
    console.error('Get admin users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ error: 'Nome, e-mail e senha são obrigatórios' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Senha deve ter no mínimo 6 caracteres' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedRole = role === 'ADMIN' ? 'ADMIN' : 'USER';

    const existing = await query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Este e-mail já está em uso' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role, avatar, xp, level, streak, created_at`,
      [String(name).trim(), normalizedEmail, hashedPassword, normalizedRole]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create admin user error:', error);
    res.status(500).json({ error: 'Falha ao criar usuário' });
  }
});

export default router;
