import { Request, Response } from 'express';
import { logger } from '../plugins/logger';
import { loggerTopic } from '../utils/loggerTopics';
import { isEmptyString } from '../utils';
import { cuisineService } from '../services';

type TCuisineReqBody = {
  cuisineName?: string;
  price?: string;
};

const addCuisine = async (req: Request, res: Response) => {
  const { cuisineName, price } = req.body as TCuisineReqBody;
  const {
    restaurant: { id: restaurantId }
  } = req.user as Express.User;

  if (
    typeof cuisineName === 'undefined' ||
    typeof price === 'undefined' ||
    isEmptyString(cuisineName) ||
    isEmptyString(price)
  ) {
    res.status(400).json({
      status: 'error',
      reason: 'Name & price are required and cannot be empty string'
    });
    return;
  }

  try {
    const cuisine = await cuisineService.addCuisine(
      cuisineName.trim(),
      +price,
      restaurantId
    );
    res.status(201).json({
      status: 'success',
      message: 'Cuisine created',
      result: cuisine
    });
  } catch (error) {
    logger.error(`[${loggerTopic.REGION}] ${error}`);
    res.status(500).json({ status: 'error' });
  }
};

export default {
  addCuisine
};
