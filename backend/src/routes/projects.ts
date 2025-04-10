import { authenticate } from '../middleware/auth.ts';
import express from 'express';

const projectRouter = express.Router();

projectRouter.use(authenticate);

projectRouter.get('/', () => {
  // Get all projects
});

projectRouter.post('/', () => {
  // Create new project
});

projectRouter.get('/:projectId', () => {
  // Get all tasks related to project with projectId
});

projectRouter.post('/:projectId', () => {
  // Create new task in project with projectId
});

projectRouter.patch('/:projectId', () => {
  // Edit project with projectId
});

projectRouter.delete('/:projectId', () => {
  // Delete project with projectId
  // and all its tasks
});

export default projectRouter;
