import prismaMock from '../helpers/__mocks__/prisma.ts';
import { getAuthToken, verifyToken } from '../helpers/auth.ts';
import { authenticate } from './auth.ts';
import type { User } from '@prisma/client';
import type { Request, Response } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../helpers/prisma');
vi.mock('../helpers/auth', () => ({
  getAuthToken: vi.fn(),
  verifyToken: vi.fn(),
}));

describe('middleware/auth', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('authenticate', () => {
    const req = {} as Request;
    const res = {} as Response;
    const next = vi.fn();

    it('should authenticate existing user', async () => {
      vi.mocked(getAuthToken).mockReturnValueOnce('token');
      vi.mocked(verifyToken).mockReturnValueOnce('id');
      prismaMock.user.findUnique.mockResolvedValueOnce({
        id: 'id',
        email: 'test@mail.com',
      } as User);

      await authenticate(req, res, next);

      expect(req.user).toStrictEqual({ id: 'id', email: 'test@mail.com' });
      expect(next).toHaveBeenCalled();
    });

    it('should throw an error when there is no token', async () => {
      vi.mocked(getAuthToken).mockReturnValueOnce(undefined);

      await authenticate(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0].statusCode).toBe(401);
      expect(next.mock.calls[0][0].message).toBe('Authentication required');
    });

    it('should throw an error when there is not valid token', async () => {
      vi.mocked(getAuthToken).mockReturnValueOnce('token');
      vi.mocked(verifyToken).mockImplementation(() => {
        throw new Error('token validation error');
      });

      await authenticate(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0].message).toBe('token validation error');
    });

    it('should throw an error when there is no user', async () => {
      vi.mocked(getAuthToken).mockReturnValueOnce('token');
      vi.mocked(verifyToken).mockReturnValueOnce('id');
      prismaMock.user.findUnique.mockResolvedValueOnce(null);

      await authenticate(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0].statusCode).toBe(401);
      expect(next.mock.calls[0][0].message).toBe('User not found');
    });
  });
});
