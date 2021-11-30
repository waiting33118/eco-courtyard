import { NextFunction, Response } from 'express';
import { AppRequest, UserProfile } from '../types';
import { logger } from '../plugins/logger';
import { loggerTopic } from '../utils/loggerTopics';
import { isEmptyString } from '../utils';
import { userService } from '../services';
import { hash } from 'bcrypt';

const addUser = async (req: AppRequest, res: Response) => {
  const { email, password, confirmPassword } = req.body;

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
      }
    });
  } catch (error) {
    logger.error(`[${loggerTopic.USER}] ${error}`);
    res.status(500).json({ status: 'error' });
  }
};

const loginUser = (req: AppRequest, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

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

const getCurrentUser = (req: AppRequest, res: Response) => {
  const {
    id: userId,
    email,
    username,
    isAdmin,
    isRegisteredRestaurant,
    restaurant,
    carts
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  } = req.user!;

  const sessionUser = <UserProfile>{
    userId,
    username,
    email,
    haveStore: isRegisteredRestaurant,
    isAdmin,
    restaurant,
    carts
  };

  res.json({ status: 'success', result: sessionUser });
};

export default {
  addUser,
  loginUser,
  getCurrentUser
};
