import {
  fetchOrderById,
  OrderDetail
} from '@/app/admin/lib/actions/orders.actions';
import { Metadata } from 'next';
import { lusitana } from '@/app/admin/ui/fonts';
import StatusForm from '@/app/admin/ui/orders/status-form';
import {
  getOrderStatusColor,
  getOrderStatusText
} from '@/shared/utils/order.utils';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { notFound } from 'next/navigation';
import { ProductCustom } from '@/models/product';
import CopyButton from '@/components/copy-button/CopyButton';
import ProductTable from '@/app/admin/ui/orders/product-table';

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params
}: OrderDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Order #${id.slice(-8)} Details`
  };
}

export default async function OrderDetailPage({
  params
}: OrderDetailPageProps) {
  const { id } = await params;

  let order: OrderDetail;
  let productObj: Record<string, ProductCustom>;
  try {
    const data = await fetchOrderById(id);
    if ('message' in data) {
      notFound();
    }
    order = data.order;
    productObj = data.products.reduce((acc, product) => {
      return { ...acc, [product.id]: product };
    }, {} as Record<string, ProductCustom>);

    if (!order || !productObj) {
      notFound();
    }
  } catch (error) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <main className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/dashboard/orders"
            prefetch={true}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </Link>
          <h1 className={`${lusitana.className} text-xl md:text-2xl`}>
            Order #{id.slice(-8)}
          </h1>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-sm font-medium ${getOrderStatusColor(
            order.status as any
          )}`}
        >
          {getOrderStatusText(order.status as any)}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
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
                  <p className="text-gray-900">{order.customer.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <p className="text-gray-900">{order.customer.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <div className="flex items-center gap-2">
                    <p className="text-gray-900">
                      {order.customer.phone_number || 'N/A'}
                    </p>
                    {order.customer.phone_number && (
                      <CopyButton text={order.customer.phone_number || ''} />
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Payment Status
                  </label>
                  <p className="text-gray-900 capitalise">
                    {order.payment_status}
                  </p>
                </div>
              </div>
              {order.customer.address && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <p className="text-gray-900">{order.customer.address}</p>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Information */}
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
                  <p className="text-gray-900">
                    {order.shipping_address || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <p className="text-gray-900">
                    {order.shipping_city || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Payment Method
                  </label>
                  <p className="text-gray-900 capitalise">
                    {order.payment_method}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Total Items
                  </label>
                  <p className="text-gray-900">{order.total_items} items</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Order Details
              </h2>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Order ID
                  </label>
                  <p className="text-gray-900 font-mono">{order.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Order Date
                  </label>
                  <p className="text-gray-900">
                    {formatDate(order.created_at)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Last Updated
                  </label>
                  <p className="text-gray-900">
                    {formatDate(order.updated_at)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Total Amount
                  </label>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency(order.total_price)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Update Form */}
        <div className="space-y-6">
          <StatusForm orderId={order.id} currentStatus={order.status as any} />

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Order Summary
              </h2>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    {formatCurrency(order.total_price)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Items</span>
                  <span className="font-medium">{order.total_items}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">
                      Total
                    </span>
                    <span className="text-lg font-semibold text-gray-900">
                      {formatCurrency(order.total_price)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products List */}
      <ProductTable order={order} productObj={productObj} />
    </main>
  );
}
