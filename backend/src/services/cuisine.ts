import { getRepository } from 'typeorm';
import { Cuisine } from '../entities/Cuisine';

const addCuisine = async (
  name: string,
  price: number,
  restaurantId: number
) => {
  const cuisineRepo = getRepository(Cuisine);
  const cuisine = cuisineRepo.create({
    name,
    price,
    restaurant: { id: restaurantId }
  });
  return await cuisineRepo.save(cuisine);
};

const getCuisine = async (cuisineId: number) => {
  const cuisineRepo = getRepository(Cuisine);
  return await cuisineRepo.findOne(cuisineId, { relations: ['restaurant'] });
};

export default {
  addCuisine,
  getCuisine
};
