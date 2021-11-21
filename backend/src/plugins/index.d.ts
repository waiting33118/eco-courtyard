import { User as EntityUser } from '../entities/User';

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface User extends EntityUser {}
  }
}

interface ImgurData {
  id: string;
  width: number;
  height: number;
  link: string;
}
export interface ImgurResponse {
  data: ImgurData;
}
