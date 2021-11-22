import { IUserProfile } from './controller';
import { NextFunction, Request, Response } from 'express';
import { logger } from '../plugins/logger';
import { loggerTopic } from '../utils/loggerTopics';
import { isEmptyString } from '../utils';
import { userService } from '../services';
import { hash } from 'bcrypt';

type TUserReqBody = {
  email?: string;
  password?: string;
  confirmPassword?: string;
};

const addUser = async (req: Request, res: Response) => {
  const { email, password, confirmPassword } = req.body as TUserReqBody;

  if (
    typeof email === 'undefined' ||
    typeof password === 'undefined' ||
    typeof confirmPassword === 'undefined' ||
    isEmptyString(email) ||
    isEmptyString(password) ||
    isEmptyString(confirmPassword)
  ) {
    res.status(400).json({
      status: 'error',
      reason:
        'Email, Password and Confirm password are required & cannot be empty string'
    });
    return;
  }

  if (password.trim() !== confirmPassword.trim()) {
    res.status(400).json({
      status: 'error',
      reason: 'Password and Confirm password are not match'
    });
    return;
  }

  if (password.trim().length < 8) {
    res.status(400).json({
      status: 'error',
      reason: 'Password must longer or equal than 8 characters'
    });
    return;
  }

  if (await userService.getUserByEmail(email.trim())) {
    res.status(409).json({
      status: 'error',
      reason: 'Email already exists'
    });
    return;
  }

  try {
    const username = email.split('@')[0];
    const hashPassword = await hash(password, 10);
    const user = await userService.addUser(
      email.trim(),
      hashPassword,
      username
    );
    res.json({
      status: 'success',
      result: {
        userId: user.id,
        email: user.email,
        username: user.username,
        haveStore: user.isRegisteredRestaurant,
        isAdmin: user.isAdmin
      } as IUserProfile
    });
  } catch (error) {
    logger.error(`[${loggerTopic.USER}] ${error}`);
    res.status(500).json({ status: 'error' });
  }
};

const loginUser = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body as TUserReqBody;

  if (
    typeof email === 'undefined' ||
    typeof password === 'undefined' ||
    isEmptyString(email) ||
    isEmptyString(password)
  ) {
    res.status(400).json({
      status: 'error',
      reason: 'Email and Password are required & cannot be empty string'
    });
    return;
  }
  next();
};

const getCurrentUser = (req: Request, res: Response) => {
  const { id, email, username, isAdmin, isRegisteredRestaurant, restaurant } =
    req.user as Express.User;

  const sessionUser = {
    userId: id,
    username,
    email,
    haveStore: isRegisteredRestaurant,
    isAdmin,
    restaurant
  } as IUserProfile;

  res.json({ status: 'success', result: sessionUser });
};

export default {
  addUser,
  loginUser,
  getCurrentUser
};
