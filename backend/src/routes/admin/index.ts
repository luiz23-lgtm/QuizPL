import express from 'express';
import { authenticateToken, requireAdmin } from '../../middleware/auth';
import subjectsRouter from './subjects';
import quizzesRouter from './quizzes';
import questionsRouter from './questions';
import usersRouter from './users';
import dashboardRouter from './dashboard';
import achievementsRouter from './achievements';
import rankingRouter from './ranking';

const router = express.Router();

router.use(authenticateToken, requireAdmin);
router.use('/subjects', subjectsRouter);
router.use('/quizzes', quizzesRouter);
router.use('/questions', questionsRouter);
router.use('/users', usersRouter);
router.use('/dashboard', dashboardRouter);
router.use('/achievements', achievementsRouter);
router.use('/ranking', rankingRouter);

export default router;
