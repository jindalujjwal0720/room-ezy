import { Request, Response, NextFunction } from 'express';

// utils
import { UnauthorizedError } from '../utils/errors';
import { verifyAccessToken } from '../utils/token';

export type RequestWithUser = Request & { user: { userId: string, role: string } };

export const requireAuth = (
  req: RequestWithUser,
  _: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedError('Unauthorized');
    }

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer') {
      throw new UnauthorizedError('Unauthorized');
    }
    const payload = verifyAccessToken(token);

    if (!payload) {
      throw new UnauthorizedError('Unauthorized');
    }

    req.user = payload as { userId: string, role: string };
    next();
  } catch (err) {
    return next(err);
  }
};

export const requireAdmin = (
  req: RequestWithUser,
  _: Response,
  next: NextFunction
) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      throw new UnauthorizedError('Unauthorized');
    }
    next();
  } catch (err) {
    return next(err);
  }
};
