import { Response } from 'express';
import { AppRequest } from '../types';
import { logger } from '../plugins/logger';
import { loggerTopic } from '../utils/loggerTopics';
import { cuisineService } from '../services';
import { isEmptyString } from '../utils';

const addCuisine = async (req: AppRequest, res: Response) => {
  const { cuisineName, price } = req.body;
  const {
    restaurant: { id: restaurantId }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  } = req.user!;

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

const getCuisine = async (req: AppRequest, res: Response) => {
  const { cuisineId } = req.params;

  try {
    const cuisine = await cuisineService.getCuisine(+cuisineId);
    res.json({ status: 'success', result: cuisine });
  } catch (error) {
    logger.error(`[${loggerTopic.CUISINE}] ${error}`);
    res.status(500).json({ status: 'error' });
  }
};

export default {
  addCuisine,
  getCuisine
};
