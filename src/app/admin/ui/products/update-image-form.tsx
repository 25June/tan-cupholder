'use client';

import { useState } from 'react';
import { createImage, State } from '../../lib/actions/images.actions';
import { Product } from '@/models/product';
import { PhotoIcon } from '@heroicons/react/24/outline';
import FileUpload from '@/components/file-upload/FileUpload';
import s3Service from '@/app/lib/bucket';
import Image from 'next/image';

const initialState: State = { message: null, errors: {} };

export default function UpdateImageForm({ product }: { product: Product }) {
  const [images, setImages] = useState<File[]>([]);
  const [presignedUrlObject, setPresignedUrlObject] = useState<
    Record<string, string>
  >({});
  const [state, setState] = useState<State>(initialState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMain, setIsMain] = useState<Record<string, boolean>>({});

  const onSelectImages = (files: FileList) => {
    setImages(Array.from(files));
  };

  const handleFormSubmit = async (formData: FormData) => {
    if (!images.length) {
      console.error('No file selected');
      return Promise.reject(new Error('No file selected'));
    }

    setIsLoading(true);
    const promises = images.map((image) => {
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
            src={s3Service.getImageUrl(product.image)}
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
            {images.length ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 w-full h-full">
                {images.map((image) => (
                  <div
                    key={image.name}
                    className="w-full h-full flex justify-center items-center"
                  >
                    <FileUpload
                      key={image.name}
                      image={image}
                      presignedUrl={presignedUrlObject[image.name] || ''}
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
