import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Resource not found',
    statusCode: 404,
  });
};

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let errorMessage = process.env.NODE_ENV === 'PROD' ? err.message : err.stack;

  if (err instanceof ZodError) {
    statusCode = 400;
    errorMessage = fromZodError(err).toString();
  }

  if (err instanceof JsonWebTokenError || err instanceof TokenExpiredError) {
    statusCode = 401;
  }

  res.status(statusCode).json({
    success: false,
    message: errorMessage,
    statusCode,
  });
};
