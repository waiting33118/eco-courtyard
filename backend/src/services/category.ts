import { getRepository } from 'typeorm';
import { RestaurantCategory } from '../entities/RestaurantCategory';

const addCategory = async (categoryName: string) => {
  const categoryRepo = getRepository(RestaurantCategory);
  const category = categoryRepo.create({ categoryName });
  return await categoryRepo.save(category);
};

const getCategories = async () => {
  const categoryRepo = getRepository(RestaurantCategory);
  const categories = await categoryRepo.find();
  return categories;
};

const getCategory = async (categoryId: number) => {
  const categoryRepo = getRepository(RestaurantCategory);
  const category = await categoryRepo.findOne(categoryId);
  return category;
};

const editCategory = async (categoryId: number, newCategoryName: string) => {
  const categoryRepo = getRepository(RestaurantCategory);
  return await categoryRepo.update(categoryId, {
    categoryName: newCategoryName
  });
};

const deleteCategory = async (categoryId: string) => {
  const categoryRepo = getRepository(RestaurantCategory);
  return await categoryRepo.delete(categoryId);
};

export default {
  addCategory,
  getCategories,
  getCategory,
  editCategory,
  deleteCategory
};
