'use client';

import { useState, useEffect, useCallback } from 'react';
import Pagination from '@/app/admin/ui/invoices/pagination';
import Search from '@/app/admin/ui/search';
import Table from '@/app/admin/ui/invoices/table';
import { CreateInvoice } from '@/app/admin/ui/invoices/buttons';
import { lusitana } from '@/app/admin/ui/fonts';
import {
  getFilteredInvoices,
  getInvoicesPages
} from '@/app/admin/lib/actions/invoices.actions';
import { InvoicesTable as InvoiceType } from '@/app/admin/lib/definitions';
import CreateInvoiceModal from '@/app/admin/ui/invoices/create-invoice-modal';
import DeleteInvoiceModal from '@/app/admin/ui/invoices/delete-invoice-modal';
import ViewInvoiceModal from '@/app/admin/ui/invoices/view-invoice-modal';
import InvoiceSummary from '@/app/admin/ui/invoices/invoice-summary';
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const searchParams = useSearchParams();

  const query = searchParams.get('query') || '';
  const currentPage = Number(searchParams.get('page')) || 1;

  const [invoices, setInvoices] = useState<InvoiceType[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(
    null
  );

  // Fetch invoices data
  const loadInvoices = useCallback(async () => {
    setIsLoading(true);
    try {
      const [invoicesData, pages] = await Promise.all([
        getFilteredInvoices(query, currentPage),
        getInvoicesPages(query)
      ]);
      setInvoices(invoicesData);
      setTotalPages(pages);
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
    } finally {
      setIsLoading(false);
    }
  }, [query, currentPage]);

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  const handleRefresh = () => {
    loadInvoices();
    setSelectedInvoiceId(null);
  };

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
      </div>

      {/* Invoice Summary Cards */}
      <div className="mt-4">
        <InvoiceSummary />
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices..." />
        <CreateInvoice />
      </div>

      <Table
        invoices={invoices}
        onSelectInvoice={setSelectedInvoiceId}
        loading={isLoading}
      />

      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>

      {/* Modals */}
      <CreateInvoiceModal onRefresh={loadInvoices} />
      <DeleteInvoiceModal
        invoiceId={selectedInvoiceId}
        onRefresh={handleRefresh}
      />
      <ViewInvoiceModal
        invoiceId={selectedInvoiceId}
        setInvoiceId={setSelectedInvoiceId}
      />
    </div>
  );
}
