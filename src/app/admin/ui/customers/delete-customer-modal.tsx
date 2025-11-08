'use client';

import { useEffect, useState, useRef } from 'react';
import { deleteCustomer } from '@/app/admin/lib/actions/customers.action';
import { onCloseModal } from '@/shared/utils/modal.utils';
import { MODAL_ID } from '@/constants/modal.const';
import Spinner from '@/components/spinner/Spinner';

export default function DeleteCustomerModal({
  customerId
}: {
  customerId: string | null;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentCustomerId, setCurrentCustomerId] = useState<string | null>(
    customerId
  );
  const modalRef = useRef<HTMLDialogElement | null>(null);
  const prevOpenRef = useRef<boolean>(false);

  useEffect(() => {
    const modal = document.getElementById(
      MODAL_ID.DELETE_CUSTOMER
    ) as HTMLDialogElement;
    modalRef.current = modal;
    if (!modal) return;

    const handleClose = () => {
      setCurrentCustomerId(null);
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
      const id = modal.getAttribute('data-customer-id');

      if (isOpen && !prevOpenRef.current && id) {
        setCurrentCustomerId(id);
      }

      prevOpenRef.current = isOpen;
    };

    const interval = setInterval(checkModalState, 100);
    return () => clearInterval(interval);
  }, []);

  const handleConfirmDelete = async () => {
    const idToDelete = customerId || currentCustomerId;
    if (!idToDelete) return;

    setIsLoading(true);
    try {
      await deleteCustomer(idToDelete);
      onCloseModal(MODAL_ID.DELETE_CUSTOMER);
      window.location.reload();
    } catch (error) {
      console.error('Failed to delete customer:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onCloseModal(MODAL_ID.DELETE_CUSTOMER);
    setCurrentCustomerId(null);
  };

  return (
    <dialog id={MODAL_ID.DELETE_CUSTOMER} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Delete Customer</h3>
        <p className="py-4">
          Are you sure you want to delete this customer? This action cannot be
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
