'use client';

import { useCallback, useEffect, useState } from 'react';
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

export default function Page() {
  const searchParams = useSearchParams();
  const query = searchParams?.get('query') || '';
  const containsPage = Number(searchParams?.get('page')) || 1;
  const { isAuthenticated, isLoading: sessionLoading } = useSession();

  const [emailTemplates, setEmailTemplates] = useState<EmailTemplateResponse[]>(
    []
  );
  const [totalTemplates, setTotalTemplates] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEmailTemplateId, setSelectedEmailTemplateId] = useState<
    string | null
  >(null);

  const loadEmailTemplates = useCallback(async () => {
    if (!isAuthenticated) return;

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
  }, [containsPage, isAuthenticated, query]);

  useEffect(() => {
    loadEmailTemplates();
  }, [loadEmailTemplates]);

  const handleRefresh = () => {
    loadEmailTemplates();
    setSelectedEmailTemplateId(null);
  };

  if (sessionLoading) {
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
      <EmailTemplatesTable
        templates={emailTemplates}
        loading={isLoading}
        onSelectTemplate={setSelectedEmailTemplateId}
      />
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={Math.ceil(totalTemplates / 10)} />
      </div>
      <CreateEmailTemplateModal onRefresh={handleRefresh} />
      <EditEmailTemplateModal
        emailTemplateId={selectedEmailTemplateId}
        onRefresh={handleRefresh}
      />
      <DeleteEmailTemplateModal
        emailTemplateId={selectedEmailTemplateId}
        onRefresh={handleRefresh}
      />
    </main>
  );
}
