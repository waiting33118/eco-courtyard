import { getRepository } from 'typeorm';
import { Cart } from '../entities/Cart';
import { Order } from '../entities/Order';
import { OrderCuisine } from '../entities/OrderCuisine';

const checkout = async (
  totalAmount: number,
  restaurantId: number,
  userId: number,
  cartItems: Cart[]
) => {
  const orderRepo = getRepository(Order);
  const orderCuisineRepo = getRepository(OrderCuisine);

  const orderDetails = cartItems.map((cart) =>
    orderCuisineRepo.create({
      quantity: cart.quantity,
      cuisine: { id: cart.cuisine.id }
    })
  );
  const order = orderRepo.create({
    totalAmount,
    restaurant: { id: restaurantId },
    user: { id: userId },
    orderCuisines: orderDetails
  });

  return await orderRepo.save(order);
};

const getOrdersByUser = async (userId: number) => {
  const orderRepo = getRepository(Order);
  return await orderRepo.find({
    where: { user: { id: userId } },
    relations: ['restaurant', 'orderCuisines', 'orderCuisines.cuisine'],
    order: { created_at: 'DESC' }
  });
};

const getOrdersByRestaurant = async (restaurantId: number) => {
  const orderRepo = getRepository(Order);
  const orders = await orderRepo.find({
    where: { restaurant: { id: restaurantId } },
    relations: ['user', 'orderCuisines', 'orderCuisines.cuisine'],
    order: { created_at: 'DESC' }
  });
  return orders.map((order) => ({ ...order, user: order.user.username }));
};

const editOrder = async (orderId: number, partial: Partial<Order>) => {
  const orderRepo = getRepository(Order);
  return await orderRepo.update(orderId, partial);
};

export default {
  checkout,
  getOrdersByUser,
  getOrdersByRestaurant,
  editOrder
};
