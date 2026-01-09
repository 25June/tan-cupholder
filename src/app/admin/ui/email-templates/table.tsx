'use client';

import { EmailTemplateResponse } from '@/models/emailTemplate';
import { More } from '@/app/admin/ui/email-templates/buttons';
import SimpleTable, { Column } from '@/components/simple-table/SimpleTable';

interface EmailTemplatesTableProps {
  readonly templates: EmailTemplateResponse[];
  readonly loading: boolean;
  readonly onSelectTemplate: (template: EmailTemplateResponse) => void;
}

export default function EmailTemplatesTable({
  templates,
  loading = false,
  onSelectTemplate
}: EmailTemplatesTableProps) {
  const columns: Column<EmailTemplateResponse>[] = [
    {
      header: 'Name',
      render: (template) => (
        <div className="flex items-center gap-3">
          <p className="font-medium">{template.name}</p>
        </div>
      )
    },
    {
      header: 'Subject',
      render: (template) => <p className="text-gray-500">{template.subject}</p>
    },
    {
      header: 'Description',
      render: (template) => (
        <p className="text-gray-500 max-w-xs truncate">
          {template.description}
        </p>
      )
    }
  ];

  return (
    <SimpleTable
      data={templates}
      columns={columns}
      keyExtractor={(template) => template.id}
      actions={(template) => (
        <More onSelectTemplate={() => onSelectTemplate(template)} />
      )}
      emptyMessage="No email templates found"
      loading={loading}
    />
  );
}
