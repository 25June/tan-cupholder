'use client';

import { useState } from 'react';
import { deleteProduct } from '@/app/admin/lib/actions/products.actions';
import { onCloseModal } from '@/shared/utils/modal.utils';
import { MODAL_ID } from '@/constants/modal.const';

export default function DeleteProductModal({
  productId,
  onRefresh
}: {
  productId: string | null;
  onRefresh: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirmDelete = async () => {
    if (!productId) return;

    setIsLoading(true);
    try {
      await deleteProduct(productId);
      handleClose(true);
    } catch (error) {
      console.error('Failed to delete product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = (refresh?: boolean) => {
    onCloseModal(MODAL_ID.DELETE_PRODUCT);
    refresh && onRefresh();
  };

  return (
    <dialog id={MODAL_ID.DELETE_PRODUCT} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Delete Product</h3>
        <p className="py-4">
          Are you sure you want to delete this product? This action cannot be
          undone and will also delete all associated images.
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
            disabled={isLoading}
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
