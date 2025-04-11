import prismaMock from '../helpers/__mocks__/prisma.ts';
import {
  comparePassword,
  generateToken,
  hashPassword,
} from '../helpers/auth.ts';
import type { AuthRequestBody } from '../types/auth.ts';
import { login, register } from './auth.ts';
import type { User } from '@prisma/client';
import type { Request, Response } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../helpers/prisma');
vi.mock('../helpers/auth', () => ({
  comparePassword: vi.fn(),
  generateToken: vi.fn(),
  hashPassword: vi.fn(),
}));

describe('controllers/auth', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('register', () => {
    it('should create a new user if email is not taken', async () => {
      const req = {
        body: {
          email: 'test@mail.com',
          password: 'password',
        },
      } as Request<never, never, AuthRequestBody>;

      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;

      const next = vi.fn();

      prismaMock.user.findUnique.mockResolvedValueOnce(null);
      prismaMock.user.create.mockResolvedValueOnce({
        id: 'id',
        email: 'test@mail.com',
      } as User);

      vi.mocked(hashPassword).mockResolvedValueOnce('hashedpassword');
      vi.mocked(generateToken).mockReturnValueOnce('token');

      await register(req, res, next);

      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: {
          email: 'test@mail.com',
          password: 'hashedpassword',
        },
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        user: {
          id: 'id',
          email: 'test@mail.com',
        },
        token: 'token',
      });
    });

    it('should throw an error when user already exists', async () => {
      const req = {
        body: {
          email: 'test@mail.com',
          password: 'password',
        },
      } as Request<never, never, AuthRequestBody>;

      const res = {} as Response;

      const next = vi.fn();

      prismaMock.user.findUnique.mockResolvedValueOnce({} as User);

      await register(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0].statusCode).toBe(409);
      expect(next.mock.calls[0][0].message).toBe('User already exists');
    });

    it('should throw an error when email was not provided', async () => {
      const req = {
        body: {
          password: 'password',
        },
      } as Request<never, never, AuthRequestBody>;
      const res = {} as Response;
      const next = vi.fn();

      await register(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0].statusCode).toBe(400);
      expect(next.mock.calls[0][0].message).toBe(
        'Email and password are required',
      );
    });

    it('should throw an error when password was not provided', async () => {
      const req = {
        body: {
          email: 'test@mail.com',
        },
      } as Request<never, never, AuthRequestBody>;
      const res = {} as Response;
      const next = vi.fn();

      await register(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0].statusCode).toBe(400);
      expect(next.mock.calls[0][0].message).toBe(
        'Email and password are required',
      );
    });
  });

  describe('login', () => {
    it('should login existing user', async () => {
      const req = {
        body: {
          email: 'test@mail.com',
          password: 'password',
        },
      } as Request<never, never, AuthRequestBody>;
      const res = {
        json: vi.fn(),
      } as unknown as Response;
      const next = vi.fn();

      prismaMock.user.findUnique.mockResolvedValueOnce({
        id: 'id',
        email: 'test@mail.com',
        password: 'hashedpassword',
      });

      vi.mocked(comparePassword).mockResolvedValueOnce(true);
      vi.mocked(generateToken).mockReturnValueOnce('token');

      await login(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        user: {
          id: 'id',
          email: 'test@mail.com',
        },
        token: 'token',
      });
    });

    it('should throw an error when user not found', async () => {
      const req = {
        body: {
          email: 'test@mail.com',
          password: 'password',
        },
      } as Request<never, never, AuthRequestBody>;
      const res = {} as Response;
      const next = vi.fn();

      prismaMock.user.findUnique.mockResolvedValueOnce(null);

      await login(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0].statusCode).toBe(401);
      expect(next.mock.calls[0][0].message).toBe('Invalid credentials');
    });

    it('should throw an error when password mismatch', async () => {
      const req = {
        body: {
          email: 'test@mail.com',
          password: 'password',
        },
      } as Request<never, never, AuthRequestBody>;
      const res = {} as Response;
      const next = vi.fn();

      prismaMock.user.findUnique.mockResolvedValueOnce({
        password: 'hashedpassword',
      } as User);

      vi.mocked(comparePassword).mockResolvedValueOnce(false);

      await login(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0].statusCode).toBe(401);
      expect(next.mock.calls[0][0].message).toBe('Invalid credentials');
    });

    it('should throw an error when email was not provided', async () => {
      const req = {
        body: {
          password: 'password',
        },
      } as Request<never, never, AuthRequestBody>;
      const res = {} as Response;
      const next = vi.fn();

      await login(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0].statusCode).toBe(400);
      expect(next.mock.calls[0][0].message).toBe(
        'Email and password are required',
      );
    });

    it('should throw an error when password was not provided', async () => {
      const req = {
        body: {
          email: 'test@mail.com',
        },
      } as Request<never, never, AuthRequestBody>;
      const res = {} as Response;
      const next = vi.fn();

      await login(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0].statusCode).toBe(400);
      expect(next.mock.calls[0][0].message).toBe(
        'Email and password are required',
      );
    });
  });
});
