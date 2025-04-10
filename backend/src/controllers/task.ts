import prisma from '../helpers/prisma.ts';
import type { NextFunction, Request, Response } from 'express';

interface TaskRequestBody {
  title?: string;
  completed?: boolean;
}

interface TaskQueryParams {
  taskId: string;
}

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
      throw new Error(); // TODO
    }

    const existingTask = await prisma.task.findUnique({
      where: {
        id: taskId,
        userId: user.id,
      },
    });

    if (!existingTask) {
      throw new Error(); // TODO
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
      throw new Error(); // TODO
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
