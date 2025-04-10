import HttpError from '../helpers/error.ts';
import prisma from '../helpers/prisma.ts';
import type {
  ProjectQueryParams,
  ProjectRequestBody,
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
  req: Request<never, never, ProjectRequestBody, ProjectQueryParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user!;
    const { projectId } = req.query;
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
  req: Request<never, never, never, ProjectQueryParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user!;
    const { projectId } = req.query;

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
        userId: user.id,
      },
    });

    if (!project) {
      throw new HttpError(403, 'Forbidden');
    }

    await Promise.all([
      prisma.task.deleteMany({
        where: {
          projectId,
        },
      }),
      prisma.project.delete({
        where: {
          id: projectId,
          userId: user.id,
        },
      }),
    ]);

    res.status(204).send();
  } catch (err) {
    return next(err);
  }
};
