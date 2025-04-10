import { getAuthToken, verifyToken } from '../helpers/auth.ts';
import HttpError from '../helpers/error.ts';
import prisma from '../helpers/prisma.ts';
import type { NextFunction, Request, Response } from 'express';

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const token = getAuthToken(req);

    if (!token) {
      throw new HttpError(401, 'Authentication required');
    }

    const decoded = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: {
        id: decoded,
      },
      select: {
        id: true,
        email: true,
      },
    });

    if (!user) {
      throw new HttpError(401, 'User not found');
    }

    req.user = user;
    return next();
  } catch (err) {
    return next(err);
  }
};
