'use client';

import { Customer } from '@/models/customer';
import { DeleteCustomer, UpdateCustomer } from './buttons';
import SimpleTable, { Column } from '@/components/simple-table/SimpleTable';
import { UserCircleIcon } from '@heroicons/react/24/outline';

interface CustomersTableProps {
  readonly customers: Customer[];
  readonly loading: boolean;
  readonly onSelectCustomer: (customer: Customer) => void;
}

export default function CustomersTable({
  customers,
  loading = false,
  onSelectCustomer
}: CustomersTableProps) {
  const columns: Column<Customer>[] = [
    {
      header: 'Name',
      render: (customer) => (
        <div className="flex items-center gap-3">
          <UserCircleIcon className="w-8 h-8 text-logo-orange-border" />
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
        <div className="flex items-center gap-2">
          <UpdateCustomer onSelectCustomer={() => onSelectCustomer(customer)} />
          <DeleteCustomer onSelectCustomer={() => onSelectCustomer(customer)} />
        </div>
      )}
      loading={loading}
      emptyMessage="No customers found"
    />
  );
}
