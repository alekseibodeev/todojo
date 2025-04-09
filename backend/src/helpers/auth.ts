import { config } from '../config/config.ts';
import bcrypt from 'bcrypt';
import type { Request } from 'express';
import jwt from 'jsonwebtoken';

export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, config.tokenSecret, {
    expiresIn: config.tokenExpires,
  });
};

export const verifyToken = (token: string) => {
  const { userId } = jwt.verify(token, config.tokenSecret) as {
    userId: string;
  };
  return userId;
};

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

export const getAuthToken = (req: Request) => {
  return req.headers.authorization?.trim().replace(/^Bearer\s+/i, '');
};
