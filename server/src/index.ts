import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRouter from './routes/auth.router';
import { notFound, errorHandler } from './middlewares/error-handlers';
import dbConnect from './config/db.connect';

dotenv.config();

const port = process.env.PORT || 4001;

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(morgan(process.env.NODE_ENV === 'PROD' ? 'tiny' : 'dev'));
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  })
);

app.use('/api/auth', authRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
  dbConnect();
});
