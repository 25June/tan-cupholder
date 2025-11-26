'use client';

import { useEffect, useState, useRef } from 'react';
import { deleteProductType } from '@/app/admin/lib/actions/product-types.actions';
import { onCloseModal } from '@/shared/utils/modal.utils';
import { MODAL_ID } from '@/constants/modal.const';
import Spinner from '@/components/spinner/Spinner';

export default function DeleteProductTypeModal({
  productTypeId
}: {
  productTypeId: string | null;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentProductTypeId, setCurrentProductTypeId] = useState<
    string | null
  >(productTypeId);
  const modalRef = useRef<HTMLDialogElement | null>(null);
  const prevOpenRef = useRef<boolean>(false);

  useEffect(() => {
    const modal = document.getElementById(
      MODAL_ID.DELETE_PRODUCT_TYPE
    ) as HTMLDialogElement;
    modalRef.current = modal;
    if (!modal) return;

    const handleClose = () => {
      setCurrentProductTypeId(null);
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
      const id = modal.getAttribute('data-product-type-id');

      if (isOpen && !prevOpenRef.current && id) {
        setCurrentProductTypeId(id);
      }

      prevOpenRef.current = isOpen;
    };

    const interval = setInterval(checkModalState, 100);
    return () => clearInterval(interval);
  }, []);

  const handleConfirmDelete = async () => {
    const idToDelete = productTypeId || currentProductTypeId;
    if (!idToDelete) return;

    setIsLoading(true);
    try {
      await deleteProductType(idToDelete);
      onCloseModal(MODAL_ID.DELETE_PRODUCT_TYPE);
    } catch (error) {
      console.error('Failed to delete product type:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onCloseModal(MODAL_ID.DELETE_PRODUCT_TYPE);
    setCurrentProductTypeId(null);
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
            onClick={handleClose}
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
