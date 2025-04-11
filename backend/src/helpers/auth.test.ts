import { getAuthToken } from './auth.ts';
import type { Request } from 'express';
import { describe, expect, it } from 'vitest';

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
});
