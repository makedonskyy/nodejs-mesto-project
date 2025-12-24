import { Request, Response } from 'express';
import { STATUS_CODES, MESSAGES } from '../utils/constants';

const errorHandler = (
  err: { statusCode?: number; message: string },
  req: Request,
  res: Response,
) => {
  const { statusCode = STATUS_CODES.INTERNAL_SERVER_ERROR, message } = err;

  res.status(statusCode).send({
    message:
      statusCode === STATUS_CODES.INTERNAL_SERVER_ERROR
        ? MESSAGES.INTERNAL_SERVER_ERROR
        : message,
  });
};

export default errorHandler;
