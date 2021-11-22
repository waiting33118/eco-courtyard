import express from 'express';
import passport from '../../plugins/passport';
import multer from 'multer';
import controllers from '../../controllers';
import middlewares from '../../middlewares';
const router = express.Router();
const upload = multer();

/* restaurant */
router.get('/restaurant', controllers.restaurant.getRestaurants);
router.get('/restaurant/:restaurantId', controllers.restaurant.getRestaurant);
router.post(
  '/restaurant/register',
  middlewares.auth.isAuthenticated,
  upload.single('image'),
  controllers.restaurant.addRestaurant
);

/* cuisine */
router.post(
  '/cuisine',
  middlewares.auth.isAuthenticated,
  middlewares.auth.isRestaurantOwner,
  controllers.cuisine.addCuisine
);

/* category */
router.get('/category', controllers.category.getCategories);
router.get('/category/:categoryId', controllers.category.getCategory);
router.post(
  '/category',
  middlewares.auth.isAuthenticated,
  middlewares.auth.isAdmin,
  controllers.category.addCategory
);
router.put(
  '/category/:categoryId',
  middlewares.auth.isAuthenticated,
  middlewares.auth.isAdmin,
  controllers.category.editCategory
);
router.delete(
  '/category/:categoryId',
  middlewares.auth.isAuthenticated,
  middlewares.auth.isAdmin,
  controllers.category.deleteCategory
);

/* region */
router.get('/region', controllers.region.getRegions);
router.get('/region/:regionId', controllers.region.getRegion);
router.post(
  '/region',
  middlewares.auth.isAuthenticated,
  middlewares.auth.isAdmin,
  controllers.region.addRegion
);
router.put(
  '/region/:regionId',
  middlewares.auth.isAuthenticated,
  middlewares.auth.isAdmin,
  controllers.region.editRegion
);
router.delete(
  '/region/:regionId',
  middlewares.auth.isAuthenticated,
  middlewares.auth.isAdmin,
  controllers.region.deleteRegion
);

/*  user */
router.post('/user/signup', controllers.user.addUser);
router.post(
  '/user/login',
  controllers.user.loginUser,
  passport.authenticate('local'),
  middlewares.auth.authSuccessResponse
);
router.get(
  '/user/profile',
  middlewares.auth.isAuthenticated,
  controllers.user.getCurrentUser
);
router.post(
  '/user/logout',
  middlewares.auth.isAuthenticated,
  middlewares.auth.logout
);

export default router;
