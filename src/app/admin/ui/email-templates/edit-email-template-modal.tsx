'use client';

import { useEffect, useState } from 'react';
import {
  updateEmailTemplate,
  State,
  fetchEmailTemplateById
} from '@/app/admin/lib/actions/email-templates.actions';
import { EmailTemplateResponse } from '@/models/emailTemplate';
import { onCloseModal } from '@/shared/utils/modal.utils';
import { MODAL_ID } from '@/constants/modal.const';
import Form from './form';

const initialState: State = { message: null, errors: {} };

interface EditEmailTemplateModalProps {
  readonly emailTemplateId: string | null;
  readonly onRefresh: () => void;
}

export default function EditEmailTemplateModal({
  emailTemplateId,
  onRefresh
}: EditEmailTemplateModalProps) {
  const [state, setState] = useState<State>(initialState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [emailTemplate, setEmailTemplate] =
    useState<EmailTemplateResponse | null>(null);
  const [mainContent, setMainContent] = useState<string>('');

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!emailTemplate || isLoading) return;

    const formData = new FormData(e.currentTarget);
    const newFormData = new FormData();
    newFormData.append('id', emailTemplate.id);
    newFormData.append('name', formData.get('name') as string);
    newFormData.append('subject', formData.get('subject') as string);
    newFormData.append('htmlContent', formData.get('htmlContent') as string);
    newFormData.append('description', formData.get('description') as string);
    setIsLoading(true);
    return updateEmailTemplate(emailTemplate.id, initialState, newFormData)
      .then((res: any) => {
        if (res.errors) {
          setState({
            message: res.message,
            errors: res.errors
          });
          setIsLoading(false);
          return;
        }
        handleClose(true);
      })
      .catch((error) => {
        setState({
          message: error.message,
          errors: error.errors
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    const loadData = async () => {
      if (!emailTemplateId) {
        setEmailTemplate(null);
        setMainContent('');
        setState(initialState);
        return;
      }

      try {
        const templateData = await fetchEmailTemplateById(emailTemplateId);
        setEmailTemplate(templateData);
        setMainContent(templateData.htmlContent || '');
      } catch (error) {
        console.error('Failed to load email template data:', error);
      }
    };

    loadData();
  }, [emailTemplateId]);

  const handleClose = (refresh?: boolean) => {
    onCloseModal(MODAL_ID.UPDATE_EMAIL_TEMPLATE);
    setState(initialState);
    setEmailTemplate(null);
    setMainContent('');
    if (refresh) {
      onRefresh();
    }
  };

  return (
    <dialog id={MODAL_ID.UPDATE_EMAIL_TEMPLATE} className="modal">
      <div className="modal-box max-w-6xl">
        <h3 className="font-bold text-lg mb-4">Edit Email Template</h3>
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <Form
            defaultValues={emailTemplate}
            onSubmit={handleFormSubmit}
            onCancel={handleClose}
            errors={state.errors || {}}
            isPending={isLoading}
            mainContent={mainContent}
            setMainContent={setMainContent}
          />
        )}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={() => handleClose()}>close</button>
      </form>
    </dialog>
  );
}
