import { Request, Response } from 'express';
import { AppRequest } from '../types';
import { logger } from '../plugins/logger';
import { categoryService } from '../services';
import { isEmptyString } from '../utils';
import { loggerTopic } from '../utils/loggerTopics';

const addCategory = async (req: AppRequest, res: Response) => {
  const { categoryName } = req.body;

  if (typeof categoryName === 'undefined' || isEmptyString(categoryName)) {
    res.status(400).json({
      status: 'error',
      reason: 'Category name is required and cannot be empty string'
    });
    return;
  }

  try {
    const newCategory = await categoryService.addCategory(categoryName.trim());
    res.status(201).json({
      status: 'success',
      message: 'Category created',
      result: newCategory
    });
  } catch (error) {
    logger.error(`[${loggerTopic.CATEGORY}] ${error}`);
    res.status(500).json({ status: 'error' });
  }
};

const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await categoryService.getCategories();
    res.json({ status: 'success', result: categories });
  } catch (error) {
    logger.error(`[${loggerTopic.CATEGORY}] ${error}`);
    res.status(500).json({ status: 'error' });
  }
};

const getCategory = async (req: AppRequest, res: Response) => {
  const { categoryId } = req.params;

  if (!Number.isInteger(+categoryId)) {
    res
      .status(400)
      .json({ status: 'error', reason: 'Category id format error' });
    return;
  }

  try {
    const category = await categoryService.getCategory(+categoryId);
    res.json({ status: 'success', result: category });
  } catch (error) {
    logger.error(`[${loggerTopic.CATEGORY}] ${error}`);
    res.status(500).json({ status: 'error' });
  }
};

const editCategory = async (req: AppRequest, res: Response) => {
  const { newCategoryName } = req.body;
  const { categoryId } = req.params;

  if (!Number.isInteger(+categoryId)) {
    res
      .status(400)
      .json({ status: 'error', reason: 'Category id format error' });
    return;
  }
  if (
    typeof newCategoryName === 'undefined' ||
    isEmptyString(newCategoryName)
  ) {
    res.status(400).json({
      status: 'error',
      reason: 'New category name is required and cannot be empty string'
    });
    return;
  }

  try {
    await categoryService.editCategory(+categoryId, newCategoryName.trim());
    res.json({ status: 'success', result: 'Category edited' });
  } catch (error) {
    logger.error(`[${loggerTopic.CATEGORY}] ${error}`);
    res.status(500).json({ status: 'error' });
  }
};

const deleteCategory = async (req: AppRequest, res: Response) => {
  const { categoryId } = req.params;

  if (!Number.isInteger(+categoryId)) {
    res
      .status(400)
      .json({ status: 'error', reason: 'Category id format error' });
    return;
  }

  try {
    await categoryService.deleteCategory(categoryId);
    res.json({ status: 'success', result: 'Category deleted' });
  } catch (error) {
    logger.error(`[${loggerTopic.CATEGORY}] ${error}`);
    res.status(500).json({ status: 'error' });
  }
};

export default {
  addCategory,
  getCategory,
  getCategories,
  editCategory,
  deleteCategory
};
