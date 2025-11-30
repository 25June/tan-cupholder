'use client';

import Image from 'next/image';
import { Customer } from '@/models/customer';
import { DeleteCustomer, UpdateCustomer } from './buttons';
import SimpleTable, { Column } from '@/components/simple-table/SimpleTable';

export default function CustomersTable({
  customers,
  loading = false,
  onSelectCustomer
}: {
  customers: Customer[];
  loading: boolean;
  onSelectCustomer: (id: string) => void;
}) {
  const columns: Column<Customer>[] = [
    {
      header: 'Name',
      render: (customer) => (
        <div className="flex items-center gap-3">
          <Image
            src={customer.image_url || '/cup.png'}
            className="rounded-full w-16 h-16 object-cover shrink-0"
            alt={`${customer.name}'s profile picture`}
            width={64}
            height={64}
          />
          <p className="font-medium">{customer.name}</p>
        </div>
      )
    },
    {
      header: 'Email',
      accessor: 'email'
    },
    {
      header: 'Phone',
      render: (customer) => customer.phone_number || 'N/A'
    },
    {
      header: 'Address',
      render: (customer) => customer.address || 'N/A',
      className:
        'whitespace-nowrap px-3 py-3 text-sm text-ellipsis overflow-hidden max-w-32'
    },
    {
      header: 'Verified',
      render: (customer) => (customer.is_email_verified ? 'Yes' : 'No')
    },
    {
      header: 'Created',
      render: (customer) =>
        customer.created_at
          ? new Date(customer.created_at).toLocaleDateString()
          : 'N/A'
    }
  ];

  return (
    <SimpleTable
      data={customers}
      columns={columns}
      keyExtractor={(customer) => customer.id}
      actions={(customer) => (
        <>
          <UpdateCustomer
            id={customer.id}
            onSelectCustomer={onSelectCustomer}
          />
          <DeleteCustomer
            id={customer.id}
            onSelectCustomer={onSelectCustomer}
          />
        </>
      )}
      loading={loading}
      emptyMessage="No customers found"
    />
  );
}
