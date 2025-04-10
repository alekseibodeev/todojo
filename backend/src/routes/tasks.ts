import { authenticate } from '../middleware/auth.ts';
import express from 'express';

const taskRouter = express.Router();

taskRouter.use(authenticate);

taskRouter.patch('/:taskId', () => {
  // Edit task
});

taskRouter.delete('/:taskId', () => {
  // Delete task
});

export default taskRouter;
