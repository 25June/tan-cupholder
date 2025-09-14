'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getImageUrl } from '@/shared/utils/getImageUrl';
import { FeatureImage } from '@/models/featureImage';

export default function ImageList({ images }: { images: FeatureImage[] }) {
  const [selectedImages, setSelectedImages] = useState<Record<string, boolean>>(
    {}
  );
  return (
    <div className="columns-3 gap-4">
      {images.map((image) => (
        <button
          key={image.id}
          className={`relative box-border w-full h-full bg-gray-100 mb-4 rounded-md overflow-hidden transition-all duration-100 ${
            !!selectedImages[image.id]
              ? 'outline-2 outline-orange-500 outline-offset-4'
              : 'outline-none'
          }`}
          onClick={() =>
            setSelectedImages((prev) => ({
              ...prev,
              [image.id]: prev[image.id] ? false : true
            }))
          }
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
              className={`checkbox border-white bg-transparent checked:border-orange-500 checked:bg-white checked:text-orange-500`}
            />
          </div>
        </button>
      ))}
    </div>
  );
}
