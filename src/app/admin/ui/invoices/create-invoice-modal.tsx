'use client';

import { useState } from 'react';
import { MODAL_ID } from '@/constants/modal.const';
import { onCloseModal } from '@/shared/utils/modal.utils';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { fetchOrderById } from '@/app/admin/lib/actions/orders.actions';
import { createInvoice, State } from '@/app/admin/lib/actions';
import Spinner from '@/components/spinner/Spinner';
import { useActionState } from 'react';

export default function CreateInvoiceModal({
  onRefresh
}: {
  onRefresh: () => void;
}) {
  const [orderId, setOrderId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const initialState: State = { message: null, errors: {} };
  const [state, formAction] = useActionState(createInvoice, initialState);

  // Search for order by ID
  const handleSearchOrder = async () => {
    if (!orderId.trim()) {
      setSearchError('Please enter an order ID');
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    setOrderData(null);

    try {
      const result = await fetchOrderById(orderId);

      if ('message' in result) {
        setSearchError(result.message);
      } else {
        setOrderData(result);
      }
    } catch (error) {
      setSearchError('Failed to fetch order. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleClose = (refresh?: boolean) => {
    onCloseModal(MODAL_ID.CREATE_INVOICE);
    setOrderId('');
    setOrderData(null);
    setSearchError(null);
    if (refresh) {
      onRefresh();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result: any = await formAction(formData);

    if (result?.message && !result.errors) {
      handleClose(true);
    }
  };

  return (
    <dialog id={MODAL_ID.CREATE_INVOICE} className="modal">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-lg mb-4">Create Invoice from Order</h3>

        {/* Order Search Section */}
        <div className="mb-6">
          <label
            htmlFor="orderSearch"
            className="block text-sm font-medium mb-2"
          >
            Search Order by ID
          </label>
          <div className="flex gap-2">
            <input
              id="orderSearch"
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter order ID"
              className="input input-bordered flex-1"
              disabled={isSearching}
            />
            <button
              type="button"
              onClick={handleSearchOrder}
              disabled={isSearching}
              className="btn btn-primary"
            >
              {isSearching ? (
                <Spinner color="white" />
              ) : (
                <>
                  <MagnifyingGlassIcon className="h-5 w-5" />
                  Search
                </>
              )}
            </button>
          </div>
          {searchError && (
            <p className="text-sm text-red-500 mt-2">{searchError}</p>
          )}
        </div>

        {/* Order Details Display */}
        {orderData && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-semibold mb-3">Order Details</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-medium">Order ID:</span>
                <p className="text-gray-700">{orderData.order.id}</p>
              </div>
              <div>
                <span className="font-medium">Customer:</span>
                <p className="text-gray-700">
                  {orderData.order.customer?.name || 'N/A'}
                </p>
              </div>
              <div>
                <span className="font-medium">Total Items:</span>
                <p className="text-gray-700">{orderData.order.total_items}</p>
              </div>
              <div>
                <span className="font-medium">Total Price:</span>
                <p className="text-gray-700">
                  ${(orderData.order.total_price / 100).toFixed(2)}
                </p>
              </div>
              <div>
                <span className="font-medium">Payment Method:</span>
                <p className="text-gray-700">
                  {orderData.order.payment_method}
                </p>
              </div>
              <div>
                <span className="font-medium">Payment Status:</span>
                <p className="text-gray-700">
                  {orderData.order.payment_status}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Invoice Creation Form */}
        {orderData && (
          <form onSubmit={handleSubmit}>
            <input type="hidden" name="orderId" value={orderData.order.id} />
            <input
              type="hidden"
              name="customerId"
              value={orderData.order.customer_id}
            />

            {/* Amount */}
            <div className="mb-4">
              <label
                htmlFor="amount"
                className="block text-sm font-medium mb-2"
              >
                Invoice Amount (USD)
              </label>
              <input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                defaultValue={(orderData.order.total_price / 100).toFixed(2)}
                className="input input-bordered w-full"
                required
              />
              {state.errors?.amount && (
                <p className="text-sm text-red-500 mt-1">
                  {state.errors.amount[0]}
                </p>
              )}
            </div>

            {/* Status */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Invoice Status
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="pending"
                    defaultChecked
                    className="radio radio-primary"
                  />
                  <span>Pending</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="paid"
                    className="radio radio-primary"
                  />
                  <span>Paid</span>
                </label>
              </div>
              {state.errors?.status && (
                <p className="text-sm text-red-500 mt-1">
                  {state.errors.status[0]}
                </p>
              )}
            </div>

            {state.message && !state.errors && (
              <div className="alert alert-success mb-4">
                <span>{state.message}</span>
              </div>
            )}

            {state.message &&
              state.errors &&
              Object.keys(state.errors).length > 0 && (
                <div className="alert alert-error mb-4">
                  <span>{state.message}</span>
                </div>
              )}

            <div className="modal-action">
              <button
                type="button"
                onClick={() => handleClose()}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Create Invoice
              </button>
            </div>
          </form>
        )}

        {!orderData && !isSearching && (
          <div className="modal-action">
            <button
              type="button"
              onClick={() => handleClose()}
              className="btn btn-ghost"
            >
              Close
            </button>
          </div>
        )}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={() => handleClose()}>close</button>
      </form>
    </dialog>
  );
}
