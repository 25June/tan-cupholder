export interface FeatureImage {
  id: string;
  name: string;
  type: string;
  createdAt?: string;
}

export interface FeatureImageForm
  extends Omit<FeatureImage, 'id' | 'createdAt'> {}
