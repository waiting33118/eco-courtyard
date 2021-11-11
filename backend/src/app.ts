import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import router from './routes';

const app = express();
const ORIGIN =
  process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : '';

app.use(cors({ origin: ORIGIN, credentials: true }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(router);

export default app;
