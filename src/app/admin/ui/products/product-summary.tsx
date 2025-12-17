'use client';

import { lusitana } from '@/app/admin/ui/fonts';
import { useEffect, useState } from 'react';
import { animate } from 'motion/react';
import { useProductSummary } from '@/app/admin/hooks/useProductSummary';
import { ArrowRightCircleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import Spinner from '@/components/spinner/Spinner';

function Card({
  title,
  value,
  onViewMore,
  isLoading
}: {
  title: string;
  value?: number;
  onViewMore?: () => void;
  isLoading: boolean;
}) {
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
      <div className="flex flex-col items-center justify-center ">
        <div className="flex items-start justify-between w-full relative gap-2">
          <h3 className="text-sm p-2 font-bold w-full text-left text-logo-orange-border text-ellipsis overflow-hidden whitespace-nowrap">
            {title}
          </h3>
          {onViewMore && (
            <button
              className="text-sm font-bold text-center text-logo-orange-border hover:bg-white hover:text-logo-orange-border transition-all duration-300 rounded-full p-1"
              onClick={onViewMore}
            >
              <ArrowRightCircleIcon className="w-6 h-6" />
            </button>
          )}
        </div>
        {isLoading ? (
          <Spinner />
        ) : (
          <p
            className={`${lusitana.className} text-2xl px-4 py-8 w-full text-center bg-white rounded-xl`}
          >
            {displayValue}
          </p>
        )}
      </div>
    </div>
  );
}

export default function ProductSummary() {
  const { data, isLoading, error } = useProductSummary();
  const router = useRouter();

  const handleViewProductTags = () => {
    router.push(`/admin/dashboard/product-tags`);
  };

  const handleViewProductTypes = () => {
    router.push(`/admin/dashboard/product-types`);
  };

  if (error) {
    return (
      <div className="rounded-xl overflow-hidden bg-gray-50 shadow-sm p-4">
        <p className="text-center text-red-500">
          {error || 'Failed to load product summary'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      <Card
        title="Products"
        value={data?.totalProducts}
        isLoading={isLoading}
      />
      <Card
        title="Products Types"
        value={data?.totalProductTypes}
        onViewMore={handleViewProductTypes}
        isLoading={isLoading}
      />
      <Card
        title="Products Tags"
        value={data?.totalProductTags}
        onViewMore={handleViewProductTags}
        isLoading={isLoading}
      />
      <Card
        title="Products Images"
        value={data?.totalProductImages}
        isLoading={isLoading}
      />
    </div>
  );
}
