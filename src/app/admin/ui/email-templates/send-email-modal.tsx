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
  readonly jsonEmailTemplate: string | null;
}

const initialState: SendCustomEmailState = { message: null, errors: {} };

const SendEmailModal = ({ jsonEmailTemplate }: SendEmailModalProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [emailTemplate, setEmailTemplate] =
    useState<EmailTemplateResponse | null>(null);
  const [state, setState] = useState<SendCustomEmailState>(initialState);

  useEffect(() => {
    if (!jsonEmailTemplate) {
      setEmailTemplate(null);
      setState(initialState);
      return;
    }
    try {
      const templateData = JSON.parse(
        jsonEmailTemplate
      ) as EmailTemplateResponse;
      setEmailTemplate(templateData);
    } catch (error) {
      console.error('Failed to parse email template:', error);
      setEmailTemplate(null);
    }
  }, [jsonEmailTemplate]);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!emailTemplate) return;

    setIsLoading(true);
    const formData = new FormData(e.currentTarget);

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
    setEmailTemplate(null);
  };

  return (
    <dialog id={MODAL_ID.SEND_EMAIL} className="modal">
      <div className="modal-box max-w-6xl">
        <h3 className="font-bold text-lg mb-4">Send Email</h3>
        {emailTemplate ? (
          <SendEmailForm
            defaultSubject={emailTemplate.subject}
            defaultHtmlContent={emailTemplate.htmlContent}
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
