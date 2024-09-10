import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import bcrypt from 'bcrypt';

const port = 4000;

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

app.post('/sign-up', (req, res) => {
  const { email, password } = req.body;
});

app.use();

app.listen(port, () => console.log(`server is running on port ${port}`));
