'use client';

import { useState, useEffect } from 'react';
import { MODAL_ID } from '@/constants/modal.const';
import { EmailTemplateResponse } from '@/models/emailTemplate';
import {
  sendCustomEmail,
  SendCustomEmailState
} from '../../lib/actions/email.actions';
import { onCloseModal } from '@/shared/utils/modal.utils';
import SendEmailForm from './send-email-form';

interface SendEmailModalProps {
  readonly emailTemplate: EmailTemplateResponse | null;
  readonly orderId?: string;
  readonly to?: string;
  readonly onReset: () => void;
}

const initialState: SendCustomEmailState = { message: null, errors: {} };

const SendEmailModal = ({
  emailTemplate,
  orderId,
  to,
  onReset
}: SendEmailModalProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [state, setState] = useState<SendCustomEmailState>(initialState);

  useEffect(() => {
    if (!emailTemplate) {
      setState(initialState);
    }
  }, [emailTemplate]);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!emailTemplate) return;

    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append('orderId', orderId || '');
    try {
      const data = await sendCustomEmail(formData);
      if (data.errors) {
        setState({
          message: data.message,
          errors: data.errors
        });
        return;
      }
      handleClose();
    } catch (error: any) {
      console.error('Failed to send email:', error);
      setState({
        message: error.message,
        errors: error.errors
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onCloseModal(MODAL_ID.SEND_EMAIL);
    setState(initialState);
    onReset();
  };

  return (
    <dialog id={MODAL_ID.SEND_EMAIL} className="modal">
      <div className="modal-box max-w-6xl">
        <h3 className="font-bold text-lg mb-4">Send Email</h3>
        {emailTemplate ? (
          <SendEmailForm
            defaultSubject={emailTemplate.subject}
            defaultHtmlContent={emailTemplate.htmlContent}
            defaultTo={to || ''}
            onSubmit={handleFormSubmit}
            onCancel={handleClose}
            errors={state.errors || {}}
            isPending={isLoading}
          />
        ) : (
          <div className="flex justify-center items-center p-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        )}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleClose}>close</button>
      </form>
    </dialog>
  );
};

export default SendEmailModal;
