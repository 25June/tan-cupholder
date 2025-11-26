'use client';

import { useEffect, useState, useRef } from 'react';
import { deleteEmailTemplate } from '@/app/admin/lib/actions/email-templates.actions';
import { onCloseModal } from '@/shared/utils/modal.utils';
import { MODAL_ID } from '@/constants/modal.const';
import Spinner from '@/components/spinner/Spinner';

export default function DeleteEmailTemplateModal({
  emailTemplateId
}: {
  emailTemplateId: string | null;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentEmailTemplateId, setCurrentEmailTemplateId] = useState<
    string | null
  >(emailTemplateId);
  const modalRef = useRef<HTMLDialogElement | null>(null);
  const prevOpenRef = useRef<boolean>(false);

  useEffect(() => {
    const modal = document.getElementById(
      MODAL_ID.DELETE_EMAIL_TEMPLATE
    ) as HTMLDialogElement;
    modalRef.current = modal;
    if (!modal) return;

    const handleClose = () => {
      setCurrentEmailTemplateId(null);
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
      const id = modal.getAttribute('data-email-template-id');

      if (isOpen && !prevOpenRef.current && id) {
        setCurrentEmailTemplateId(id);
      }

      prevOpenRef.current = isOpen;
    };

    const interval = setInterval(checkModalState, 100);
    return () => clearInterval(interval);
  }, []);

  const handleConfirmDelete = async () => {
    const idToDelete = emailTemplateId || currentEmailTemplateId;
    if (!idToDelete) return;

    setIsLoading(true);
    try {
      await deleteEmailTemplate(idToDelete);
      onCloseModal(MODAL_ID.DELETE_EMAIL_TEMPLATE);
    } catch (error) {
      console.error('Failed to delete email template:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onCloseModal(MODAL_ID.DELETE_EMAIL_TEMPLATE);
    setCurrentEmailTemplateId(null);
  };

  return (
    <dialog id={MODAL_ID.DELETE_EMAIL_TEMPLATE} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Delete Email Template</h3>
        <p className="py-4">
          Are you sure you want to delete this email template? This action
          cannot be undone.
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
