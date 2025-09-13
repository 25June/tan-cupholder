'use client';

import { useState } from 'react';
import { lusitana } from '@/app/admin/ui/fonts';
import ImageList from '@/app/admin/ui/feature-images/ImageList';
import ObserverLoading from '@/components/observer-loading/ObserverLoading';
import { useImageFeature } from '@/app/admin/hooks/useImageFeature';
import SearchProducts from '@/components/search-products/SearchProducts';
import CreateFeatureImage from '@/app/admin/ui/feature-images/button';
import { FeatureImage } from '@/models/featureImage';

export default function Page() {
  const { images, loading, isEnd, onGetNextPage, onSearch, totalCount } =
    useImageFeature();

  return (
    <main>
      <div className="flex w-full items-center justify-between mb-8">
        <h1 className={`${lusitana.className}  text-xl md:text-2xl`}>
          Feature Images - {totalCount} Images
        </h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <SearchProducts onSearch={onSearch} />
        <CreateFeatureImage />
      </div>
      <div className="mt-4">
        <ImageList images={images} />
      </div>
      <ObserverLoading
        onGetNextPage={onGetNextPage}
        isLoading={loading}
        isEnd={isEnd}
      />
    </main>
  );
}
