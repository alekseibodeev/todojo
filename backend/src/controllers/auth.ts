import {
  comparePassword,
  generateToken,
  hashPassword,
} from '../helpers/auth.ts';
import HttpError from '../helpers/error.ts';
import prisma from '../helpers/prisma.ts';
import type { AuthRequestBody } from '../types/auth.ts';
import type { NextFunction, Request, Response } from 'express';

export const register = async (
  req: Request<never, never, AuthRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new HttpError(400, 'Email and password are required');
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new HttpError(409, 'User already exists');
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    const token = generateToken(user.id);

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    return next(err);
  }
};

export const login = async (
  req: Request<never, never, AuthRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new HttpError(400, 'Email and password are required');
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new HttpError(401, 'Invalid credentials');
    }

    const isPasswordMatch = await comparePassword(password, user.password);

    if (!isPasswordMatch) {
      throw new HttpError(401, 'Invalid credentials');
    }

    const token = generateToken(user.id);

    res.json({
      user: {
        id: user.id,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    return next(err);
  }
};

export const getUser = (req: Request, res: Response) => {
  const user = req.user!;
  res.json({
    user,
  });
};
