export interface Image {
  id: string;
  name: string;
  type: string;
  isMain: boolean;
  productId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ImageForm
  extends Omit<Image, 'id' | 'createdAt' | 'updatedAt'> {}
