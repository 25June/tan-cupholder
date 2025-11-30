'use client';

import { useState } from 'react';
import { deleteUser } from '@/app/admin/lib/actions/user.actions';
import { onCloseModal } from '@/shared/utils/modal.utils';
import { MODAL_ID } from '@/constants/modal.const';

export default function DeleteUserModal({
  userId,
  onRefresh
}: {
  userId: string | null;
  onRefresh: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirmDelete = async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      await deleteUser(userId);
      handleClose(true);
    } catch (error) {
      console.error('Failed to delete user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = (refresh?: boolean) => {
    onCloseModal(MODAL_ID.DELETE_USER);
    if (refresh) {
      onRefresh();
    }
  };

  return (
    <dialog id={MODAL_ID.DELETE_USER} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Delete User</h3>
        <p className="py-4">
          Are you sure you want to delete this user? This will set the user
          status to INACTIVE. This action cannot be undone.
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
