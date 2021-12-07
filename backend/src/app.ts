import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import createMemoryStore from 'memorystore';
import passport from './plugins/passport';
import router from './routes';

const app = express();
const ORIGIN =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080'
    : process.env.PRODUCTION_FRONTEND_URL;
const MemoryStore = createMemoryStore(session);

app.set('trust proxy', 1);
app.use(cors({ origin: ORIGIN, credentials: true, maxAge: 600 }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({
    name: 'sid',
    store: new MemoryStore({ checkPeriod: 86_400_000 }),
    secret: process.env.SESSION_SECRET ?? 'default-secret',
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'development' ? false : 'none',
      maxAge: 604_800_000
    },
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(router);

export default app;
