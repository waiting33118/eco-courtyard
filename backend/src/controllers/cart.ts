import { Response } from 'express';
import { AppRequest } from '../types';
import { logger } from '../plugins/logger';
import { loggerTopic } from '../utils/loggerTopics';
import { cartService } from '../services';

const addItem = async (req: AppRequest, res: Response) => {
  const { cuisineId, quantity } = req.body;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { id: customerId } = req.user!;

  if (typeof cuisineId === 'undefined' || typeof quantity === 'undefined') {
    res.status(400).json({
      status: 'error',
      reason: 'Cuisine ID & quantity are required'
    });
    return;
  }

  if (!Number.isInteger(+quantity) || +quantity === 0) {
    res.status(400).json({
      status: 'error',
      reason: 'Quantity must be number & cannot be zero'
    });
    return;
  }

  try {
    const cart = await cartService.addItem(customerId, +cuisineId, +quantity);
    res.json({ status: 'success', result: cart });
  } catch (error) {
    logger.error(`[${loggerTopic.CART}] ${error}`);
    res.status(500).json({ status: 'error' });
  }
};

const getCartItems = async (req: AppRequest, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { id: userId } = req.user!;

  try {
    const cartItems = await cartService.getCartItems(userId);
    res.json({ status: 'success', result: cartItems });
  } catch (error) {
    logger.error(`[${loggerTopic.CART}] ${error}`);
    res.status(500).json({ status: 'error' });
  }
};

const editItem = async (req: AppRequest, res: Response) => {
  const { updatedQuantity } = req.body;
  const { cartId } = req.params;

  if (typeof updatedQuantity === 'undefined') {
    res.status(400).json({
      status: 'error',
      reason: 'Updated quantity is required'
    });
    return;
  }

  if (!Number.isInteger(+cartId)) {
    res.status(400).json({ status: 'error', reason: 'Cart id format error' });
    return;
  }

  if (!Number.isInteger(+updatedQuantity) || +updatedQuantity === 0) {
    res.status(400).json({
      status: 'error',
      reason: 'Updated quantity must be number & cannot be zero'
    });
    return;
  }

  try {
    await cartService.editItem(+cartId, +updatedQuantity);
    res.json({ status: 'success', message: 'Cart updated' });
  } catch (error) {
    logger.error(`[${loggerTopic.CART}] ${error}`);
    res.status(500).json({ status: 'error' });
  }
};

const deleteItem = async (req: AppRequest, res: Response) => {
  const { cartId } = req.params;

  if (!Number.isInteger(+cartId)) {
    res.status(400).json({ status: 'error', reason: 'Cart id format error' });
    return;
  }

  try {
    await cartService.deleteItem(+cartId);
    res.json({ status: 'success', message: 'Cart item deleted' });
  } catch (error) {
    logger.error(`[${loggerTopic.CART}] ${error}`);
    res.status(500).json({ status: 'error' });
  }
};

// const checkout = async (req:AppRequest,res: Response) => {

//   try {

//   } catch (error) {
//     logger.error(`[${loggerTopic.CART}] ${error}`);
//     res.status(500).json({ status: 'error' });
//   }
// }

export default {
  addItem,
  getCartItems,
  editItem,
  deleteItem
};
