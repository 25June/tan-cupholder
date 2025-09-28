'use client';

import { lusitana } from '@/app/admin/ui/fonts';
import ImageList from '@/app/admin/ui/feature-images/ImageList';
import ObserverLoading from '@/components/observer-loading/ObserverLoading';
import { useImageFeature } from '@/app/admin/hooks/useImageFeature';
import SearchProducts from '@/components/search-products/SearchProducts';
import CreateFeatureImage, {
  DeleteFeatureImage
} from '@/app/admin/ui/feature-images/button';
import { FeatureImage } from '@/models/featureImage';
import { useState } from 'react';
import { XCircleIcon } from '@heroicons/react/24/outline';

export default function Page() {
  const {
    images,
    loading,
    isEnd,
    onGetNextPage,
    onSearch,
    totalCount,
    onDelete
  } = useImageFeature();
  const [selectedImages, setSelectedImages] = useState<
    Record<string, FeatureImage | undefined>
  >({});
  return (
    <main>
      <div className="flex w-full items-center justify-between mb-8">
        <h1 className={`${lusitana.className}  text-xl md:text-2xl`}>
          Feature Images - {totalCount} images
        </h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <SearchProducts onSearch={onSearch} />
        <CreateFeatureImage />
        <DeleteFeatureImage
          images={selectedImages}
          callback={() => {
            onDelete(Object.keys(selectedImages));
            setSelectedImages({});
          }}
        />
        {Object.values(selectedImages).length > 0 && (
          <button
            className="btn btn-square"
            onClick={() => setSelectedImages({})}
          >
            <XCircleIcon className="w-6 h-6" />
          </button>
        )}
      </div>
      <div className="mt-4">
        <ImageList
          images={images}
          selectedImages={selectedImages}
          setSelectedImages={setSelectedImages}
        />
      </div>
      <ObserverLoading
        onGetNextPage={onGetNextPage}
        isLoading={loading}
        isEnd={isEnd}
      />
    </main>
  );
}
