import { getAuthToken, verifyToken } from './auth.ts';
import type { Request } from 'express';
import jwt from 'jsonwebtoken';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('jsonwebtoken', () => ({
  default: {
    verify: vi.fn((token: string) => {
      if (token === 'valid') return { userId: 'id' };
      throw new Error();
    }),
  },
}));

vi.mock('../config/config', () => ({
  config: {
    tokenSecret: 'secret',
  },
}));

describe('helpers/auth', () => {
  const token = 'jsonwebtoken';

  describe('getAuthToken', () => {
    it('should return token when header is in the standard format', () => {
      const req = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      } as Request;

      expect(getAuthToken(req)).toBe(token);
    });

    it('should return token when header is in a different case', () => {
      const req = {
        headers: {
          authorization: `bearer ${token}`,
        },
      } as Request;

      expect(getAuthToken(req)).toBe(token);
    });

    it('should return token when header has extra whitespace', () => {
      const req = {
        headers: {
          authorization: `    bearer    ${token}   `,
        },
      } as Request;

      expect(getAuthToken(req)).toBe(token);
    });

    it('should be undefined when header does not start with Bearer', () => {
      const req = {
        headers: {
          authorization: `Base ${token}`,
        },
      } as Request;

      expect(getAuthToken(req)).toBeUndefined();
    });

    it('should be undefined when auth header is missing', () => {
      const req = {
        headers: {},
      } as Request;

      expect(getAuthToken(req)).toBeUndefined();
    });
  });

  describe('verifyToken', () => {
    beforeEach(() => {
      vi.resetAllMocks();
    });

    it('should return user id when token is valid', () => {
      const userId = verifyToken('valid');
      expect(jwt.verify).toHaveBeenCalledWith('valid', 'secret');
      expect(userId).toBe('id');
    });

    it('shoudl throw an error when token is invalid', () => {
      expect(() => verifyToken('invalid')).toThrow();
    });
  });
});
