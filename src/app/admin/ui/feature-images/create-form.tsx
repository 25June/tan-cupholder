'use client';

import { useState } from 'react';
import FileUpload from '@/components/file-upload/FileUpload';
import { PhotoIcon } from '@heroicons/react/24/outline';
import {
  createFeatureImage,
  State
} from '@/app/admin/lib/actions/image-feature.actions';
import { useRouter } from 'next/navigation';

const initialState: State = { message: null, errors: {} };

export default function CreateFeatureImageForm() {
  const [state, setState] = useState<State>(initialState);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uploadImages, setUploadImages] = useState<File[]>([]);
  const [presignedUrlObject, setPresignedUrlObject] = useState<
    Record<string, string>
  >({});

  const onUpload = async () => {
    if (!uploadImages.length) {
      return Promise.resolve();
    }
    setIsLoading(true);
    const promises = uploadImages.map((image) => {
      const newFormData = new FormData();
      newFormData.append('name', image.name);
      newFormData.append('type', image.type);
      return createFeatureImage(newFormData)
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
    Promise.all(promises).finally(() => setIsLoading(false));
  };

  const onSelectImages = (files: FileList) => {
    setUploadImages(Array.from(files));
  };

  return (
    <form action={onUpload}>
      <div className="form-control w-full max-w-full">
        <div className="text-sm text-muted-foreground">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Images</legend>
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
            <div id="name-error" aria-live="polite" aria-atomic="true">
              {state.errors?.name &&
                state.errors.name.map((error: string) => (
                  <p className="text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </fieldset>
          <div className="mt-4 mb-4 w-full h-full rounded-md min-h-24">
            {/* image preview */}
            {uploadImages.length ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 w-full">
                {uploadImages.map((uploadImage) => (
                  <div
                    key={uploadImage.name}
                    className="w-full h-full flex justify-center items-center"
                  >
                    <FileUpload
                      key={uploadImage.name}
                      image={uploadImage}
                      presignedUrl={presignedUrlObject[uploadImage.name] || ''}
                      setImageUploadCompleted={() => console.log('done')}
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
            onClick={() => router.push('/admin/dashboard/feature-images')}
            className="btn btn-ghost max-w-40 w-full"
          >
            Cancel
          </button>

          <button type="submit" className="btn btn-primary grow-1">
            {isLoading && <span className="loading loading-spinner"></span>} Add
            Product
          </button>
        </div>
      </div>
    </form>
  );
}
