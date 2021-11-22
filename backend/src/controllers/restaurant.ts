import { Request, Response } from 'express';
import { uploadImage } from '../plugins/imgur';
import { logger } from '../plugins/logger';
import { restaurantService, userService } from '../services';
import { isEmptyString } from '../utils';
import { loggerTopic } from '../utils/loggerTopics';

type TRestaurantReqBody = {
  selectedCategory?: string;
  selectedRegion?: string;
  name?: string;
  address?: string;
  startTime?: string;
  closeTime?: string;
};

type TRestaurantReqParam = {
  restaurantId: string;
};

const addRestaurant = async (req: Request, res: Response) => {
  const {
    selectedCategory,
    selectedRegion,
    name,
    address,
    startTime,
    closeTime
  } = req.body as TRestaurantReqBody;
  const image = req.file;
  const { id: userId } = req.user as Express.User;
  let imageUrl = '';

  if (
    typeof selectedCategory === 'undefined' ||
    typeof selectedRegion === 'undefined' ||
    typeof name === 'undefined' ||
    typeof address === 'undefined' ||
    typeof startTime === 'undefined' ||
    typeof closeTime === 'undefined' ||
    isEmptyString(selectedCategory) ||
    isEmptyString(selectedRegion) ||
    isEmptyString(address) ||
    isEmptyString(startTime) ||
    isEmptyString(closeTime)
  ) {
    res.status(400).json({
      status: 'error',
      reason: 'Fields are required and cannot be empty string'
    });
    return;
  }

  if (!image?.mimetype.includes('image')) {
    res
      .status(400)
      .json({ status: 'error', reason: 'Only accept type of image file' });
    return;
  }

  // upload image to IMGUR
  if (image) {
    const encodeImage = image.buffer.toString('base64');
    try {
      const { data } = await uploadImage(encodeImage);
      imageUrl = data.data.link;
    } catch (error) {
      logger.error(`[${loggerTopic.IMGUR}] ${error}`);
      res.status(500).json({ status: 'error' });
      return;
    }
  }

  try {
    await restaurantService.addRestaurant({
      name: name.trim(),
      address: address.trim(),
      startTime,
      closeTime,
      imageUrl,
      categoryId: +selectedCategory,
      regionId: +selectedRegion,
      ownerId: userId
    });
  } catch (error) {
    logger.error(`[${loggerTopic.RESTAURANT}] ${error}`);
    res.status(500).json({ status: 'error' });
    return;
  }

  try {
    await userService.editUser(userId, {
      isRegisteredRestaurant: true
    });
  } catch (error) {
    logger.error(`[${loggerTopic.USER}] ${error}`);
    res.status(500).json({ status: 'error' });
    return;
  }

  res.status(201).json({ status: 'success', message: 'Restaurant created' });
};

const getRestaurants = async (req: Request, res: Response) => {
  try {
    const restaurants = await restaurantService.getRestaurants();
    res.json({ status: 'success', result: restaurants });
  } catch (error) {
    logger.error(`[${loggerTopic.RESTAURANT}] ${error}`);
    res.status(500).json({ status: 'error' });
  }
};

const getRestaurant = async (req: Request, res: Response) => {
  const { restaurantId } = req.params as TRestaurantReqParam;

  try {
    const restaurant = await restaurantService.getRestaurant(+restaurantId);
    res.json({ status: 'success', result: restaurant });
  } catch (error) {
    logger.error(`[${loggerTopic.RESTAURANT}] ${error}`);
    res.status(500).json({ status: 'error' });
  }
};

export default {
  addRestaurant,
  getRestaurants,
  getRestaurant
};
