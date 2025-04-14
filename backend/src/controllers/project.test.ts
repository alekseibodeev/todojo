import prismaMock from '../helpers/__mocks__/prisma.ts';
import type {
  ProjectRequestBody,
  ProjectRequestParams,
} from '../types/project.ts';
import { createProject, deleteProject, editProject } from './project.ts';
import type { Project } from '@prisma/client';
import type { Request, Response } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../helpers/prisma');

describe('controllers/project', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  describe('createProject', () => {
    it('should create new project', async () => {
      const req = {
        body: {
          title: 'test project',
        },
        user: {
          id: 'id',
        },
      } as Request<never, never, ProjectRequestBody>;
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;
      const next = vi.fn();

      prismaMock.project.create.mockResolvedValueOnce({
        title: 'test project',
      } as Project);

      await createProject(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ title: 'test project' });
    });

    it('should throw an error when title is missing', async () => {
      const req = {
        body: {},
      } as Request<never, never, ProjectRequestBody>;
      const res = {} as Response;
      const next = vi.fn();

      await createProject(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0].statusCode).toBe(400);
      expect(next.mock.calls[0][0].message).toBe('Title is required');
    });
  });

  describe('editProject', () => {
    it('should update existsing project', async () => {
      const req = {
        body: {
          title: 'new title',
        },
        user: {
          id: 'id',
        },
        params: {
          projectId: 'project_id',
        },
      } as Request<ProjectRequestParams, never, ProjectRequestBody>;
      const res = {
        json: vi.fn(),
      } as unknown as Response;
      const next = vi.fn();

      prismaMock.project.findUnique.mockResolvedValueOnce({
        title: 'old title',
      } as Project);
      prismaMock.project.update.mockResolvedValueOnce({
        title: 'new title',
      } as Project);

      await editProject(req, res, next);

      expect(res.json).toHaveBeenCalledWith({ title: 'new title' });
    });

    it('should throw an error when title is missing', async () => {
      const req = {
        body: {},
        params: {
          projectId: 'project_id',
        },
      } as Request<ProjectRequestParams, never, ProjectRequestBody>;
      const res = {} as Response;
      const next = vi.fn();

      await editProject(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0].statusCode).toBe(400);
      expect(next.mock.calls[0][0].message).toBe('Title is required');
    });

    it('should thrown an error when project does not belong to user', async () => {
      const req = {
        body: {
          title: 'title',
        },
        user: {
          id: 'id',
        },
        params: {
          projectId: 'project_id',
        },
      } as Request<ProjectRequestParams, never, ProjectRequestBody>;
      const res = {} as Response;
      const next = vi.fn();

      prismaMock.project.findUnique.mockResolvedValueOnce(null);

      await editProject(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0].statusCode).toBe(403);
      expect(next.mock.calls[0][0].message).toBe('Forbidden');
    });
  });

  describe('deleteProject', () => {
    it('should delete existing project', async () => {
      const req = {
        user: {
          id: 'id',
        },
        params: {
          projectId: 'project_id',
        },
      } as Request<ProjectRequestParams, never, never>;
      const res = {
        status: vi.fn().mockReturnThis(),
        send: vi.fn(),
      } as unknown as Response;
      const next = vi.fn();

      prismaMock.project.findUnique.mockResolvedValueOnce({} as Project);
      prismaMock.task.deleteMany.mockResolvedValueOnce({ count: 12 });
      prismaMock.project.delete.mockResolvedValueOnce({} as Project);

      await deleteProject(req, res, next);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('should throw an error when project does not belong to user', async () => {
      const req = {
        user: {
          id: 'id',
        },
        params: {
          projectId: 'project_id',
        },
      } as Request<ProjectRequestParams, never, never>;
      const res = {
        status: vi.fn().mockReturnThis(),
        send: vi.fn(),
      } as unknown as Response;
      const next = vi.fn();

      prismaMock.project.findUnique.mockResolvedValueOnce(null);

      await deleteProject(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0].statusCode).toBe(403);
      expect(next.mock.calls[0][0].message).toBe('Forbidden');
    });
  });
});
