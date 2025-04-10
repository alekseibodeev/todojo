import { deleteTask, editTask } from '../controllers/task.ts';
import { authenticate } from '../middleware/auth.ts';
import express from 'express';

const taskRouter = express.Router();

taskRouter.use(authenticate);

taskRouter.patch('/:taskId', editTask);

taskRouter.delete('/:taskId', deleteTask);

export default taskRouter;
