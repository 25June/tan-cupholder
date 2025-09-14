'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getImageUrl } from '@/shared/utils/getImageUrl';
import { FeatureImage } from '@/models/featureImage';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';

export default function ImageList({ images }: { images: FeatureImage[] }) {
  const [selectedImages, setSelectedImages] = useState<Record<string, boolean>>(
    {}
  );

  const copyImageUrl = (image: FeatureImage) => {
    navigator.clipboard.writeText(getImageUrl('feature-images', image.name));
  };
  return (
    <div className="columns-3 gap-4">
      {images.map((image) => (
        <div
          key={image.id}
          className={`relative box-border w-full h-full bg-gray-100 mb-4 rounded-md overflow-hidden transition-all duration-100 ${
            !!selectedImages[image.id]
              ? 'outline-2 outline-orange-500 outline-offset-4'
              : 'outline-none'
          }`}
        >
          <Image
            src={getImageUrl('feature-images', image.name)}
            alt={image.name}
            width={500}
            height={500}
            className="w-full h-full"
          />
          <div className="absolute bottom-0 right-0 p-2">
            <input
              type="checkbox"
              checked={!!selectedImages[image.id]}
              onClick={() =>
                setSelectedImages((prev) => ({
                  ...prev,
                  [image.id]: prev[image.id] ? false : true
                }))
              }
              className={`checkbox border-white bg-transparent checked:border-orange-500 checked:bg-white checked:text-orange-500`}
            />
            <button onClick={() => copyImageUrl(image)}>
              <DocumentDuplicateIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
