import { getUser, login, register } from '../controllers/auth.ts';
import { authenticate } from '../middleware/auth.ts';
import express from 'express';

const authRouter = express.Router();

authRouter.post('/register', register);

authRouter.post('/login', login);

authRouter.get('/me', authenticate, getUser);

export default authRouter;
