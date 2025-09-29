import { EmailTemplateResponse } from '@/models/emailTemplate';
import { UpdateEmailTemplate, DeleteEmailTemplate } from './buttons';

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
                      <span
                        className={`ml-2 inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          template.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {template.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{template.subject}</p>
                  </div>
                </div>
                <div className="flex w-full items-end pt-4">
                  <div className="flex justify-end gap-2 w-full">
                    <UpdateEmailTemplate id={template.id} />
                    <DeleteEmailTemplate id={template.id} />
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
                  Status
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Description
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Created
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Updated
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
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        template.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {template.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <p className="text-gray-500 max-w-xs truncate">
                      {template.description || 'No description'}
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-gray-500">
                    {template.created_at}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-gray-500">
                    {template.updated_at}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateEmailTemplate id={template.id} />
                      <DeleteEmailTemplate id={template.id} />
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
