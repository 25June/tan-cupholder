export interface Product {
  id: string;
  name: string;
  price: number;
  sale: number;
  type: string;
  image: string;
  stock: number;
  description: string;
}

export interface GetProductsResponse {
  data: Product[];
  total: number;
  isEnd: boolean;
  page: number;
  keywords?: string;
}
