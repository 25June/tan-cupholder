'use client';

import { useEffect, useState } from 'react';
import {
  createProductType,
  State,
  uploadProductTypeImage
} from '@/app/admin/lib/actions/product-types.actions';
import { onCloseModal } from '@/shared/utils/modal.utils';
import { MODAL_ID } from '@/constants/modal.const';
import FileUpload from '@/components/file-upload/FileUpload';
import { PhotoIcon } from '@heroicons/react/24/outline';

const initialState: State = { message: null, errors: {} };

export default function CreateProductTypeModal({
  onRefresh
}: {
  onRefresh: () => void;
}) {
  const [state, setState] = useState<State>(initialState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uploadImage, setUploadImage] = useState<File>();
  const [presignedUrl, setPresignedUrl] = useState<string>('');
  const [imageUploadCompleted, setImageUploadCompleted] =
    useState<boolean>(false);

  const onUpload = async (): Promise<string> => {
    if (!uploadImage) {
      return '';
    }
    setIsLoading(true);
    const newFormData = new FormData();
    newFormData.append('name', uploadImage.name);
    newFormData.append('type', uploadImage.type);
    try {
      const res = await uploadProductTypeImage(newFormData);
      if (res.errors) {
        throw new Error('Failed to upload image');
      }
      setPresignedUrl(res.presignedUrl);
      return uploadImage.name;
    } catch (error) {
      console.error('Error uploading image:', error);
      return '';
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const newFormData = new FormData();
    newFormData.append('name', formData.get('name') as string);
    newFormData.append('shortName', formData.get('shortName') as string);
    newFormData.append('description', formData.get('description') as string);
    newFormData.append('imageUrl', uploadImage?.name ?? '');

    return createProductType(initialState, newFormData)
      .then((res) => {
        onUpload();
        if (res.errors) {
          setState({
            message: res.message,
            errors: res.errors
          });
          setIsLoading(false);
          return;
        }
      })
      .catch((error: any) => {
        setState({
          message: error.message || 'Failed to create product type',
          errors: error.errors || {}
        });
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (imageUploadCompleted) {
      handleClose();
    }
  }, [imageUploadCompleted]);

  const handleClose = (refresh?: boolean) => {
    onCloseModal(MODAL_ID.ADD_PRODUCT_TYPE);
    setState(initialState);
    if (refresh) {
      onRefresh();
    }
  };

  return (
    <dialog id={MODAL_ID.ADD_PRODUCT_TYPE} className="modal">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-lg mb-4">Create Product Type</h3>
        <form onSubmit={handleFormSubmit}>
          <div className="form-control w-full max-w-full">
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <fieldset className="fieldset w-full">
                <legend className="fieldset-legend">Name</legend>
                <input
                  type="text"
                  name="name"
                  className="input w-full"
                  placeholder="Product Type Name"
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

              <fieldset className="fieldset w-full">
                <legend className="fieldset-legend">Short Name</legend>
                <input
                  type="text"
                  name="shortName"
                  className="input w-full"
                  placeholder="Short Name (e.g., CUP, GLASS)"
                />
                <div id="shortName-error" aria-live="polite" aria-atomic="true">
                  {state.errors?.shortName &&
                    state.errors.shortName.map((error: string) => (
                      <p className="text-sm text-red-500" key={error}>
                        {error}
                      </p>
                    ))}
                </div>
              </fieldset>
            </div>
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <div className="flex flex-col md:flex-row gap-4 w-full">
                <fieldset className="fieldset w-full">
                  <legend className="fieldset-legend">Description</legend>
                  <textarea
                    name="description"
                    className="textarea h-24 w-full"
                    placeholder="Product Type Description"
                  />
                  <div
                    id="description-error"
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    {state.errors?.description &&
                      state.errors.description.map((error: string) => (
                        <p className="text-sm text-red-500" key={error}>
                          {error}
                        </p>
                      ))}
                  </div>
                </fieldset>
              </div>

              <div className="flex flex-col gap-1 w-full">
                <fieldset className="fieldset w-full">
                  <legend className="fieldset-legend">Image</legend>
                  <input
                    type="file"
                    name="image"
                    className="file-input w-full"
                    placeholder="Product Image"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      if (event.target.files) {
                        setUploadImage(event.target.files[0]);
                      }
                    }}
                  />
                  <div className="label">
                    <span className="label-text-alt text-gray-500">
                      Supported formats: PNG, JPEG
                    </span>
                  </div>
                  <div
                    id="imageUrl-error"
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    {state.errors?.imageUrl &&
                      state.errors.imageUrl.map((error: string) => (
                        <p className="text-sm text-red-500" key={error}>
                          {error}
                        </p>
                      ))}
                  </div>
                </fieldset>
                <div className="mb-1 w-full h-full rounded-md min-h-24">
                  {uploadImage ? (
                    <div
                      key={uploadImage.name}
                      className="w-full h-full flex justify-center items-center"
                    >
                      <FileUpload
                        key={uploadImage.name}
                        image={uploadImage}
                        presignedUrl={presignedUrl}
                        setImageUploadCompleted={() =>
                          setImageUploadCompleted(true)
                        }
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 rounded-md max-h-48 p-4">
                      <PhotoIcon className="w-10 h-10 text-gray-500" />
                      <p className="text-sm text-gray-500">No image selected</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => handleClose()}
                className="btn btn-ghost max-w-40 w-full"
              >
                Cancel
              </button>

              <button type="submit" className="btn btn-primary grow-1">
                {isLoading && <span className="loading loading-spinner"></span>}{' '}
                Add Product Type
              </button>
            </div>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={() => handleClose()}>close</button>
      </form>
    </dialog>
  );
}
