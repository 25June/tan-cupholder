'use client';

import { useEffect, useState, useRef } from 'react';
import { deleteFeatureImages } from '@/app/admin/lib/actions/image-feature.actions';
import { onCloseModal } from '@/shared/utils/modal.utils';
import { MODAL_ID } from '@/constants/modal.const';
import { FeatureImage } from '@/models/featureImage';
import Spinner from '@/components/spinner/Spinner';

export default function DeleteFeatureImagesModal({
  onDeleteComplete
}: {
  onDeleteComplete: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<
    Record<string, FeatureImage | undefined>
  >({});
  const modalRef = useRef<HTMLDialogElement | null>(null);
  const prevOpenRef = useRef<boolean>(false);

  useEffect(() => {
    const modal = document.getElementById(
      MODAL_ID.DELETE_FEATURE_IMAGES
    ) as HTMLDialogElement;
    modalRef.current = modal;
    if (!modal) return;

    const handleClose = () => {
      setImages({});
    };

    modal.addEventListener('close', handleClose);
    return () => {
      modal.removeEventListener('close', handleClose);
    };
  }, []);

  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    const checkModalState = () => {
      const isOpen = modal.open;
      const imagesData = modal.getAttribute('data-images');

      if (isOpen && !prevOpenRef.current && imagesData) {
        try {
          const parsedImages = JSON.parse(imagesData);
          setImages(parsedImages);
        } catch (error) {
          console.error('Failed to parse images data:', error);
        }
      }

      prevOpenRef.current = isOpen;
    };

    const interval = setInterval(checkModalState, 100);
    return () => clearInterval(interval);
  }, []);

  const handleConfirmDelete = async () => {
    const imageIds = Object.values(images)
      .filter((image) => image !== undefined)
      .map((image) => image!.id);

    if (imageIds.length === 0) {
      return;
    }

    setIsLoading(true);
    try {
      await deleteFeatureImages(imageIds);
      onCloseModal(MODAL_ID.DELETE_FEATURE_IMAGES);
      onDeleteComplete();
    } catch (error) {
      console.error('Failed to delete feature images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onCloseModal(MODAL_ID.DELETE_FEATURE_IMAGES);
    setImages({});
  };

  const numberOfImages = Object.values(images).filter(
    (image) => image !== undefined
  ).length;

  return (
    <dialog id={MODAL_ID.DELETE_FEATURE_IMAGES} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Delete Feature Images</h3>
        <p className="py-4">
          Are you sure you want to delete {numberOfImages} feature image(s)?
          This action cannot be undone.
        </p>
        <div className="modal-action">
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="btn btn-ghost"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmDelete}
            disabled={isLoading || numberOfImages === 0}
            className="btn btn-error"
          >
            {isLoading ? (
              <>
                <Spinner />
                <span>Deleting...</span>
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleClose}>close</button>
      </form>
    </dialog>
  );
}
