'use client';

import { useEffect, useState } from 'react';
import {
  updateProductType,
  State,
  getProductTypeById,
  uploadProductTypeImage
} from '@/app/admin/lib/actions/product-types.actions';
import { ProductType } from '@/models/productType';
import { onCloseModal } from '@/shared/utils/modal.utils';
import { MODAL_ID } from '@/constants/modal.const';
import FileUpload from '@/components/file-upload/FileUpload';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { getImageUrl } from '@/shared/utils/getImageUrl';
import { formatImagePath } from '@/shared/utils/formatImagePath.utils';
import Image from 'next/image';
interface ImageFieldProps {
  uploadImage?: File;
  presignedUrl?: string;
  setImageUploadCompleted: (completed: boolean) => void;
  imageUrl?: string;
}

const ImageField = ({
  uploadImage,
  presignedUrl,
  setImageUploadCompleted,
  imageUrl
}: ImageFieldProps) => {
  if (uploadImage) {
    return (
      <div
        key={uploadImage.name}
        className="w-full h-48 flex justify-center items-center"
      >
        <FileUpload
          key={uploadImage.name}
          image={uploadImage}
          presignedUrl={presignedUrl || ''}
          setImageUploadCompleted={() => setImageUploadCompleted(true)}
        />
      </div>
    );
  }
  if (imageUrl) {
    return (
      <div className="w-full h-48 bg-gray-200 rounded-md p-2 relative">
        <Image
          src={formatImagePath(getImageUrl('product-types', imageUrl))}
          alt="Product Type Image"
          className="object-contain h-full w-full"
          width={500}
          height={500}
        />
      </div>
    );
  }
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 rounded-md max-h-48 p-4">
      <PhotoIcon className="w-10 h-10 text-gray-500" />
      <p className="text-sm text-gray-500">No image selected</p>
    </div>
  );
};

const initialState: State = { message: null, errors: {} };

export default function EditProductTypeModal({
  productTypeId,
  onRefresh
}: {
  productTypeId: string | null;
  onRefresh: () => void;
}) {
  const [state, setState] = useState<State>(initialState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [productType, setProductType] = useState<ProductType | null>(null);
  const [uploadImage, setUploadImage] = useState<File>();
  const [presignedUrl, setPresignedUrl] = useState<string>('');
  const [imageUploadCompleted, setImageUploadCompleted] =
    useState<boolean>(false);

  useEffect(() => {
    const loadData = async () => {
      if (!productTypeId) {
        setProductType(null);
        setState(initialState);
        return;
      }

      try {
        const productTypeData = await getProductTypeById(productTypeId);
        setProductType(productTypeData);
      } catch (error) {
        console.error('Failed to load product type data:', error);
      }
    };

    loadData();
  }, [productTypeId]);

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
    if (!productType) return;

    const formData = new FormData(e.currentTarget);
    formData.set('id', productType.id);
    if (uploadImage) {
      formData.set('imageUrl', uploadImage?.name ?? '');
    }
    formData.delete('image');
    setIsLoading(true);
    return updateProductType(initialState, formData)
      .then((res: any) => {
        onUpload();
        if (res.errors) {
          setState({
            message: res.message,
            errors: res.errors
          });
          setIsLoading(false);
          return;
        }
        if (!uploadImage) {
          handleClose(true);
        }
      })
      .catch((error) => {
        setState({
          message: error.message,
          errors: error.errors
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (imageUploadCompleted) {
      handleClose(true);
    }
  }, [imageUploadCompleted]);

  const handleClose = (refresh?: boolean) => {
    onCloseModal(MODAL_ID.UPDATE_PRODUCT_TYPE);
    setState(initialState);
    setProductType(null);
    setUploadImage(undefined);
    setPresignedUrl('');
    setImageUploadCompleted(false);
    const form = document.getElementById(
      'edit-product-type-form'
    ) as HTMLFormElement;
    if (form) {
      form.reset();
    }
    if (refresh) {
      onRefresh();
    }
  };

  return (
    <dialog id={MODAL_ID.UPDATE_PRODUCT_TYPE} className="modal">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-lg mb-4">Edit Product Type</h3>
        {!productType ? (
          <div className="flex justify-center items-center p-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
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
                    defaultValue={productType.name}
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
                    defaultValue={productType.short_name}
                  />
                  <div
                    id="shortName-error"
                    aria-live="polite"
                    aria-atomic="true"
                  >
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
                <fieldset className="fieldset w-full">
                  <legend className="fieldset-legend">Description</legend>
                  <textarea
                    name="description"
                    className="textarea h-24 w-full"
                    placeholder="Product Type Description"
                    defaultValue={productType.description || ''}
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
                  <ImageField
                    uploadImage={uploadImage}
                    presignedUrl={presignedUrl}
                    setImageUploadCompleted={setImageUploadCompleted}
                    imageUrl={productType.image_url}
                  />
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
                  {isLoading && (
                    <span className="loading loading-spinner"></span>
                  )}
                  Update Product Type
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={() => handleClose()}>close</button>
      </form>
    </dialog>
  );
}
