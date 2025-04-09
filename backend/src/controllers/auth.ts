import {
  comparePassword,
  generateToken,
  hashPassword,
} from '../helpers/auth.ts';
import prisma from '../helpers/prisma.ts';
import type { NextFunction, Request, Response } from 'express';

interface RequestBody {
  email?: string;
  password?: string;
}

export const register = async (
  req: Request<never, never, RequestBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new Error(); // TODO
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error(); // TODO
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
  req: Request<never, never, RequestBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new Error(); // TODO
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new Error(); // TODO
    }

    const isPasswordMatch = await comparePassword(password, user.password);

    if (!isPasswordMatch) {
      throw new Error(); // TODO
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
