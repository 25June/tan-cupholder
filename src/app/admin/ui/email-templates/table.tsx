'use client';

import { EmailTemplateResponse } from '@/models/emailTemplate';
import { More } from '@/app/admin/ui/email-templates/buttons';

export default function EmailTemplatesTable({
  templates
}: {
  templates: EmailTemplateResponse[];
}) {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {templates.map((template) => (
              <div key={template.id} className="mb-2 rounded-md bg-white p-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p className="text-sm text-gray-500">{template.name}</p>
                    </div>
                    <p className="text-sm text-gray-500">{template.subject}</p>
                  </div>
                </div>
                <div className="flex w-full items-end pt-4">
                  <div className="flex justify-end gap-2 w-full">
                    <More id={template.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium">
                  Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Subject
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Description
                </th>
                <th scope="col" className="py-3 pl-6 pr-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {templates?.map((template) => (
                <tr
                  key={template.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap px-3 py-3">
                    <div className="flex items-center gap-3">
                      <p className="font-medium">{template.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <p className="text-gray-500">{template.subject}</p>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <p className="text-gray-500 max-w-xs truncate">
                      {template.description}
                    </p>
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <More id={template.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
