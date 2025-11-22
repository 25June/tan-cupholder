'use client';

import { useState, useEffect } from 'react';
import { MODAL_ID } from '@/constants/modal.const';
import { onCloseModal } from '@/shared/utils/modal.utils';
import { getInvoiceWithOrder } from '@/app/admin/lib/invoice-actions';
import { formatCurrency, formatDateToLocal } from '@/app/admin/lib/utils';
import Spinner from '@/components/spinner/Spinner';

export default function ViewInvoiceModal({
  invoiceId,
  setInvoiceId
}: {
  invoiceId: string | null;
  setInvoiceId: (id: string | null) => void;
}) {
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!invoiceId) return;

      setIsLoading(true);
      setError(null);

      try {
        const data = await getInvoiceWithOrder(invoiceId);
        setInvoiceData(data);
      } catch (err) {
        setError('Failed to fetch invoice details.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [invoiceId]);

  const handleClose = () => {
    onCloseModal(MODAL_ID.VIEW_INVOICE);
    setInvoiceData(null);
    setError(null);
    setInvoiceId(null);
  };

  return (
    <dialog id={MODAL_ID.VIEW_INVOICE} className="modal">
      <div className="modal-box max-w-3xl">
        <h3 className="font-bold text-lg mb-4">Invoice Details</h3>

        {isLoading && (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        )}

        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}

        {invoiceData && !isLoading && (
          <div className="space-y-6">
            {/* Invoice Information */}
            <section className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-base mb-3 text-gray-800">
                Invoice Information
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Invoice ID
                  </label>
                  <p className="text-gray-900">{invoiceData.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Status
                  </label>
                  <p>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        invoiceData.status === 'paid'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {invoiceData.status === 'paid' ? 'Paid' : 'Pending'}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Amount
                  </label>
                  <p className="text-gray-900 font-semibold">
                    {formatCurrency(invoiceData.amount)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Date
                  </label>
                  <p className="text-gray-900">
                    {formatDateToLocal(invoiceData.date)}
                  </p>
                </div>
              </div>
            </section>

            {/* Customer Information */}
            <section className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-base mb-3 text-gray-800">
                Customer Information
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Customer Name
                  </label>
                  <p className="text-gray-900">{invoiceData.customer_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Email
                  </label>
                  <p className="text-gray-900">{invoiceData.customer_email}</p>
                </div>
              </div>
            </section>

            {/* Order Information */}
            {invoiceData.order_id && (
              <section className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-base mb-3 text-gray-800">
                  Order Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Order ID
                    </label>
                    <p className="text-gray-900">{invoiceData.order_id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Order Date
                    </label>
                    <p className="text-gray-900">
                      {invoiceData.order_date
                        ? formatDateToLocal(invoiceData.order_date)
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Total Items
                    </label>
                    <p className="text-gray-900">{invoiceData.total_items}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Total Price
                    </label>
                    <p className="text-gray-900">
                      {formatCurrency(invoiceData.total_price)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Payment Method
                    </label>
                    <p className="text-gray-900 capitalize">
                      {invoiceData.payment_method}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Payment Status
                    </label>
                    <p className="text-gray-900 capitalize">
                      {invoiceData.payment_status}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-gray-600">
                      Shipping Address
                    </label>
                    <p className="text-gray-900">
                      {invoiceData.shipping_address},{' '}
                      {invoiceData.shipping_city}
                    </p>
                  </div>
                </div>
              </section>
            )}
          </div>
        )}

        <div className="modal-action">
          <button type="button" onClick={handleClose} className="btn btn-ghost">
            Close
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleClose}>close</button>
      </form>
    </dialog>
  );
}
