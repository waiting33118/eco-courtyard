import axios, { AxiosResponse } from 'axios';
import { ImgurResponse } from '../types';

export const uploadImage = async (
  base64Image: string
): Promise<AxiosResponse<ImgurResponse>> => {
  return await axios.post(
    'https://api.imgur.com/3/image',
    {
      image: base64Image
    },
    {
      headers: {
        Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`
      }
    }
  );
};
