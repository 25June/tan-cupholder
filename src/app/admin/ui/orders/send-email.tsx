'use client';

import { useEffect, useState } from 'react';
import { EmailTemplateResponse } from '@/models/emailTemplate';
import { fetchEmailTemplates } from '@/app/admin/lib/actions/email-templates.actions';
import SendEmailModal from '../email-templates/send-email-modal';
import { onOpenModal } from '@/shared/utils/modal.utils';
import { MODAL_ID } from '@/constants/modal.const';

interface SendEmailToCustomerProps {
  readonly orderId: string;
  readonly email: string;
}
export default function SendEmailToCustomer({
  orderId,
  email
}: SendEmailToCustomerProps) {
  // get list email templates
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplateResponse[]>(
    []
  );
  const [selectedEmailTemplate, setSelectedEmailTemplate] =
    useState<EmailTemplateResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    const fetchEmailTemplatesData = async () => {
      try {
        const templates = await fetchEmailTemplates();
        setEmailTemplates(templates);
      } catch (error) {
        console.error('Failed to fetch email templates:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEmailTemplatesData();
  }, []);

  const openSendEmailModal = () => {
    onOpenModal(MODAL_ID.SEND_EMAIL);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <select
        className="select select-bordered w-full max-w-xs"
        disabled={isLoading}
        value={selectedEmailTemplate?.id}
        onChange={(e) => {
          const template = emailTemplates.find(
            (template) => template.id === e.target.value
          );
          setSelectedEmailTemplate(template || null);
        }}
      >
        <option value="">Select Email Template</option>
        {emailTemplates.map((template) => (
          <option key={template.id} value={template.id}>
            {template.name}
          </option>
        ))}
      </select>
      <button
        className="bg-logo-orange-border text-white px-4 py-2 rounded-md w-full"
        onClick={openSendEmailModal}
      >
        Send Email
      </button>
      <SendEmailModal
        jsonEmailTemplate={JSON.stringify(selectedEmailTemplate)}
        orderId={orderId}
        to={email}
      />
    </div>
  );
}
