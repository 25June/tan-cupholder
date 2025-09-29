'use client';

import { useState, useEffect } from 'react';
import {
  State,
  updateEmailTemplate
} from '@/app/admin/lib/actions/email-templates.actions';
import { useRouter } from 'next/navigation';
import { EmailTemplate } from '@/models/emailTemplate';
import { getLayoutTemplate } from '@/constants/email-template.const';

const initialState: State = { message: null, errors: {} };

export default function UpdateEmailTemplateForm({
  emailTemplate
}: {
  emailTemplate: EmailTemplate;
}) {
  const [state, setState] = useState<State>(initialState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mainContent, setMainContent] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    if (emailTemplate.htmlContent) {
      setMainContent(emailTemplate.htmlContent);
    }
  }, [emailTemplate]);

  const handleFormSubmit = async (formData: FormData) => {
    const newFormData = new FormData();
    newFormData.append('id', emailTemplate.id);
    newFormData.append('name', formData.get('name') as string);
    newFormData.append('subject', formData.get('subject') as string);
    newFormData.append('htmlContent', formData.get('htmlContent') as string);
    newFormData.append('description', formData.get('description') as string);
    setIsLoading(true);
    return updateEmailTemplate(emailTemplate.id, initialState, newFormData)
      .then((res: any) => {
        if (res.message) {
          setState({
            message: res.message,
            errors: res.errors
          });
        }
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

  return (
    <form action={handleFormSubmit}>
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
                className="textarea w-full"
                placeholder="Email Template HTML Content"
                defaultValue={emailTemplate.htmlContent}
              />
              <div id="htmlContent-error" aria-live="polite" aria-atomic="true">
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
            <div className="bg-gray-100 overflow-auto p-4">
              <table
                className="m-auto"
                dangerouslySetInnerHTML={{
                  __html: getLayoutTemplate(mainContent)
                }}
              ></table>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={() => router.push('/admin/dashboard/email-templates')}
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
  );
}
