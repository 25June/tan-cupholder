'use client';

import { useEffect, useState, useRef } from 'react';
import {
  updateEmailTemplate,
  State,
  fetchEmailTemplateById
} from '@/app/admin/lib/actions/email-templates.actions';
import { EmailTemplateResponse } from '@/models/emailTemplate';
import { onCloseModal } from '@/shared/utils/modal.utils';
import { MODAL_ID } from '@/constants/modal.const';
import { getLayoutTemplate } from '@/constants/email-template.const';

const initialState: State = { message: null, errors: {} };

export default function EditEmailTemplateModal({
  emailTemplateId
}: {
  emailTemplateId: string | null;
}) {
  const [state, setState] = useState<State>(initialState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [emailTemplate, setEmailTemplate] =
    useState<EmailTemplateResponse | null>(null);
  const [mainContent, setMainContent] = useState<string>('');
  const [currentEmailTemplateId, setCurrentEmailTemplateId] = useState<
    string | null
  >(emailTemplateId);
  const modalRef = useRef<HTMLDialogElement | null>(null);
  const prevOpenRef = useRef<boolean>(false);

  useEffect(() => {
    const modal = document.getElementById(
      MODAL_ID.UPDATE_EMAIL_TEMPLATE
    ) as HTMLDialogElement;
    modalRef.current = modal;
    if (!modal) return;

    const handleClose = () => {
      setEmailTemplate(null);
      setCurrentEmailTemplateId(null);
      setState(initialState);
      setMainContent('');
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

  useEffect(() => {
    const loadData = async () => {
      const idToLoad = emailTemplateId || currentEmailTemplateId;
      if (!idToLoad) return;

      try {
        const templateData = await fetchEmailTemplateById(idToLoad);
        setEmailTemplate(templateData);
        if (templateData.htmlContent) {
          setMainContent(templateData.htmlContent);
        }
      } catch (error) {
        console.error('Failed to load email template data:', error);
      }
    };
    loadData();
  }, [emailTemplateId, currentEmailTemplateId]);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!emailTemplate) return;

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
        onCloseModal(MODAL_ID.UPDATE_EMAIL_TEMPLATE);
        setState(initialState);
        window.location.reload();
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

  const handleClose = () => {
    onCloseModal(MODAL_ID.UPDATE_EMAIL_TEMPLATE);
    setState(initialState);
    setEmailTemplate(null);
    setMainContent('');
  };

  if (!emailTemplate) {
    return (
      <dialog id={MODAL_ID.UPDATE_EMAIL_TEMPLATE} className="modal">
        <div className="modal-box max-w-6xl">
          <div className="flex justify-center items-center p-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={handleClose}>close</button>
        </form>
      </dialog>
    );
  }

  return (
    <dialog id={MODAL_ID.UPDATE_EMAIL_TEMPLATE} className="modal">
      <div className="modal-box max-w-6xl">
        <h3 className="font-bold text-lg mb-4">Edit Email Template</h3>
        <form onSubmit={handleFormSubmit}>
          <div className="form-control w-full max-w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-4 w-full">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Name</legend>
                  <input
                    type="text"
                    name="name"
                    className="input w-full"
                    placeholder="Email Template Name"
                    defaultValue={emailTemplate.name}
                  />
                  <div id="name-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.name &&
                      state.errors.name.map((error: string) => (
                        <p className="text-sm text-red-500" key={error}>
                          {error}
                        </p>
                      ))}
                  </div>
                </fieldset>

                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Subject</legend>
                  <input
                    type="text"
                    name="subject"
                    className="input w-full"
                    placeholder="Email Template Subject"
                    defaultValue={emailTemplate.subject}
                  />
                </fieldset>

                <fieldset className="fieldset">
                  <legend className="fieldset-legend">HTML Content</legend>
                  <textarea
                    name="htmlContent"
                    className="textarea w-full h-48"
                    placeholder="Email Template HTML Content"
                    defaultValue={emailTemplate.htmlContent}
                    onChange={(e) => setMainContent(e.target.value)}
                  />
                  <div
                    id="htmlContent-error"
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    {state.errors?.htmlContent &&
                      state.errors.htmlContent.map((error: string) => (
                        <p className="text-sm text-red-500" key={error}>
                          {error}
                        </p>
                      ))}
                  </div>
                </fieldset>

                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Description</legend>
                  <textarea
                    name="description"
                    className="textarea w-full"
                    placeholder="Email Template Description"
                    defaultValue={emailTemplate.description}
                  />
                </fieldset>
              </div>
              <div>
                <div className="bg-gray-100 overflow-auto p-4 max-h-96">
                  <table
                    className="m-auto"
                    dangerouslySetInnerHTML={{
                      __html: getLayoutTemplate(
                        mainContent || emailTemplate.htmlContent
                      )
                    }}
                  ></table>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={handleClose}
                className="btn btn-ghost max-w-40 w-full"
              >
                Cancel
              </button>

              <button type="submit" className="btn btn-primary grow-1">
                {isLoading && <span className="loading loading-spinner"></span>}{' '}
                Update Email Template
              </button>
            </div>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleClose}>close</button>
      </form>
    </dialog>
  );
}
