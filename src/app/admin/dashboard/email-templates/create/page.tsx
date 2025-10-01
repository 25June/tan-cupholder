import { Metadata } from 'next';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Breadcrumbs from '@/app/admin/ui/invoices/breadcrumbs';
import CreateEmailTemplateForm from '@/app/admin/ui/email-templates/create-form';

export const metadata: Metadata = {
  title: 'Create Email Template'
};

export default async function Page() {
  // Auth protection
  const session = await auth();
  if (!session) {
    redirect('/admin');
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          {
            label: 'Email Templates',
            href: '/admin/dashboard/email-templates'
          },
          {
            label: 'Create Email Template',
            href: '/admin/dashboard/email-templates/create',
            active: true
          }
        ]}
      />
      <CreateEmailTemplateForm />
    </main>
  );
}
