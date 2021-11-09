import express from 'express';
import controllers from '../../controllers';
const router = express.Router();

router.get('/restaurant');
router.post('/restaurant/register', controllers.restaurant.registration);

router.get('/category', controllers.category.getCategories);
router.get('/category/:categoryId', controllers.category.getCategory);
router.post('/category', controllers.category.addCategory);
router.put('/category/:categoryId', controllers.category.editCategory);
router.delete('/category/:categoryId', controllers.category.deleteCategory);

router.get('/region', controllers.region.getRegions);
router.get('/region/:regionId', controllers.region.getRegion);
router.post('/region', controllers.region.addRegion);
router.put('/region/:regionId', controllers.region.editRegion);
router.delete('/region/:regionId', controllers.region.deleteRegion);

export default router;
