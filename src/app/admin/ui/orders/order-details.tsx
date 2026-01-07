'use client';

import { formatCurrency } from '@/shared/utils/formatCurrency';
import { formatDate } from '@/shared/utils/formatDate';
interface Props {
  readonly id: string;
  readonly created_at: string;
  readonly updated_at: string;
  readonly total_price: number;
}

export default function OrderDetails({
  id,
  created_at,
  updated_at,
  total_price
}: Props) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Order Details</h2>
      </div>
      <div className="px-6 py-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Order ID
            </label>
            <p className="text-gray-900 font-mono">{id}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Order Date
            </label>
            <p className="text-gray-900">{formatDate(created_at)}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Updated
            </label>
            <p className="text-gray-900">{formatDate(updated_at)}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Total Amount
            </label>
            <p className="text-lg font-semibold text-gray-900">
              {formatCurrency(total_price)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
