import { Metadata } from 'next';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Breadcrumbs from '@/app/admin/ui/invoices/breadcrumbs';
import UpdateEmailTemplateForm from '@/app/admin/ui/email-templates/update-form';
import { fetchEmailTemplateById } from '@/app/admin/lib/actions/email-templates.actions';

export const metadata: Metadata = {
  title: 'Edit Email Template'
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  // Auth protection
  const session = await auth();
  if (!session) {
    redirect('/admin');
  }

  const params = await props.params;
  const template = await fetchEmailTemplateById(params.id);
  console.log(template);
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          {
            label: 'Email Templates',
            href: '/admin/dashboard/email-templates'
          },
          {
            label: `Edit ${template.name}`,
            href: `/admin/dashboard/email-templates/${params.id}/edit`,
            active: true
          }
        ]}
      />
      <UpdateEmailTemplateForm emailTemplate={template} />
    </main>
  );
}
