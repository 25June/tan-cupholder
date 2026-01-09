'use client';

import { useEffect, useState } from 'react';
import {
  createImage,
  removeImage,
  State
} from '@/app/admin/lib/actions/images.actions';
import { PhotoIcon } from '@heroicons/react/24/outline';
import FileUpload from '@/components/file-upload/FileUpload';
import { getImageUrl } from '@/shared/utils/getImageUrl';
import { formatImagePath } from '@/shared/utils/formatImagePath.utils';
import Image from 'next/image';
import { Image as ImageType } from '@/models/image';
import { ActiveButton, DeleteImage } from './buttons';
import { onCloseModal } from '@/shared/utils/modal.utils';
import { MODAL_ID } from '@/constants/modal.const';
import {
  fetchProductById,
  updateActiveImage
} from '@/app/admin/lib/actions/products.actions';
import { ProductResponse } from '@/models/product';

interface EditProductImageModalProps {
  readonly product: ProductResponse | null;
  readonly onRefresh: () => void;
  readonly onReset: () => void;
}
const initialState: State = { message: null, errors: {} };

export default function EditProductImageModal({
  product,
  onRefresh,
  onReset
}: EditProductImageModalProps) {
  const [uploadImages, setUploadImages] = useState<File[]>([]);
  const [presignedUrlObject, setPresignedUrlObject] = useState<
    Record<string, string>
  >({});
  const [imageUploadCompleted, setImageUploadCompleted] = useState<
    Record<string, boolean>
  >({});
  const [images, setImages] = useState<ImageType[]>([]);
  const [state, setState] = useState<State>(initialState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMain, setIsMain] = useState<Record<string, boolean>>({});
  const [shouldRefresh, setShouldRefresh] = useState(false);

  const mainImage = images.find((image) => image.isMain);

  const resetState = () => {
    setImages([]);
    setUploadImages([]);
    setPresignedUrlObject({});
    setImageUploadCompleted({});
    setState(initialState);
    setIsMain({});
    setShouldRefresh(false);
    onReset();
  };

  useEffect(() => {
    const loadData = async () => {
      if (!product?.id) {
        resetState();
        return;
      }

      try {
        const { images: imagesData } = await fetchProductById(product.id);
        setImages(imagesData);
      } catch (error) {
        console.error('Failed to load product data:', error);
      }
    };

    loadData();
  }, [product]);

  useEffect(() => {
    if (
      Object.values(imageUploadCompleted).length &&
      Object.values(imageUploadCompleted).every((value) => value === true)
    ) {
      if (product?.id) {
        fetchProductById(product.id).then(({ images: imagesData }) => {
          setImages(imagesData);
        });
      }
      setUploadImages([]);
      setImageUploadCompleted({});
      setPresignedUrlObject({});
    }
  }, [imageUploadCompleted, product]);

  const onSelectImages = (files: FileList) => {
    setUploadImages(Array.from(files));
  };

  const handleFormSubmit = async () => {
    if (!uploadImages.length || !product?.id) {
      console.error('No file selected or product not loaded');
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
    setShouldRefresh(true);
    Promise.all(promises).finally(() => setIsLoading(false));
  };

  const handleDeleteImage = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      setIsLoading(true);
      try {
        await removeImage(id);
        if (product?.id) {
          const { images: imagesData } = await fetchProductById(product.id);
          setImages(imagesData);
        }
        setShouldRefresh(true);
      } catch (error) {
        console.error('Failed to delete image:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleActiveImage = async (id: string) => {
    setIsLoading(true);
    try {
      await updateActiveImage(id, mainImage?.id || '');
      if (product?.id) {
        const { images: imagesData } = await fetchProductById(product.id);
        setImages(imagesData);
      }
      setShouldRefresh(true);
    } catch (error) {
      console.error('Failed to update active image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = (refresh?: boolean) => {
    onCloseModal(MODAL_ID.EDIT_PRODUCT_IMAGE);
    resetState();
    if (refresh ?? shouldRefresh) {
      onRefresh();
    }
  };

  return (
    <dialog id={MODAL_ID.EDIT_PRODUCT_IMAGE} className="modal">
      <div className="modal-box max-w-6xl max-h-[90vh] overflow-y-auto">
        <h3 className="font-bold text-lg mb-4">Edit Product Images</h3>
        {!product?.id ? (
          <div className="flex justify-center items-center p-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
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
                    src={formatImagePath(
                      getImageUrl(product.id, mainImage.name)
                    )}
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
                        src={formatImagePath(
                          getImageUrl(product.id, image.name)
                        )}
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
                  onClick={() => handleClose()}
                  className="btn btn-ghost max-w-40 w-full"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleFormSubmit}
                  disabled={isLoading || !uploadImages.length}
                  className="btn btn-primary grow-1"
                >
                  {isLoading && (
                    <span className="loading loading-spinner"></span>
                  )}{' '}
                  Add images
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={() => handleClose()}>close</button>
      </form>
    </dialog>
  );
}
