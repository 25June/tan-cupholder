import Form from '@/app/admin/ui/users/update-form';
import Breadcrumbs from '@/app/admin/ui/invoices/breadcrumbs';
import { fetchUserById } from '@/app/admin/lib/actions/user.actions';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit User'
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const user = await fetchUserById(id);

  if (!user) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Users', href: '/admin/dashboard/users' },
          {
            label: 'Edit User',
            href: `/admin/dashboard/users/${id}/edit`,
            active: true
          }
        ]}
      />
      <Form user={user} />
    </main>
  );
}
