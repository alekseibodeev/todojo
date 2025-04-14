import HttpError from '../helpers/error.ts';
import prisma from '../helpers/prisma.ts';
import type {
  ProjectRequestBody,
  ProjectRequestParams,
} from '../types/project.ts';
import type { NextFunction, Request, Response } from 'express';

export const getProjects = async (req: Request, res: Response) => {
  const user = req.user!;

  const projects = await prisma.project.findMany({
    where: {
      userId: user.id,
    },
    omit: {
      userId: true,
    },
  });

  res.json(projects);
};

export const createProject = async (
  req: Request<never, never, ProjectRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user!;

    const { title } = req.body;

    if (!title) {
      throw new HttpError(400, 'Title is required');
    }

    const project = await prisma.project.create({
      data: {
        title,
        userId: user.id,
      },
      omit: {
        userId: true,
      },
    });

    res.status(201).json(project);
  } catch (err) {
    return next(err);
  }
};

export const editProject = async (
  req: Request<ProjectRequestParams, never, ProjectRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user!;
    const { projectId } = req.params;
    const { title } = req.body;

    if (!title) {
      throw new HttpError(400, 'Title is required');
    }

    const existingProject = await prisma.project.findUnique({
      where: {
        id: projectId,
        userId: user.id,
      },
    });

    if (!existingProject) {
      throw new HttpError(403, 'Forbidden');
    }

    const project = await prisma.project.update({
      data: {
        title,
      },
      where: {
        id: projectId,
        userId: user.id,
      },
      omit: {
        userId: true,
      },
    });

    res.json(project);
  } catch (err) {
    return next(err);
  }
};

export const deleteProject = async (
  req: Request<ProjectRequestParams, never, never>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user!;
    const { projectId } = req.params;

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
        userId: user.id,
      },
    });

    if (!project) {
      throw new HttpError(403, 'Forbidden');
    }

    await prisma.task.deleteMany({
      where: {
        projectId,
      },
    });

    await prisma.project.delete({
      where: {
        id: projectId,
        userId: user.id,
      },
    });

    res.status(204).send();
  } catch (err) {
    return next(err);
  }
};
