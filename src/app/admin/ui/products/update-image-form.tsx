'use client';

import { useState, useEffect } from 'react';
import {
  createImage,
  removeImage,
  State
} from '../../lib/actions/images.actions';
import { Product } from '@/models/product';
import { PhotoIcon } from '@heroicons/react/24/outline';
import FileUpload from '@/components/file-upload/FileUpload';
import { getImageUrl } from '@/shared/utils/getImageUrl';
import { formatImagePath } from '@/shared/utils/formatImagePath.utils';
import Image from 'next/image';
import { Image as ImageType } from '@/models/image';
import { ActiveButton, DeleteImage } from './buttons';
import { useRouter } from 'next/navigation';
import { updateActiveImage } from '../../lib/actions/products.actions';

const initialState: State = { message: null, errors: {} };

export default function UpdateImageForm({
  product,
  images
}: {
  product: Product;
  images: ImageType[];
}) {
  const [uploadImages, setUploadImages] = useState<File[]>([]);
  const [presignedUrlObject, setPresignedUrlObject] = useState<
    Record<string, string>
  >({});
  const [imageUploadCompleted, setImageUploadCompleted] = useState<
    Record<string, boolean>
  >({});
  const mainImage = images.find((image) => image.isMain);

  const [state, setState] = useState<State>(initialState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMain, setIsMain] = useState<Record<string, boolean>>({});
  const router = useRouter();

  useEffect(() => {
    if (Object.values(imageUploadCompleted).every((value) => value === true)) {
      router.refresh();
      setUploadImages([]);
    }
  }, [imageUploadCompleted]);

  const onSelectImages = (files: FileList) => {
    setUploadImages(Array.from(files));
  };

  const handleFormSubmit = async () => {
    if (!uploadImages.length) {
      console.error('No file selected');
      return Promise.reject(new Error('No file selected'));
    }

    setIsLoading(true);
    const newUploadImage: Record<string, boolean> = {};
    const promises = uploadImages.map((image) => {
      const newFormData = new FormData();
      newFormData.append('name', image.name);
      newFormData.append('type', image.type);
      newFormData.append('productId', product.id);
      newFormData.append('isMain', (isMain[image.name] || false).toString());
      newUploadImage[image.name] = false;
      return createImage(initialState, newFormData)
        .then((res) => {
          setPresignedUrlObject((prev) => ({
            ...prev,
            [image.name]: res?.['presignedUrl'] || ''
          }));
        })
        .catch((error) => {
          setState({
            message: error.message,
            errors: error.errors
          });
        });
    });
    setImageUploadCompleted(newUploadImage);
    Promise.all(promises).finally(() => setIsLoading(false));
  };

  const handleDeleteImage = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      await removeImage(id);
      setIsLoading(false);
      router.refresh();
    }
  };

  const handleActiveImage = async (id: string) => {
    setIsLoading(true);
    await updateActiveImage(id, mainImage?.id || '');
    setIsLoading(false);
    router.refresh();
  };

  return (
    <div>
      <div className="flex gap-2">
        <div className="w-full bg-gray-200 rounded-md max-w-24 max-h-24">
          <Image
            src={formatImagePath(
              getImageUrl(product.id, mainImage?.name || '')
            )}
            alt={product.name}
            className="w-full h-full object-contain rounded-md"
            width={100}
            height={100}
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <h2 className="text-xl font-bold text-ellipsis overflow-hidden whitespace-nowrap max-w-48">
            {product.description}
          </h2>
        </div>
      </div>
      <p className="text-sm font-bold mb-2 mt-6">Main image</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 w-full">
        {mainImage ? (
          <div
            key={mainImage.id}
            className={`w-full h-full bg-gray-100 rounded-md max-h-56 relative flex gap-2`}
          >
            <Image
              src={formatImagePath(getImageUrl(product.id, mainImage.name))}
              alt={mainImage.name}
              className="object-contain h-full flex-1 p-2"
              width={200}
              height={200}
            />
            <div className="relative flex gap-2 flex-col justify-end min-w-2 bg-gradient-to-r from-gray-100 to-gray-50 p-2">
              <DeleteImage
                loading={isLoading}
                onClick={() => handleDeleteImage(mainImage.id)}
              />
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-gray-100 rounded-md max-h-56 relative flex gap-2">
            <p className="text-sm text-gray-500">No main image</p>
          </div>
        )}
      </div>
      <p className="text-sm font-bold mb-2 mt-6">
        Current Images ({images.length})
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 w-full">
        {(images || []).map(
          (image) =>
            !image.isMain && (
              <div
                key={image.id}
                className={`w-full h-full bg-gray-100 rounded-md max-h-56 relative flex gap-2`}
              >
                <Image
                  src={formatImagePath(getImageUrl(product.id, image.name))}
                  alt={image.name}
                  className="object-contain flex-1 h-full p-2"
                  width={200}
                  height={200}
                />
                <div className="relative flex gap-2 flex-col justify-end min-w-2 bg-gradient-to-r from-gray-100 to-gray-50 p-2">
                  <ActiveButton
                    loading={isLoading}
                    onClick={() => handleActiveImage(image.id)}
                  />
                  <DeleteImage
                    loading={isLoading}
                    onClick={() => handleDeleteImage(image.id)}
                  />
                </div>
              </div>
            )
        )}
      </div>
      <div>
        <div className="text-sm text-muted-foreground mt-6">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">More Images</legend>
            <input
              multiple
              type="file"
              name="image"
              className="file-input w-full"
              placeholder="Product Image"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                if (event.target.files) {
                  onSelectImages(event.target.files);
                }
              }}
            />
          </fieldset>

          <div className="mt-4 mb-4 w-full h-full rounded-md min-h-24">
            {/* image preview */}
            {uploadImages.length ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 w-full h-full">
                {uploadImages.map((uploadImage) => (
                  <div
                    key={uploadImage.name}
                    className="w-full h-full flex justify-center items-center"
                  >
                    <FileUpload
                      key={uploadImage.name}
                      image={uploadImage}
                      presignedUrl={presignedUrlObject[uploadImage.name] || ''}
                      setImageUploadCompleted={setImageUploadCompleted}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 rounded-md max-h-48 max-w-48 p-4">
                <PhotoIcon className="w-10 h-10 text-gray-500" />
                <p className="text-sm text-gray-500">No image selected</p>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => router.push(`/admin/dashboard/products`)}
            className="btn btn-ghost max-w-40 w-full"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => {
              handleFormSubmit();
            }}
            className="btn btn-primary grow-1"
          >
            {isLoading && <span className="loading loading-spinner"></span>} Add
            images
          </button>
        </div>
      </div>
    </div>
  );
}
