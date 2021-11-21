import { Restaurant } from '../entities/Restaurant';

export interface IUserProfile {
  userId: number;
  email: string;
  username: string;
  haveStore: boolean;
  isAdmin: boolean;
  restaurant: Restaurant;
}
