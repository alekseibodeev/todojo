import {
  createProject,
  createTask,
  deleteProject,
  editProject,
  getProjects,
  getTasks,
} from '../controllers/project.ts';
import { authenticate } from '../middleware/auth.ts';
import express from 'express';

const projectRouter = express.Router();

projectRouter.use(authenticate);

projectRouter.get('/', getProjects);

projectRouter.post('/', createProject);

projectRouter.get('/:projectId', getTasks);

projectRouter.post('/:projectId', createTask);

projectRouter.patch('/:projectId', editProject);

projectRouter.delete('/:projectId', deleteProject);

export default projectRouter;
