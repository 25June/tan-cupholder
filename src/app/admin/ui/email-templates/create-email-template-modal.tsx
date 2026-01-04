'use client';

import { useState } from 'react';
import {
  createEmailTemplate,
  State
} from '@/app/admin/lib/actions/email-templates.actions';
import { onCloseModal } from '@/shared/utils/modal.utils';
import { MODAL_ID } from '@/constants/modal.const';
import Form from './form';

const initialState: State = { message: null, errors: {} };

interface CreateEmailTemplateModalProps {
  readonly onRefresh: () => void;
}

export default function CreateEmailTemplateModal({
  onRefresh
}: CreateEmailTemplateModalProps) {
  const [state, setState] = useState<State>(initialState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mainContent, setMainContent] = useState<string>('');

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (isLoading) return;

    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setIsLoading(true);
    const newFormData = new FormData();
    newFormData.append('name', formData.get('name') as string);
    newFormData.append('subject', formData.get('subject') as string);
    newFormData.append('htmlContent', formData.get('htmlContent') as string);
    newFormData.append('description', formData.get('description') as string);

    try {
      const res = await createEmailTemplate(initialState, newFormData);
      if (res.errors) {
        setState({
          message: res.message,
          errors: res.errors
        });
        throw new Error(res.message);
      }
      handleClose(true);
    } catch (error: any) {
      setState({
        message: error.message,
        errors: error.errors
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = (refresh?: boolean) => {
    onCloseModal(MODAL_ID.ADD_EMAIL_TEMPLATE);
    setState(initialState);
    setMainContent('');
    if (refresh) {
      onRefresh();
    }
  };

  return (
    <dialog id={MODAL_ID.ADD_EMAIL_TEMPLATE} className="modal">
      <div className="modal-box max-w-6xl">
        <h3 className="font-bold text-lg mb-4">Create Email Template</h3>
        <Form
          onSubmit={handleFormSubmit}
          onCancel={handleClose}
          errors={state.errors || {}}
          isPending={isLoading}
          mainContent={mainContent}
          setMainContent={setMainContent}
          defaultValues={undefined}
        />
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={() => handleClose()}>close</button>
      </form>
    </dialog>
  );
}
