import { User as EntityUser } from '../entities/User';

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface User extends EntityUser {}
  }
}
