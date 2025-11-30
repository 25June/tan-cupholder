'use client';

import { useState } from 'react';
import { MODAL_ID } from '@/constants/modal.const';
import { onCloseModal } from '@/shared/utils/modal.utils';
import { deleteInvoice } from '@/app/admin/lib/actions';

export default function DeleteInvoiceModal({
  invoiceId,
  onRefresh
}: {
  invoiceId: string | null;
  onRefresh: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirmDelete = async () => {
    if (!invoiceId) return;

    setIsLoading(true);
    try {
      await deleteInvoice(invoiceId);
      handleClose();
    } catch (error) {
      console.error('Failed to delete invoice:', error);
      alert('Failed to delete invoice. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onCloseModal(MODAL_ID.DELETE_INVOICE);
    onRefresh();
  };

  return (
    <dialog id={MODAL_ID.DELETE_INVOICE} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Delete Invoice</h3>
        <p className="py-4">
          Are you sure you want to delete this invoice? This action cannot be
          undone.
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
        <button onClick={handleClose}>close</button>
      </form>
    </dialog>
  );
}
