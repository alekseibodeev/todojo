import { config } from '../config/config.ts';
import HttpError from './error.ts';
import bcrypt from 'bcrypt';
import type { Request } from 'express';
import jwt from 'jsonwebtoken';

export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, config.tokenSecret, {
    expiresIn: config.tokenExpires,
  });
};

export const verifyToken = (token: string) => {
  try {
    const { userId } = jwt.verify(token, config.tokenSecret) as {
      userId: string;
    };
    return userId;
  } catch {
    throw new HttpError(401, 'Unauthorized');
  }
};

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

export const getAuthToken = (req: Request) => {
  const authHeader = req.headers.authorization || '';
  const isValidAuthHeader = /^\s*Bearer\s+\w+\s*$/i.test(authHeader);
  if (isValidAuthHeader) {
    return authHeader.trim().replace(/^Bearer\s+/i, '');
  }
};
