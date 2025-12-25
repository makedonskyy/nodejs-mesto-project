import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import { errors } from 'celebrate';
import { login, createUser } from './controllers/users';
import userRouter from './routes/userRoutes';
import cardRouter from './routes/cardRoutes';
import { requestLogger, errorLogger } from './middlewares/logger';
import errorHandler from './middlewares/errorHandler';
import { validateSignin, validateSignup } from './middlewares/validators';
import { MESSAGES } from './utils/constants';
import NotFoundError from './errors/NotFoundError';

dotenv.config();

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();

mongoose.connect(MONGO_URL);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: MESSAGES.TOO_MANY_REQUESTS,
});
app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(requestLogger);

app.post('/signin', validateSignin, login);
app.post('/signup', validateSignup, createUser);

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use('*', (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError(MESSAGES.ROUTE_NOT_FOUND));
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT);
