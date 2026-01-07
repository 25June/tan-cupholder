'use client';

interface Props {
  readonly shipping_address: string;
  readonly shipping_city: string;
  readonly payment_method: string;
  readonly total_items: number;
}
export default function ShippingInfo({
  shipping_address,
  shipping_city,
  payment_method,
  total_items
}: Props) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">
          Shipping Information
        </h2>
      </div>
      <div className="px-6 py-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Shipping Address
            </label>
            <p className="text-gray-900">{shipping_address || 'N/A'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              City
            </label>
            <p className="text-gray-900">{shipping_city || 'N/A'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Payment Method
            </label>
            <p className="text-gray-900 capitalise">{payment_method}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Total Items
            </label>
            <p className="text-gray-900">{total_items} items</p>
          </div>
        </div>
      </div>
    </div>
  );
}
