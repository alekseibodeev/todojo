import HttpError from '../helpers/error.ts';
import type { NextFunction, Request, Response } from 'express';

export const errorHandler = (
  err: Error | HttpError,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) => {
  const isHttpError = err instanceof HttpError;
  const statusCode = isHttpError ? err.statusCode : 500;
  const message = isHttpError ? err.message : 'Internal Server Error';

  res.status(statusCode).json({
    error: {
      message,
    },
  });
};
