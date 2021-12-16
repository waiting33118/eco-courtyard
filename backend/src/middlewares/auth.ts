import { NextFunction, Request, Response } from 'express';

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ status: 'error', reason: 'not authenticated' });
    return;
  }
  next();
};

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user?.isAdmin) {
    res.status(403).json({ status: 'error', reason: 'unauthorized' });
    return;
  }
  next();
};

const isRestaurantOwner = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user?.isRegisteredRestaurant) {
    res.status(403).json({ status: 'error', reason: 'unauthorized' });
    return;
  }
  next();
};

export default {
  isAuthenticated,
  isAdmin,
  isRestaurantOwner
};
