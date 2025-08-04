import { ProductImage } from '@/app/admin/lib/definitions';
import { Image } from './image';

export interface Product {
  id: string;
  name: string;
  price: number;
  sale: number;
  type: string;
  stock: number;
  description: string;
  createdAt?: string;
  updatedAt?: string;
  priority?: number;
}

export interface GetProductsResponse {
  data: ProductResponse[];
  total: number;
  isEnd: boolean;
  page: number;
  keywords?: string;
}

export interface ProductResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  sale: number;
  stock: number;
  type: string;
  product_image: ProductImage;
}
