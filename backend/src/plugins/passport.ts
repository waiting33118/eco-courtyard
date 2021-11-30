import passport from 'passport';
import { compare } from 'bcrypt';
import { Strategy } from 'passport-local';
import { userService } from '../services';
import { loggerTopic } from '../utils/loggerTopics';
import { logger } from './logger';

const localStrategy = new Strategy(
  { usernameField: 'email' },
  async (email, password, done) => {
    try {
      const user = await userService.getUserByEmail(email);
      // user not found
      if (!user) return done(null, false);
      // compare password
      if (!(await compare(password, user.password))) return done(null, false);
      done(null, user);
    } catch (error) {
      logger.error(logger.error(`[${loggerTopic.PASSPORT}] ${error}`));
      done(error);
    }
  }
);
passport.use(localStrategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (userId: number, done) => {
  const user = await userService.getUserById(userId);
  if (user) done(null, user);
});

export default passport;
