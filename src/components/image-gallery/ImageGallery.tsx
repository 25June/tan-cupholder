'use client';

import { Product } from '@/models/product';
import { Image as ImageType } from '@/models/image';
import { useState, useEffect } from 'react';
import CDNImage from '@/components/cdn-image/CDNImage';
import { getImageUrl } from '@/shared/utils/getImageUrl';

const ImageGallery = ({
  product,
  images
}: {
  product: Product;
  images: ImageType[];
}) => {
  const mainImage = images.find((img) => img.isMain);
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(
    mainImage || images[0] || null
  );

  useEffect(() => {
    setSelectedImage(mainImage || images[0] || null);
  }, [mainImage, images]);

  return (
    <div className="flex flex-1 gap-4 flex-col-reverse md:flex-row">
      {/* Thumbnail images */}
      <nav
        className="shrink-0 md:h-full max-h-24 md:max-h-88 w-full md:max-w-24 overflow-auto flex flex-row md:flex-col gap-2"
        aria-label="Product image thumbnails"
      >
        {images.map((img, index) => (
          <div
            key={img.id || index}
            className="w-full max-w-full md:max-w-24 min-w-12 h-12 md:h-full flex justify-center items-center rounded-md cursor-pointer"
          >
            <div
              className={`w-full md:h-full ${
                selectedImage?.id === img.id
                  ? 'bg-logo-orange-pale-companion'
                  : 'bg-gray-100'
              } rounded-md max-h-full flex justify-center items-center md:max-h-56 relative p-1 md:p-2`}
            >
              <button
                onClick={() => setSelectedImage(img)}
                className="h-10 md:h-full transition-transform hover:scale-105 rounded-md duration-300 overflow-hidden"
                aria-label={`View ${img.name}`}
              >
                <CDNImage
                  src={getImageUrl(product.id, img.name)}
                  alt={img.name}
                  width={700}
                  height={700}
                  className="object-contain w-full h-full"
                />
              </button>
            </div>
          </div>
        ))}
      </nav>

      {/* Main image display */}
      <figure className="w-full h-88 bg-gray-100 p-2 rounded-md">
        {selectedImage && (
          <CDNImage
            src={getImageUrl(product.id, selectedImage.name)}
            alt={selectedImage.name}
            width={700}
            height={700}
            className="object-contain w-full h-full"
            priority
          />
        )}
      </figure>
    </div>
  );
};

export default ImageGallery;
