'use client';

import { useEffect, useState, useRef } from 'react';
import { deleteProductTag } from '@/app/admin/lib/actions/product-tags.actions';
import { onCloseModal } from '@/shared/utils/modal.utils';
import { MODAL_ID } from '@/constants/modal.const';
import Spinner from '@/components/spinner/Spinner';

export default function DeleteProductTagModal({
  productTagId
}: {
  productTagId: string | null;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentProductTagId, setCurrentProductTagId] = useState<string | null>(
    productTagId
  );
  const modalRef = useRef<HTMLDialogElement | null>(null);
  const prevOpenRef = useRef<boolean>(false);

  useEffect(() => {
    const modal = document.getElementById(
      MODAL_ID.DELETE_PRODUCT_TAG
    ) as HTMLDialogElement;
    modalRef.current = modal;
    if (!modal) return;

    const handleClose = () => {
      setCurrentProductTagId(null);
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
      const id = modal.getAttribute('data-product-tag-id');

      if (isOpen && !prevOpenRef.current && id) {
        setCurrentProductTagId(id);
      }

      prevOpenRef.current = isOpen;
    };

    const interval = setInterval(checkModalState, 100);
    return () => clearInterval(interval);
  }, []);

  const handleConfirmDelete = async () => {
    const idToDelete = productTagId || currentProductTagId;
    if (!idToDelete) return;

    setIsLoading(true);
    try {
      await deleteProductTag(idToDelete);
      onCloseModal(MODAL_ID.DELETE_PRODUCT_TAG);
    } catch (error) {
      console.error('Failed to delete product tag:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onCloseModal(MODAL_ID.DELETE_PRODUCT_TAG);
    setCurrentProductTagId(null);
  };

  return (
    <dialog id={MODAL_ID.DELETE_PRODUCT_TAG} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Delete Product Tag</h3>
        <p className="py-4">
          Are you sure you want to delete this product tag? This action cannot
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
