'use client';

import Image from 'next/image';
import { ViewInvoice, DeleteInvoice } from '@/app/admin/ui/invoices/buttons';
import InvoiceStatus from '@/app/admin/ui/invoices/status';
import { formatDateToLocal, formatCurrency } from '@/app/admin/lib/utils';
import { InvoicesTable as InvoiceType } from '@/app/admin/lib/definitions';
import SimpleTable, { Column } from '@/components/simple-table/SimpleTable';
import { useMemo } from 'react';

export default function InvoicesTable({
  invoices,
  onSelectInvoice,
  loading = false
}: {
  invoices: InvoiceType[];
  onSelectInvoice: (id: string) => void;
  loading?: boolean;
}) {
  // Define table columns
  const columns: Column<InvoiceType>[] = useMemo(
    () => [
      {
        header: 'Customer',
        accessor: 'name',
        headerClassName: 'px-4 py-5 font-medium sm:pl-6',
        className: 'whitespace-nowrap py-3 pl-6 pr-3',
        render: (invoice) => (
          <div className="flex items-center gap-3">
            <Image
              src={invoice.image_url}
              className="rounded-full"
              width={28}
              height={28}
              alt={`${invoice.name}'s profile picture`}
            />
            <p>{invoice.name}</p>
          </div>
        )
      },
      {
        header: 'Email',
        accessor: 'email',
        className: 'whitespace-nowrap px-3 py-3'
      },
      {
        header: 'Amount',
        accessor: 'amount',
        className: 'whitespace-nowrap px-3 py-3',
        render: (invoice) => formatCurrency(invoice.amount)
      },
      {
        header: 'Date',
        accessor: 'date',
        className: 'whitespace-nowrap px-3 py-3',
        render: (invoice) => formatDateToLocal(invoice.date)
      },
      {
        header: 'Status',
        accessor: 'status',
        className: 'whitespace-nowrap px-3 py-3',
        render: (invoice) => <InvoiceStatus status={invoice.status} />
      }
    ],
    []
  );

  return (
    <SimpleTable<InvoiceType>
      data={invoices}
      columns={columns}
      keyExtractor={(invoice) => invoice.id}
      loading={loading}
      emptyMessage="No invoices found."
      actions={(invoice) => (
        <div className="flex justify-end items-center gap-1">
          <ViewInvoice id={invoice.id} onSelect={onSelectInvoice} />
          <DeleteInvoice id={invoice.id} onSelect={onSelectInvoice} />
        </div>
      )}
    />
  );
}
