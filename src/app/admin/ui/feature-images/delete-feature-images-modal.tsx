'use client';

import { useMemo, useState } from 'react';
import { deleteFeatureImages } from '@/app/admin/lib/actions/image-feature.actions';
import { onCloseModal } from '@/shared/utils/modal.utils';
import { MODAL_ID } from '@/constants/modal.const';
import { FeatureImage } from '@/models/featureImage';

export default function DeleteFeatureImagesModal({
  selectedImages,
  onRefresh
}: {
  selectedImages: Record<string, FeatureImage | undefined>;
  onRefresh: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const imageIds = useMemo(
    () =>
      Object.values(selectedImages)
        .filter((image) => image !== undefined)
        .map((image) => image!.id),
    [selectedImages]
  );

  const handleConfirmDelete = async () => {
    if (imageIds.length === 0) {
      return;
    }

    setIsLoading(true);
    try {
      await deleteFeatureImages(imageIds);
      handleClose(true);
    } catch (error) {
      console.error('Failed to delete feature images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = (refresh?: boolean) => {
    onCloseModal(MODAL_ID.DELETE_FEATURE_IMAGES);
    if (refresh) {
      onRefresh();
    }
  };

  const numberOfImages = imageIds.length;

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
            onClick={() => handleClose()}
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
                <div className="loading loading-spinner loading-sm" />
                <span>Deleting...</span>
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={() => handleClose()}>close</button>
      </form>
    </dialog>
  );
}
