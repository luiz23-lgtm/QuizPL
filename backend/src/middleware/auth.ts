import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { query } from '../lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      email: string;
    };

    const result = await query(
      'SELECT id, email, role FROM users WHERE id = $1',
      [decoded.id]
    );
    const user = result.rows[0];

    if (!user) {
      return res.status(403).json({ error: 'Usuário não encontrado' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(403).json({ error: 'Token inválido ou expirado' });
  }
};

export const optionalAuthenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      email: string;
    };

    const result = await query(
      'SELECT id, email, role FROM users WHERE id = $1',
      [decoded.id]
    );
    const user = result.rows[0];

    if (user) {
      req.user = user;
    }
  } catch (err) {
    // Ignore invalid token for optional auth
  }
  next();
};

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== 'ADMIN') {
    return res.sendStatus(403);
  }
  next();
};
