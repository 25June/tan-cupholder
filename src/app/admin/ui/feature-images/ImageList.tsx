'use client';

import Image from 'next/image';
import { getImageUrl } from '@/shared/utils/getImageUrl';
import { FeatureImage } from '@/models/featureImage';
import {
  ClipboardDocumentCheckIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline';
import { Dispatch, SetStateAction } from 'react';

export default function ImageList({
  images,
  selectedImages,
  setSelectedImages
}: {
  images: FeatureImage[];
  selectedImages: Record<string, FeatureImage | undefined>;
  setSelectedImages: Dispatch<
    SetStateAction<Record<string, FeatureImage | undefined>>
  >;
}) {
  const copyImageUrl = (
    e: React.MouseEvent<HTMLButtonElement>,
    image: FeatureImage
  ) => {
    navigator.clipboard.writeText(getImageUrl('feature-images', image.name));
    setTimeout(() => {
      const input = document.getElementById(`copy-${image.id}`);
      if (input) {
        (input as HTMLInputElement).checked = false;
      }
    }, 2000);
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
          <div className="absolute bottom-0 right-0 p-2 flex gap-2 width-full justify-between">
            <button onClick={(e) => copyImageUrl(e, image)}>
              <label className="swap swap-rotate">
                {/* this hidden checkbox controls the state */}
                <input id={`copy-${image.id}`} type="checkbox" />

                {/* Copy icon */}
                <ClipboardDocumentIcon className="swap-off w-6 h-6 text-white" />

                {/* Copied icon */}
                <ClipboardDocumentCheckIcon className="swap-on w-6 h-6 text-green-500" />
              </label>
            </button>
            <input
              type="checkbox"
              checked={!!selectedImages[image.id]}
              onChange={() =>
                setSelectedImages((prev) => ({
                  ...prev,
                  [image.id]: prev[image.id] ? undefined : image
                }))
              }
              className={`checkbox border-white bg-transparent checked:border-orange-500 checked:bg-white checked:text-orange-500`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
