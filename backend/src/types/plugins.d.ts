interface ImgurData {
  id: string;
  width: number;
  height: number;
  link: string;
}

export interface ImgurResponse {
  data: ImgurData;
}
