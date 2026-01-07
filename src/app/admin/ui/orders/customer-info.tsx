'use client';

import CopyButton from '@/components/copy-button/CopyButton';
import { Customer } from '@/models/customer';

interface Props {
  readonly customer: Customer;
  readonly payment_status: string;
}

export default function CustomerInfo({ customer, payment_status }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">
          Customer Information
        </h2>
      </div>
      <div className="px-6 py-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <p className="text-gray-900">{customer.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <p className="text-gray-900">{customer.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <div className="flex items-center gap-2">
              <p className="text-gray-900">{customer.phone_number || 'N/A'}</p>
              {customer.phone_number && (
                <CopyButton text={customer.phone_number || ''} />
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Payment Status
            </label>
            <p className="text-gray-900 capitalise">{payment_status}</p>
          </div>
        </div>
        {customer.address && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <p className="text-gray-900">{customer.address}</p>
          </div>
        )}
      </div>
    </div>
  );
}
