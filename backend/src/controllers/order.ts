/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Response } from 'express';
import { AppRequest } from '../types';
import { logger } from '../plugins/logger';
import { loggerTopic } from '../utils/loggerTopics';
import { orderService } from '../services';

const getOrdersByUser = async (req: AppRequest, res: Response) => {
  const { id: userId } = req.user!;

  try {
    const orders = await orderService.getOrdersByUser(userId);
    res.json({ status: 'success', result: orders });
  } catch (error) {
    logger.error(`[${loggerTopic.ORDER}] ${error}`);
    res.status(500).json({ status: 'error' });
  }
};

const getOrdersByRestaurant = async (req: AppRequest, res: Response) => {
  const { restaurantId } = req.params;

  try {
    const orders = await orderService.getOrdersByRestaurant(+restaurantId);
    res.json({ status: 'success', result: orders });
  } catch (error) {
    logger.error(`[${loggerTopic.ORDER}] ${error}`);
    res.status(500).json({ status: 'error' });
  }
};

const editOrder = async (req: AppRequest, res: Response) => {
  const { orderId, partial } = req.body;

  if (typeof orderId === 'undefined') {
    res.status(400).json({
      status: 'error',
      reason: 'Order ID is required'
    });
    return;
  }
  if (typeof partial === 'undefined' || Object.keys(partial).length === 0) {
    res.status(400).json({
      status: 'error',
      reason: 'Partial edit order items are required'
    });
    return;
  }

  try {
    const result = await orderService.editOrder(orderId, partial);
    res.json({ status: 'success', result });
  } catch (error) {
    logger.error(`[${loggerTopic.ORDER}] ${error}`);
    res.status(500).json({ status: 'error' });
  }
};

export default {
  getOrdersByUser,
  getOrdersByRestaurant,
  editOrder
};
