import prismaMock from '../helpers/__mocks__/prisma.ts';
import type { ProjectQueryParams } from '../types/project.ts';
import type { TaskQueryParams, TaskRequestBody } from '../types/task.ts';
import { createTask, deleteTask, editTask, getTasks } from './task.ts';
import type { Project, Task } from '@prisma/client';
import type { Request, Response } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../helpers/prisma');

describe('controllers/task', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('getTasks', () => {
    it('should respond with a list of tasks', async () => {
      const req = {
        user: {
          id: 'id',
        },
        query: {
          projectId: 'project_id',
        },
      } as Request<never, never, never, ProjectQueryParams>;
      const res = {
        json: vi.fn(),
      } as unknown as Response;
      const next = vi.fn();

      prismaMock.project.findUnique.mockResolvedValueOnce({} as Project);
      prismaMock.task.findMany.mockResolvedValueOnce([] as Task[]);

      await getTasks(req, res, next);

      expect(res.json).toHaveBeenCalledWith([]);
    });

    it('should throw an error when project does not belong to user', async () => {
      const req = {
        user: {
          id: 'id',
        },
        query: {
          projectId: 'project_id',
        },
      } as Request<never, never, never, ProjectQueryParams>;
      const res = {} as Response;
      const next = vi.fn();

      prismaMock.project.findUnique.mockResolvedValueOnce(null);

      await getTasks(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0].statusCode).toBe(403);
      expect(next.mock.calls[0][0].message).toBe('Forbidden');
    });
  });

  describe('createTask', () => {
    it('should create new task', async () => {
      const req = {
        body: {
          title: 'title',
        },
        user: {
          id: 'id',
        },
        query: {
          projectId: 'project_id',
        },
      } as Request<never, never, TaskRequestBody, ProjectQueryParams>;
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;
      const next = vi.fn();

      prismaMock.project.findUnique.mockResolvedValueOnce({} as Project);
      prismaMock.task.create.mockResolvedValueOnce({ title: 'title' } as Task);

      await createTask(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ title: 'title' });
    });

    it('should throw an error when title is missing', async () => {
      const req = {
        body: {},
        user: {
          id: 'id',
        },
        query: {
          projectId: 'project_id',
        },
      } as Request<never, never, TaskRequestBody, ProjectQueryParams>;
      const res = {} as Response;
      const next = vi.fn();

      await createTask(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0].statusCode).toBe(400);
      expect(next.mock.calls[0][0].message).toBe('Title is required');
    });

    it('should throw an error when project does not belong to user', async () => {
      const req = {
        body: {
          title: 'title',
        },
        user: {
          id: 'id',
        },
        query: {
          projectId: 'project_id',
        },
      } as Request<never, never, TaskRequestBody, ProjectQueryParams>;
      const res = {} as Response;
      const next = vi.fn();

      prismaMock.project.findUnique.mockResolvedValueOnce(null);

      await createTask(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0].statusCode).toBe(403);
      expect(next.mock.calls[0][0].message).toBe('Forbidden');
    });
  });

  describe('editTask', () => {
    it('should be able to change task title', async () => {
      const req = {
        body: {
          title: 'new title',
        },
        user: {
          id: 'id',
        },
        query: {
          taskId: 'task_id',
        },
      } as Request<never, never, TaskRequestBody, TaskQueryParams>;
      const res = {
        json: vi.fn(),
      } as unknown as Response;
      const next = vi.fn();

      prismaMock.task.findUnique.mockResolvedValueOnce({} as Task);
      prismaMock.task.update.mockResolvedValueOnce({
        title: 'new title',
        completed: false,
      } as Task);

      await editTask(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        title: 'new title',
        completed: false,
      });
    });

    it('should be able to complete task', async () => {
      const req = {
        body: {
          completed: true,
        },
        user: {
          id: 'id',
        },
        query: {
          taskId: 'task_id',
        },
      } as Request<never, never, TaskRequestBody, TaskQueryParams>;
      const res = {
        json: vi.fn(),
      } as unknown as Response;
      const next = vi.fn();

      prismaMock.task.findUnique.mockResolvedValueOnce({} as Task);
      prismaMock.task.update.mockResolvedValueOnce({
        title: 'old title',
        completed: true,
      } as Task);

      await editTask(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        title: 'old title',
        completed: true,
      });
    });

    it('should throw an error when no data provided', async () => {
      const req = {
        body: {},
        user: {
          id: 'id',
        },
        query: {
          taskId: 'task_id',
        },
      } as Request<never, never, TaskRequestBody, TaskQueryParams>;
      const res = {} as Response;
      const next = vi.fn();

      await editTask(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0].statusCode).toBe(400);
      expect(next.mock.calls[0][0].message).toBe(
        'Non-empty task field is required',
      );
    });

    it('should throw an error when task does not belong to user', async () => {
      const req = {
        body: {
          title: 'new title',
        },
        user: {
          id: 'id',
        },
        query: {
          taskId: 'task_id',
        },
      } as Request<never, never, TaskRequestBody, TaskQueryParams>;
      const res = {} as Response;
      const next = vi.fn();

      prismaMock.task.findUnique.mockResolvedValueOnce(null);

      await editTask(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0].statusCode).toBe(403);
      expect(next.mock.calls[0][0].message).toBe('Forbidden');
    });
  });

  describe('deleteTask', () => {
    it('should delete task', async () => {
      const req = {
        user: {
          id: 'id',
        },
        query: {
          taskId: 'task_id',
        },
      } as Request<never, never, never, TaskQueryParams>;
      const res = {
        status: vi.fn().mockReturnThis(),
        send: vi.fn(),
      } as unknown as Response;
      const next = vi.fn();

      prismaMock.task.findUnique.mockResolvedValueOnce({} as Task);
      prismaMock.task.delete.mockResolvedValueOnce({} as Task);

      await deleteTask(req, res, next);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('should throw an error when task does not belong to user', async () => {
      const req = {
        user: {
          id: 'id',
        },
        query: {
          taskId: 'task_id',
        },
      } as Request<never, never, never, TaskQueryParams>;
      const res = {} as Response;
      const next = vi.fn();

      prismaMock.task.findUnique.mockResolvedValueOnce(null);

      await deleteTask(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0].statusCode).toBe(403);
      expect(next.mock.calls[0][0].message).toBe('Forbidden');
    });
  });
});
