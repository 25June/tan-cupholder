'use client';

import { formatCurrency } from '@/shared/utils/formatCurrency';

interface Props {
  readonly total_price: number;
  readonly total_items: number;
}

export default function OrderSummary({ total_price, total_items }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
      </div>
      <div className="px-6 py-4">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">{formatCurrency(total_price)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Items</span>
            <span className="font-medium">{total_items}</span>
          </div>
          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between">
              <span className="text-lg font-semibold text-gray-900">Total</span>
              <span className="text-lg font-semibold text-gray-900">
                {formatCurrency(total_price)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
