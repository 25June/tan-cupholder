'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  fetchCustomers,
  fetchTotalCustomers
} from '@/app/admin/lib/actions/customers.action';
import CustomersTable from '@/app/admin/ui/customers/table';
import { lusitana } from '@/app/admin/ui/fonts';
import Search from '@/app/admin/ui/search';
import { CreateCustomer } from '@/app/admin/ui/customers/buttons';
import Pagination from '@/app/admin/ui/invoices/pagination';
import { Customer } from '@/models/customer';
import CreateCustomerModal from '@/app/admin/ui/customers/create-customer-modal';
import EditCustomerModal from '@/app/admin/ui/customers/edit-customer-modal';
import DeleteCustomerModal from '@/app/admin/ui/customers/delete-customer-modal';
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const searchParams = useSearchParams();
  const query = searchParams?.get('query') || '';
  const currentPage = Number(searchParams?.get('page')) || 1;

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );

  const onFetchCustomers = useCallback(async () => {
    setIsLoading(true);
    try {
      const [customersData, totalData] = await Promise.all([
        fetchCustomers({
          query,
          page: currentPage.toString()
        }),
        fetchTotalCustomers()
      ]);

      setCustomers(customersData);
      setTotalCustomers(totalData);
    } catch (error) {
      console.error('Failed to load customers:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, query]);

  useEffect(() => {
    onFetchCustomers();
  }, [onFetchCustomers]);

  const handleRefresh = () => {
    onFetchCustomers();
    setSelectedCustomer(null);
  };
  console.log(selectedCustomer);
  return (
    <main>
      <div className="flex w-full items-center justify-between mb-8">
        <h1 className={`${lusitana.className}  text-xl md:text-2xl`}>
          Customers
        </h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search customers..." />
        <CreateCustomer />
      </div>
      <CustomersTable
        customers={customers}
        loading={isLoading}
        onSelectCustomer={setSelectedCustomer}
      />
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={Math.ceil(totalCustomers / 10)} />
      </div>
      <CreateCustomerModal onRefresh={onFetchCustomers} />
      <EditCustomerModal
        customer={selectedCustomer}
        onRefresh={handleRefresh}
        onReset={() => setSelectedCustomer(null)}
      />
      <DeleteCustomerModal
        customer={selectedCustomer}
        onRefresh={handleRefresh}
      />
    </main>
  );
}
