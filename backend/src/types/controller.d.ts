import { User } from '../entities/User';

type OmitKeys =
  | 'id'
  | 'password'
  | 'isRegisteredRestaurant'
  | 'created_at'
  | 'updated_at';

export interface UserProfile extends Omit<User, OmitKeys> {
  userId: number;
  haveStore: boolean;
}
