'use client';

import { useState } from 'react';
import { createImage, State } from '../../lib/actions/images.actions';
import { Product } from '@/models/product';
import { PhotoIcon, TrashIcon } from '@heroicons/react/24/outline';
import FileUpload from '@/components/file-upload/FileUpload';
import { getImageUrl } from '@/shared/utils/getImageUrl';
import Image from 'next/image';
import { Image as ImageType } from '@/models/image';
import { DeleteImage } from './buttons';

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
  const [state, setState] = useState<State>(initialState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMain, setIsMain] = useState<Record<string, boolean>>({});
  const [doubleClick, setDoubleClick] = useState<Record<string, boolean>>({});

  const onSelectImages = (files: FileList) => {
    setUploadImages(Array.from(files));
  };

  const handleFormSubmit = async (formData: FormData) => {
    if (!uploadImages.length) {
      console.error('No file selected');
      return Promise.reject(new Error('No file selected'));
    }

    setIsLoading(true);
    const promises = uploadImages.map((image) => {
      const newFormData = new FormData();
      newFormData.append('name', image.name);
      newFormData.append('type', image.type);
      newFormData.append('productId', product.id);
      newFormData.append('isMain', (isMain[image.name] || false).toString());
      return createImage(initialState, newFormData)
        .then((res) => {
          console.log(res);
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
    Promise.all(promises).finally(() => setIsLoading(false));
  };

  return (
    <div>
      <div className="flex gap-2">
        <div className="w-full bg-gray-200 rounded-md max-w-24 max-h-24">
          <Image
            src={getImageUrl(product.id, product.image)}
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
      <p className="text-sm font-bold mb-2 mt-6">
        Current Images ({images.length})
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 w-full">
        {(images || []).map((image) => (
          <div
            key={image.id}
            className={`w-full h-full bg-gray-200 rounded-md max-h-56 relative p-2`}
          >
            <Image
              src={getImageUrl(product.id, image.name)}
              alt={image.name}
              className="object-contain w-full h-full"
              width={200}
              height={200}
            />
            <div className="absolute top-2 right-2">
              {doubleClick[image.id] ? (
                <DeleteImage id={image.id} />
              ) : (
                <button
                  onClick={() =>
                    setDoubleClick((prev) => ({
                      ...prev,
                      [image.id]: true
                    }))
                  }
                  className="rounded-md border p-2 hover:bg-gray-100"
                >
                  <span className="sr-only">Delete</span>
                  <TrashIcon className="w-5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <form action={handleFormSubmit}>
        <div className="text-sm text-muted-foreground mt-6">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Other Images</legend>
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
            {/* <div id="image-error" aria-live="polite" aria-atomic="true">
                {state.errors?.image &&
                  state.errors.image.map((error: string) => (
                    <p className=" text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div> */}
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
          <button type="button" className="btn btn-ghost max-w-40 w-full">
            Cancel
          </button>

          <button type="submit" className="btn btn-primary grow-1">
            {isLoading && <span className="loading loading-spinner"></span>} Add
            images
          </button>
        </div>
      </form>
    </div>
  );
}
