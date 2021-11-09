import { getRepository } from 'typeorm';
import { ProductCategory } from '../entities/ProductCategory';

const addCategory = async (categoryName: string) => {
  const categoryRepo = getRepository(ProductCategory);
  const category = categoryRepo.create({ categoryName });
  await categoryRepo.save(category);
  return;
};

const getCategories = async () => {
  const categoryRepo = getRepository(ProductCategory);
  const categories = await categoryRepo.find();
  return categories;
};

const getCategory = async (categoryId: string) => {
  const categoryRepo = getRepository(ProductCategory);
  const category = await categoryRepo.findOne(categoryId);
  return category;
};

const editCategory = async (categoryId: string, newCategoryName: string) => {
  const categoryRepo = getRepository(ProductCategory);
  await categoryRepo.update(categoryId, {
    categoryName: newCategoryName
  });
  return;
};

const deleteCategory = async (categoryId: string) => {
  const categoryRepo = getRepository(ProductCategory);
  await categoryRepo.delete(categoryId);
  return;
};

export default {
  addCategory,
  getCategories,
  getCategory,
  editCategory,
  deleteCategory
};
