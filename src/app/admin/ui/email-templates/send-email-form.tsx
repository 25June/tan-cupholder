'use client';

import { useState, useMemo, useCallback, FormEventHandler } from 'react';
import { getLayoutTemplate } from '@/constants/email-template.const';

interface SendEmailFormProps {
  readonly defaultSubject: string;
  readonly defaultHtmlContent: string;
  readonly onSubmit: FormEventHandler<HTMLFormElement>;
  readonly onCancel: () => void;
  readonly errors: {
    to?: string[];
    subject?: string[];
    htmlContent?: string[];
  };
  readonly isPending: boolean;
  readonly defaultTo: string;
}

// Regex to match ${data.variableName} or ${data.variableName || 'default'} patterns
const VARIABLE_PATTERN = /\$\{data\.(\w+)(?:\s*\|\|\s*['"][^'"]*['"])?\}/g;

// Extract unique variable names from HTML content
const extractVariables = (htmlContent: string): string[] => {
  const matches = htmlContent.matchAll(VARIABLE_PATTERN);
  const variables = new Set<string>();
  for (const match of matches) {
    variables.add(match[1]);
  }
  return Array.from(variables);
};

// Convert camelCase or snake_case to readable label
const formatLabel = (variableName: string): string => {
  return variableName
    .replaceAll(/([A-Z])/g, ' $1') // Add space before capital letters
    .replaceAll('_', ' ') // Replace underscores with spaces
    .replace(/^\w/, (char) => char.toUpperCase()) // Capitalize first letter
    .trim();
};

// Reusable error display component
const FieldErrors = ({ id, errors }: { id: string; errors?: string[] }) => {
  if (!errors?.length) return null;
  return (
    <div id={id} aria-live="polite" aria-atomic="true">
      {errors.map((error: string) => (
        <p className="text-sm text-red-500" key={error}>
          {error}
        </p>
      ))}
    </div>
  );
};

const SendEmailForm = ({
  defaultSubject,
  defaultHtmlContent,
  onSubmit,
  onCancel,
  errors,
  isPending,
  defaultTo
}: SendEmailFormProps) => {
  const [variableValues, setVariableValues] = useState<Record<string, string>>(
    {}
  );

  // Extract variables from the template
  const variables = useMemo(
    () => extractVariables(defaultHtmlContent),
    [defaultHtmlContent]
  );

  // Replace variables in content with their values
  const processedContent = useMemo(() => {
    let content = defaultHtmlContent;
    for (const [key, value] of Object.entries(variableValues)) {
      // Match ${data.variableName} or ${data.variableName || 'default'}
      const regex = new RegExp(
        String.raw`\$\{data\.${key}(?:\s*\|\|\s*['"][^'"]*['"])?\}`,
        'g'
      );
      content = content.replaceAll(regex, value || `\${data.${key}}`);
    }
    return content;
  }, [defaultHtmlContent, variableValues]);

  // Handle variable input change
  const handleVariableChange = useCallback((name: string, value: string) => {
    setVariableValues((prev) => ({
      ...prev,
      [name]: value
    }));
  }, []);

  return (
    <form onSubmit={onSubmit}>
      <fieldset disabled={isPending} className="form-control w-full max-w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left column - Form inputs */}
          <div className="flex flex-col gap-4 w-full">
            {/* Recipient Email */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">To (Email Address)</legend>
              <input
                type="email"
                name="to"
                className="input w-full"
                placeholder="recipient@example.com"
                required
                aria-describedby="to-error"
                aria-invalid={!!errors?.to?.length}
                defaultValue={defaultTo}
              />
              <FieldErrors id="to-error" errors={errors?.to} />
            </fieldset>

            {/* Subject */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Subject</legend>
              <input
                type="text"
                name="subject"
                className="input w-full"
                placeholder="Email Subject"
                defaultValue={defaultSubject}
                required
                aria-describedby="subject-error"
                aria-invalid={!!errors?.subject?.length}
              />
              <FieldErrors id="subject-error" errors={errors?.subject} />
            </fieldset>

            {/* Dynamic Variable Inputs */}
            {variables.length > 0 && (
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Template Variables ({variables.length})
                </h4>
                <p className="text-xs text-gray-500 mb-4">
                  Fill in the values below to replace the{' '}
                  <code className="bg-gray-200 px-1 rounded text-xs">
                    {'${data.variable}'}
                  </code>{' '}
                  placeholders in the template.
                </p>
                <div className="flex flex-col gap-3">
                  {variables.map((variable) => (
                    <fieldset key={variable} className="fieldset">
                      <legend className="fieldset-legend text-xs">
                        {formatLabel(variable)}
                      </legend>
                      <input
                        type="text"
                        className="input input-sm w-full"
                        placeholder={`Enter ${formatLabel(
                          variable
                        ).toLowerCase()}`}
                        value={variableValues[variable] || ''}
                        onChange={(e) =>
                          handleVariableChange(variable, e.target.value)
                        }
                      />
                    </fieldset>
                  ))}
                </div>
              </div>
            )}

            {/* Hidden input for processed HTML content */}
            <input type="hidden" name="htmlContent" value={processedContent} />
          </div>

          {/* Right column - Preview */}
          <aside className="w-full">
            <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
              Email Preview
            </h4>
            <div className="bg-gray-100 overflow-auto p-4 max-h-128 rounded-lg border border-gray-200">
              <div
                className="m-auto w-full"
                dangerouslySetInnerHTML={{
                  __html: getLayoutTemplate(processedContent)
                }}
              />
            </div>
            {variables.length > 0 && (
              <p className="text-xs text-gray-400 mt-2">
                Variables shown as{' '}
                <code className="bg-gray-200 px-1 rounded">
                  {'${data.variableName}'}
                </code>{' '}
                will be replaced with your input values.
              </p>
            )}
          </aside>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-ghost max-w-40 w-full"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="btn btn-primary grow"
            disabled={isPending}
          >
            {isPending && <span className="loading loading-spinner"></span>}
            Send Email
          </button>
        </div>
      </fieldset>
    </form>
  );
};

export default SendEmailForm;
