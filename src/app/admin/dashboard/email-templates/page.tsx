'use client';

import { useEffect, useState } from 'react';
import {
  fetchEmailTemplates,
  fetchTotalEmailTemplates
} from '@/app/admin/lib/actions/email-templates.actions';
import EmailTemplatesTable from '@/app/admin/ui/email-templates/table';
import { lusitana } from '@/app/admin/ui/fonts';
import Search from '@/app/admin/ui/search';
import { CreateEmailTemplate } from '@/app/admin/ui/email-templates/buttons';
import Pagination from '@/app/admin/ui/invoices/pagination';
import { EmailTemplateResponse } from '@/models/emailTemplate';
import CreateEmailTemplateModal from '@/app/admin/ui/email-templates/create-email-template-modal';
import EditEmailTemplateModal from '@/app/admin/ui/email-templates/edit-email-template-modal';
import DeleteEmailTemplateModal from '@/app/admin/ui/email-templates/delete-email-template-modal';
import { useSearchParams } from 'next/navigation';
import { useSession } from '@/hooks/useSession';
import { useRouter } from 'next/navigation';

export default function Page() {
  const searchParams = useSearchParams();
  const query = searchParams?.get('query') || '';
  const containsPage = Number(searchParams?.get('page')) || 1;
  const router = useRouter();
  const { isAuthenticated, isLoading: sessionLoading } = useSession();

  const [emailTemplates, setEmailTemplates] = useState<EmailTemplateResponse[]>(
    []
  );
  const [totalTemplates, setTotalTemplates] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!sessionLoading && !isAuthenticated) {
      router.push('/admin');
      return;
    }
  }, [isAuthenticated, sessionLoading, router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadData = async () => {
      setIsLoading(true);
      try {
        const [templatesData, totalData] = await Promise.all([
          fetchEmailTemplates({
            query,
            page: containsPage.toString()
          }),
          fetchTotalEmailTemplates()
        ]);

        setEmailTemplates(templatesData);
        setTotalTemplates(totalData);
      } catch (error) {
        console.error('Failed to load email templates:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [query, containsPage, isAuthenticated]);

  if (sessionLoading || !isAuthenticated) {
    return (
      <main>
        <div className="flex justify-center items-center p-8">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </main>
    );
  }

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
      {isLoading ? (
        <div className="flex justify-center items-center p-8">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <>
          <EmailTemplatesTable templates={emailTemplates} />
          <div className="mt-5 flex w-full justify-center">
            <Pagination totalPages={Math.ceil(totalTemplates / 10)} />
          </div>
        </>
      )}
      <CreateEmailTemplateModal />
      <EditEmailTemplateModal emailTemplateId={null} />
      <DeleteEmailTemplateModal emailTemplateId={null} />
    </main>
  );
}
