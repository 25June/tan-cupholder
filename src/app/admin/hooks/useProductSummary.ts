'use client';

import { useEffect, useState } from 'react';
import {
  fetchProductSummary,
  ProductSummaryData
} from '../lib/actions/product-summary.actions';

export const useProductSummary = () => {
  const [data, setData] = useState<ProductSummaryData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const summaryData = await fetchProductSummary();
        setData(summaryData);
      } catch (err) {
        console.error('Failed to load product summary:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return {
    data,
    isLoading,
    error
  };
};
