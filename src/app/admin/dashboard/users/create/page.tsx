import Form from '@/app/admin/ui/users/create-form';
import Breadcrumbs from '@/app/admin/ui/invoices/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create User'
};

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Users', href: '/admin/dashboard/users' },
          {
            label: 'Create User',
            href: '/admin/dashboard/users/create',
            active: true
          }
        ]}
      />
      <Form />
    </main>
  );
}
