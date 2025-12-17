'use client';

import { lusitana } from '@/app/admin/ui/fonts';
import { useEffect, useState } from 'react';
import { animate } from 'motion/react';
import { useInvoiceSummary } from '@/app/admin/hooks/useInvoiceSummary';
import Spinner from '@/components/spinner/Spinner';
import { formatCurrency } from '@/app/admin/lib/utils';

const Card = ({
  title,
  value,
  isLoading,
  isCurrency = false
}: {
  title: string;
  value?: number;
  isLoading: boolean;
  isCurrency?: boolean;
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, value || 0, {
      duration: 1.5,
      ease: 'easeOut',
      onUpdate: (latest) => {
        setDisplayValue(Math.round(latest || 0));
      }
    });

    return () => controls.stop();
  }, [value]);

  return (
    <div className="rounded-xl overflow-hidden bg-logo-orange-pale-companion shadow-sm p-2">
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center justify-between w-full relative">
          <h3 className="text-sm p-2 font-bold w-full text-left text-logo-orange-border">
            {title}
          </h3>
        </div>
        <p
          className={`${lusitana.className} text-2xl px-4 py-8 w-full text-center bg-white rounded-xl`}
        >
          {isLoading ? (
            <Spinner />
          ) : isCurrency ? (
            formatCurrency(displayValue)
          ) : (
            displayValue
          )}
        </p>
      </div>
    </div>
  );
};

export default function InvoiceSummary() {
  const { data, isLoading, error } = useInvoiceSummary();

  if (error) {
    return (
      <div className="rounded-xl overflow-hidden bg-gray-50 shadow-sm p-4">
        <p className="text-center text-red-500">
          {error || 'Failed to load invoice summary'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card
        title="Invoices Paid"
        value={data?.paidCount}
        isLoading={isLoading}
      />
      <Card
        title="Invoices Pending"
        value={data?.pendingCount}
        isLoading={isLoading}
      />
      <Card
        title="Total Paid Amount"
        value={data?.totalPaidAmount}
        isLoading={isLoading}
        isCurrency={true}
      />
      <Card
        title="Total Pending Amount"
        value={data?.totalPendingAmount}
        isLoading={isLoading}
        isCurrency={true}
      />
    </div>
  );
}
