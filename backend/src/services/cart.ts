import { getRepository } from 'typeorm';
import { Cart } from '../entities/Cart';

const addItem = async (
  customerId: number,
  cuisineId: number,
  quantity: number
) => {
  const cartRepo = getRepository(Cart);
  const cart = await cartRepo.findOne({
    where: { cuisine: { id: cuisineId }, customer: { id: customerId } }
  });

  if (!cart) {
    const cart = cartRepo.create({
      cuisine: { id: cuisineId },
      customer: { id: customerId },
      quantity
    });
    return await cartRepo.save(cart);
  }

  return await cartRepo.update(
    { cuisine: { id: cuisineId }, customer: { id: customerId } },
    { quantity }
  );
};

const getCartItemsByUserId = async (userId: number) => {
  const cartRepo = getRepository(Cart);
  return await cartRepo.find({
    where: { customer: { id: userId } },
    relations: ['cuisine', 'cuisine.restaurant'],
    order: { created_at: 'ASC' }
  });
};

const getCartItemsByCartIds = async (cartIds: number[]) => {
  const cartRepo = getRepository(Cart);
  return await cartRepo.findByIds(cartIds, {
    relations: ['cuisine', 'cuisine.restaurant']
  });
};

const editItem = async (cartId: number, updatedQuantity: number) => {
  const cartRepo = getRepository(Cart);
  return await cartRepo.update(cartId, { quantity: updatedQuantity });
};

const deleteItem = async (cartId: number | number[]) => {
  const cartRepo = getRepository(Cart);
  return await cartRepo.delete(cartId);
};

export default {
  addItem,
  getCartItemsByUserId,
  getCartItemsByCartIds,
  editItem,
  deleteItem
};
