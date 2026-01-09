'use client';

import { useState } from 'react';
import { deleteEmailTemplate } from '@/app/admin/lib/actions/email-templates.actions';
import { onCloseModal } from '@/shared/utils/modal.utils';
import { MODAL_ID } from '@/constants/modal.const';
import { EmailTemplateResponse } from '@/models/emailTemplate';

interface DeleteEmailTemplateModalProps {
  readonly emailTemplate: EmailTemplateResponse | null;
  readonly onRefresh: () => void;
}

export default function DeleteEmailTemplateModal({
  emailTemplate,
  onRefresh
}: DeleteEmailTemplateModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirmDelete = async () => {
    if (!emailTemplate?.id) return;

    setIsLoading(true);
    try {
      await deleteEmailTemplate(emailTemplate.id);
      handleClose(true);
    } catch (error) {
      console.error('Failed to delete email template:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = (refresh?: boolean) => {
    onCloseModal(MODAL_ID.DELETE_EMAIL_TEMPLATE);
    if (refresh) {
      onRefresh();
    }
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
