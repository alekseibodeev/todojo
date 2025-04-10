import { errorHandler } from './middleware/error.ts';
import authRouter from './routes/auth.ts';
import projectRouter from './routes/projects.ts';
import taskRouter from './routes/tasks.ts';
import express from 'express';

const app = express();

app.use(express.json());

app.use('/auth', authRouter);
app.use('/projects', projectRouter);
app.use('/tasks', taskRouter);

app.use(errorHandler);

export default app;
