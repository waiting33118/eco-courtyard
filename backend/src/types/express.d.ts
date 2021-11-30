import { User as UserEntity } from '../entities/User';
import { Request, ParamsDictionary } from 'express-serve-static-core';

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User extends UserEntity {}
  }
}

export type AppRequest = Request<
  ParamsDictionary | RequestParams,
  never,
  RequestBody
>;

interface RequestBody
  extends UserReqBody,
    RestaurantReqBody,
    RegionReqBody,
    CuisineReqBody,
    CategoryReqBody,
    CartReqBody {}

interface UserReqBody {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

interface RestaurantReqBody {
  selectedCategory?: string;
  selectedRegion?: string;
  name?: string;
  address?: string;
  startTime?: string;
  closeTime?: string;
}

interface RegionReqBody {
  regionName?: string;
  newRegionName?: string;
}

interface CuisineReqBody {
  cuisineName?: string;
  price?: string;
}

interface CategoryReqBody {
  categoryName?: string;
  newCategoryName?: string;
}

interface CartReqBody {
  cuisineId?: string;
  quantity?: string;
  updatedQuantity?: string;
  cartIds?: number[];
}

interface RequestParams
  extends RestaurantReqParams,
    RegionReqParams,
    CuisineReqParams,
    CategoryReqParams,
    CartReqParams {}

interface RestaurantReqParams {
  restaurantId: string;
}

interface RegionReqParams {
  regionId: string;
}

interface CuisineReqParams {
  cuisineId: string;
}

interface CategoryReqParams {
  categoryId: string;
}

interface CartReqParams {
  cartId: string;
}
