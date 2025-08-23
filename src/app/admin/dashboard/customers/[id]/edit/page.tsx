import Form from '@/app/admin/ui/customers/update-form';
import Breadcrumbs from '@/app/admin/ui/invoices/breadcrumbs';
import { fetchCustomerById } from '@/app/admin/lib/actions/customers.action';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Customer'
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const customer = await fetchCustomerById(id);

  if (!customer) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Customers', href: '/admin/dashboard/customers' },
          {
            label: 'Edit Customer',
            href: `/admin/dashboard/customers/${id}/edit`,
            active: true
          }
        ]}
      />
      <Form customer={customer} />
    </main>
  );
}
