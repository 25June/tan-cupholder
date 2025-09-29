import { Metadata } from 'next';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import {
  fetchEmailTemplates,
  fetchTotalEmailTemplates
} from '@/app/admin/lib/actions/email-templates.actions';
import EmailTemplatesTable from '@/app/admin/ui/email-templates/table';
import { lusitana } from '@/app/admin/ui/fonts';
import Search from '@/app/admin/ui/search';
import { CreateEmailTemplate } from '@/app/admin/ui/email-templates/buttons';
import { Suspense } from 'react';
import Pagination from '@/app/admin/ui/invoices/pagination';

export const metadata: Metadata = {
  title: 'Email Templates'
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  // Auth protection
  const session = await auth();
  if (!session) {
    redirect('/admin');
  }

  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const containsPage = Number(searchParams?.page) || 1;

  // Fetch data with auth validation
  const emailTemplates = await fetchEmailTemplates({
    query,
    page: containsPage.toString()
  });
  const totalTemplates = await fetchTotalEmailTemplates();

  return (
    <main>
      <div className="flex w-full items-center justify-between mb-8">
        <h1 className={`${lusitana.className} text-xl md:text-2xl`}>
          Email Templates
        </h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search email templates..." />
        <CreateEmailTemplate />
      </div>
      <Suspense
        key={query + containsPage}
        fallback={<div className="mt-4">Loading...</div>}
      >
        <EmailTemplatesTable templates={emailTemplates} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={Math.ceil(totalTemplates / 10)} />
      </div>
    </main>
  );
}
