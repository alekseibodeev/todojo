import authRouter from './routes/auth.ts';
import projectRouter from './routes/projects.ts';
import express from 'express';

const app = express();

app.use(express.json());

app.use('/auth', authRouter);
app.use('/projects', projectRouter);

app.get('/', (_req, res) => {
  res.send('<h1>Hello, World</h1>');
});

export default app;
