'use client';

import { useState } from 'react';
import { deleteProductType } from '@/app/admin/lib/actions/product-types.actions';
import { onCloseModal } from '@/shared/utils/modal.utils';
import { MODAL_ID } from '@/constants/modal.const';

interface Props {
  readonly productTypeId: string | null;
  readonly onRefresh: () => void;
  readonly onReset: () => void;
}

export default function DeleteProductTypeModal({
  productTypeId,
  onRefresh,
  onReset
}: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirmDelete = async () => {
    if (!productTypeId) return;

    setIsLoading(true);
    try {
      await deleteProductType(productTypeId);
      handleClose(true);
    } catch (error) {
      console.error('Failed to delete product type:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = (refresh?: boolean) => {
    onCloseModal(MODAL_ID.DELETE_PRODUCT_TYPE);
    onReset();
    if (refresh) {
      onRefresh();
    }
  };

  return (
    <dialog id={MODAL_ID.DELETE_PRODUCT_TYPE} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Delete Product Type</h3>
        <p className="py-4">
          Are you sure you want to delete this product type? This action cannot
          be undone.
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
