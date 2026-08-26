import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../lib/db';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ error: 'Nome, e-mail e senha são obrigatórios' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Senha deve ter no mínimo 6 caracteres' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [normalizedEmail]
    );
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await query(
      `INSERT INTO users (name, email, password, role) 
       VALUES ($1, $2, $3, 'USER') 
       RETURNING id, name, email, role, avatar, xp, level, streak, created_at`,
      [String(name).trim(), normalizedEmail, hashedPassword]
    );

    const user = result.rows[0];
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({ user, token });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Failed to register' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [normalizedEmail]
    );
    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    const { password: _, ...publicUser } = user;

    res.json({ user: publicUser, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

export default router;
