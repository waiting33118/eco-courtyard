import { getRepository } from 'typeorm';
import { Restaurant } from '../entities/Restaurant';

type RequiredFields = {
  name: string;
  address: string;
  startTime: string;
  closeTime: string;
  imageUrl: string;
  categoryId: number;
  regionId: number;
  ownerId: number;
};

const addRestaurant = async (fields: RequiredFields) => {
  const {
    name,
    address,
    startTime,
    closeTime,
    imageUrl,
    categoryId,
    regionId,
    ownerId
  } = fields;
  const restaurantRepo = getRepository(Restaurant);
  const restaurant = restaurantRepo.create({
    name,
    address,
    startTime,
    closeTime,
    imageUrl,
    category: { id: categoryId },
    region: { id: regionId },
    owner: { id: ownerId }
  });
  return await restaurantRepo.save(restaurant);
};

const getRestaurants = async () => {
  const restaurantRepo = getRepository(Restaurant);
  return await restaurantRepo.find({ relations: ['category', 'region'] });
};

const getRestaurant = async (restaurantId: number) => {
  const restaurantRepo = getRepository(Restaurant);
  return await restaurantRepo.findOne(restaurantId, {
    relations: ['category', 'region']
  });
};

export default { addRestaurant, getRestaurants, getRestaurant };
