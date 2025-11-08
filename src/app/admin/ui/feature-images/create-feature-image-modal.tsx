'use client';

import { useEffect, useState } from 'react';
import FileUpload from '@/components/file-upload/FileUpload';
import { PhotoIcon } from '@heroicons/react/24/outline';
import {
  createFeatureImage,
  State
} from '@/app/admin/lib/actions/image-feature.actions';
import { onCloseModal } from '@/shared/utils/modal.utils';
import { MODAL_ID } from '@/constants/modal.const';

const initialState: State = { message: null, errors: {} };

export default function CreateFeatureImageModal() {
  const [state, setState] = useState<State>(initialState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uploadImages, setUploadImages] = useState<File[]>([]);
  const [presignedUrlObject, setPresignedUrlObject] = useState<
    Record<string, string>
  >({});
  const [imageUploadCompleted, setImageUploadCompleted] = useState<
    Record<string, boolean>
  >({});
  const [inputKey, setInputKey] = useState<number>(0);

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

  useEffect(() => {
    if (
      Object.values(imageUploadCompleted).length &&
      Object.values(imageUploadCompleted).every((value) => value === true)
    ) {
      onCloseModal(MODAL_ID.ADD_FEATURE_IMAGE);
      setUploadImages([]);
      setImageUploadCompleted({});
      setPresignedUrlObject({});
      setInputKey((prev) => prev + 1);
      setState(initialState);
      window.location.reload();
    }
  }, [imageUploadCompleted]);

  const handleClose = () => {
    onCloseModal(MODAL_ID.ADD_FEATURE_IMAGE);
    setUploadImages([]);
    setImageUploadCompleted({});
    setPresignedUrlObject({});
    setInputKey((prev) => prev + 1);
    setState(initialState);
  };

  return (
    <dialog id={MODAL_ID.ADD_FEATURE_IMAGE} className="modal">
      <div className="modal-box max-w-4xl">
        <h3 className="font-bold text-lg mb-4">Create Feature Image</h3>
        <form
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            onUpload();
          }}
        >
          <div className="form-control w-full max-w-full">
            <div className="text-sm text-muted-foreground">
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Images</legend>
                <input
                  key={inputKey}
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
                          presignedUrl={
                            presignedUrlObject[uploadImage.name] || ''
                          }
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

            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={handleClose}
                className="btn btn-ghost max-w-40 w-full"
              >
                Cancel
              </button>

              <button type="submit" className="btn btn-primary grow-1">
                {isLoading && <span className="loading loading-spinner"></span>}{' '}
                Add Feature Image
              </button>
            </div>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleClose}>close</button>
      </form>
    </dialog>
  );
}
