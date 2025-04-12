import HttpError from '../helpers/error.ts';
import { errorHandler } from './error.ts';
import type { NextFunction, Request, Response } from 'express';
import { describe, expect, it, vi } from 'vitest';

describe('middleware/error', () => {
  const req = {} as Request;
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  } as unknown as Response;
  const next = () => ({}) as NextFunction;

  describe('errorHandler', () => {
    it('should respond with proper code and message when http error provided', () => {
      errorHandler(new HttpError(401, 'Unauthorized'), req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: {
          message: 'Unauthorized',
        },
      });
    });

    it('should respond with internal server error when not http error provided', () => {
      errorHandler(new Error('some error'), req, res, next);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: {
          message: 'Internal Server Error',
        },
      });
    });
  });
});
