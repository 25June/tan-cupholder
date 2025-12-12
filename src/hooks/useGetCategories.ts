import { useState } from 'react';
import { ProductType } from '@/models/productType';
import { getPublicCategories } from '@/app/lib/public-categories.action';

export const useGetCategories = () => {
  const [categories, setCategories] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleGetCategories = async () => {
    setLoading(true);
    const categories = await getPublicCategories();
    setCategories(categories as unknown as ProductType[]);
    setLoading(false);
  };

  return { categories, loading, onGetCategories: handleGetCategories };
};
