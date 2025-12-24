import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { MESSAGES, STATUS_CODES } from '../utils/constants';

interface IPayload {
  _id: string;
}

const { JWT_SECRET = 'dev-secret-key' } = process.env;

const auth = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(STATUS_CODES.UNAUTHORIZED)
      .send({ message: MESSAGES.AUTH_REQUIRED });
  }

  const token = authorization.replace('Bearer ', '');

  try {
    req.user = jwt.verify(token, JWT_SECRET) as IPayload;
    return next();
  } catch (err) {
    return res
      .status(STATUS_CODES.UNAUTHORIZED)
      .send({ message: MESSAGES.UNAUTHORIZED });
  }
};

export default auth;
