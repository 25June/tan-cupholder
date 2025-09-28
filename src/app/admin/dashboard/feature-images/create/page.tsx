import Breadcrumbs from '@/app/admin/ui/invoices/breadcrumbs';
import { Metadata } from 'next';
import CreateFeatureImageForm from '@/app/admin/ui/feature-images/create-form';

export const metadata: Metadata = {
  title: 'Create Feature Image'
};

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Feature Images', href: '/admin/dashboard/feature-images' },
          {
            label: 'Create Feature Image',
            href: '/admin/dashboard/feature-images/create',
            active: true
          }
        ]}
      />
      <CreateFeatureImageForm />
    </main>
  );
}
