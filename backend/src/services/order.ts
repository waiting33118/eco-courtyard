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

export default {
  checkout
};
