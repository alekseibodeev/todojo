import HttpError from '../helpers/error.ts';
import prisma from '../helpers/prisma.ts';
import type { ProjectQueryParams } from '../types/project.ts';
import type { TaskQueryParams, TaskRequestBody } from '../types/task.ts';
import type { NextFunction, Request, Response } from 'express';

export const getTasks = async (
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

    const tasks = await prisma.task.findMany({
      where: {
        projectId,
      },
      omit: {
        userId: true,
        projectId: true,
      },
    });

    res.json(tasks);
  } catch (err) {
    return next(err);
  }
};

export const createTask = async (
  req: Request<never, never, TaskRequestBody, ProjectQueryParams>,
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

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
        userId: user.id,
      },
    });

    if (!project) {
      throw new HttpError(403, 'Forbidden');
    }

    const task = await prisma.task.create({
      data: {
        title,
        userId: user.id,
        projectId,
      },
      omit: {
        userId: true,
        projectId: true,
      },
    });

    res.status(201).json(task);
  } catch (err) {
    return next(err);
  }
};

export const editTask = async (
  req: Request<never, never, TaskRequestBody, TaskQueryParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user!;
    const { taskId } = req.query;
    const editedFields = req.body;

    if (!editedFields || (!editedFields.title && !editedFields.completed)) {
      throw new HttpError(400, 'Non-empty task field is required');
    }

    const existingTask = await prisma.task.findUnique({
      where: {
        id: taskId,
        userId: user.id,
      },
    });

    if (!existingTask) {
      throw new HttpError(403, 'Forbidden');
    }

    const task = await prisma.task.update({
      data: {
        ...editedFields,
      },
      where: {
        id: taskId,
        userId: user.id,
      },
      omit: {
        userId: true,
        projectId: true,
      },
    });

    res.json(task);
  } catch (err) {
    return next(err);
  }
};

export const deleteTask = async (
  req: Request<never, never, never, TaskQueryParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user!;
    const { taskId } = req.query;

    const existingTask = await prisma.task.findUnique({
      where: {
        id: taskId,
        userId: user.id,
      },
    });

    if (!existingTask) {
      throw new HttpError(403, 'Forbidden');
    }

    await prisma.task.delete({
      where: {
        id: taskId,
        userId: user.id,
      },
    });

    res.status(204).send();
  } catch (err) {
    return next(err);
  }
};
