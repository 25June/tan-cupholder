import { ProductImage } from '@/app/admin/lib/definitions';

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
  tagIds?: string[]; // tag ids mapping for many-to-many relationship
}

export interface ProductCustom {
  id: string;
  image: {
    id: string;
    name: string;
  };
  type_name: string;
  name: string;
}

export interface OrderProductDetails extends Product {
  type_name: string;
  image: {
    id: string;
    name: string;
  };
  quantity: number;
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
