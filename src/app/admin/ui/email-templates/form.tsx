import { FormEventHandler } from 'react';
import { getLayoutTemplate } from '@/constants/email-template.const';
import { EmailTemplateFormData } from '@/models/emailTemplate';
import FieldErrors from '@/app/material/field-errors';
import { DEFAULT_HTML_CONTENT } from '@/constants/email-template';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

interface FormProps {
  readonly defaultValues?: EmailTemplateFormData | null;
  readonly onSubmit: FormEventHandler<HTMLFormElement>;
  readonly onCancel: () => void;
  readonly errors: {
    name?: string[];
    subject?: string[];
    htmlContent?: string[];
    description?: string[];
    isActive?: string[];
  };
  readonly isPending: boolean;
  readonly mainContent: string;
  readonly setMainContent: (content: string) => void;
}

const Form = ({
  defaultValues,
  onSubmit,
  onCancel,
  errors,
  isPending,
  mainContent,
  setMainContent
}: FormProps) => {
  return (
    <form onSubmit={onSubmit}>
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
                defaultValue={defaultValues?.name}
                aria-describedby="name-error"
                aria-invalid={!!errors?.name?.length}
              />
              <FieldErrors id="name-error" errors={errors?.name} />
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Subject</legend>
              <input
                type="text"
                name="subject"
                className="input w-full"
                placeholder="Email Template Subject"
                defaultValue={defaultValues?.subject}
                aria-describedby="subject-error"
                aria-invalid={!!errors?.subject?.length}
              />
              <FieldErrors id="subject-error" errors={errors?.subject} />
            </fieldset>

            <fieldset className="fieldset">
              <div className="flex justify-between items-center">
                <legend className="fieldset-legend">HTML Content</legend>
                <div className="tooltip tooltip-info">
                  <div className="tooltip-content">
                    <span>How to use the HTML content:</span>
                    <div
                      dangerouslySetInnerHTML={{ __html: DEFAULT_HTML_CONTENT }}
                    />
                  </div>
                  <InformationCircleIcon className="w-4 h-4" />
                </div>
              </div>

              <textarea
                name="htmlContent"
                className="textarea w-full h-48"
                placeholder="Email Template HTML Content"
                defaultValue={
                  defaultValues?.htmlContent || DEFAULT_HTML_CONTENT
                }
                onChange={(e) => setMainContent(e.target.value)}
                aria-describedby="htmlContent-error"
                aria-invalid={!!errors?.htmlContent?.length}
              />
              <FieldErrors
                id="htmlContent-error"
                errors={errors?.htmlContent}
              />
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Description</legend>
              <textarea
                name="description"
                className="textarea w-full"
                placeholder="Email Template Description"
                defaultValue={defaultValues?.description}
                aria-describedby="description-error"
                aria-invalid={!!errors?.description?.length}
              />
              <FieldErrors
                id="description-error"
                errors={errors?.description}
              />
            </fieldset>
          </div>
          <div className="w-full">
            <div className="bg-gray-100 overflow-auto p-4">
              <div
                className="m-auto w-full"
                dangerouslySetInnerHTML={{
                  __html: getLayoutTemplate(
                    mainContent ||
                      defaultValues?.htmlContent ||
                      DEFAULT_HTML_CONTENT
                  )
                }}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={() => onCancel()}
            className="btn btn-ghost max-w-40 w-full"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="btn btn-primary grow"
            disabled={isPending}
            aria-disabled={isPending}
          >
            {isPending && <span className="loading loading-spinner"></span>}{' '}
            Save
          </button>
        </div>
      </div>
    </form>
  );
};

export default Form;
