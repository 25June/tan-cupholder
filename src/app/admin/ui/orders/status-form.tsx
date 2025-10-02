'use client';

import { useState, useTransition, useActionState } from 'react';
import { updateOrderStatus } from '@/app/admin/lib/actions/orders.actions';
import { OrderStatus, ORDER_STATUS_ICONS } from '@/constants/common';
import { useRouter } from 'next/navigation';

export default function StatusForm({
  orderId,
  currentStatus
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const initialState = { message: '', errors: {} };
  const [state, dispatch] = useActionState(updateOrderStatus, initialState);
  const [showForm, setShowForm] = useState(false);

  const statusOptions = [
    {
      value: OrderStatus.PENDING,
      label: 'Pending',
      description: 'Order received but not yet confirmed'
    },
    {
      value: OrderStatus.CONFIRMED,
      label: 'Confirmed',
      description: 'Order confirmed and ready for processing'
    },
    {
      value: OrderStatus.PROCESSING,
      label: 'Processing',
      description: 'Order is being prepared'
    },
    {
      value: OrderStatus.PACKAGING,
      label: 'Packaging',
      description: 'Order is being packaged'
    },
    {
      value: OrderStatus.READY_TO_SHIP,
      label: 'Ready to Ship',
      description: 'Order is ready for shipping'
    },
    {
      value: OrderStatus.SHIPPING,
      label: 'Shipping',
      description: 'Order is in transit'
    },
    {
      value: OrderStatus.DELIVERING,
      label: 'Delivering',
      description: 'Order is being delivered'
    },
    {
      value: OrderStatus.DELIVERED,
      label: 'Delivered',
      description: 'Order has been delivered'
    },
    {
      value: OrderStatus.CANCELLED,
      label: 'Cancelled',
      description: 'Order has been cancelled'
    },
    {
      value: OrderStatus.RETURNED,
      label: 'Returned',
      description: 'Order has been returned'
    }
  ];

  const handleSubmit = (formData: FormData) => {
    startTransition(() => {
      dispatch(formData);
      setShowForm(false);
      router.refresh();
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          Update Order Status
        </h3>
      </div>

      <div className="px-6 py-4">
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="w-full bg-logo-orange-border text-white px-4 py-2 rounded-md hover:bg-logo-orange-border/90 transition-colors duration-200 font-medium"
          >
            Change Status
          </button>
        ) : (
          <form action={handleSubmit} className="space-y-4">
            <input type="hidden" name="orderId" value={orderId} />

            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Select New Status
              </label>
              <select
                name="status"
                id="status"
                defaultValue={currentStatus}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-logo-orange-border focus:border-logo-orange-border"
                required
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} - {option.description}
                  </option>
                ))}
              </select>
            </div>

            {state.message && (
              <div
                className={`p-3 rounded-md ${
                  state.message.includes('success')
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}
              >
                {state.message}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 bg-logo-orange-border text-white px-4 py-2 rounded-md hover:bg-logo-orange-border/90 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? 'Updating...' : 'Update Status'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
