'use client';

import { useEffect, useState } from 'react';
import { getInvoiceSummary } from '@/app/admin/lib/invoice-summary-actions';

type InvoiceSummary = {
  paidCount: number;
  pendingCount: number;
  totalPaidAmount: number;
  totalPendingAmount: number;
};

export const useInvoiceSummary = () => {
  const [data, setData] = useState<InvoiceSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setIsLoading(true);
        const summary = await getInvoiceSummary();
        setData(summary);
        setError(null);
      } catch (err) {
        setError('Failed to load invoice summary');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummary();
  }, []);

  return { data, isLoading, error };
};
