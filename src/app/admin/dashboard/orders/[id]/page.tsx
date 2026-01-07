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
import ProductTable from '@/app/admin/ui/orders/product-table';
import CustomerInfo from '@/app/admin/ui/orders/customer-info';
import ShippingInfo from '@/app/admin/ui/orders/shipping-info';
import OrderDetails from '@/app/admin/ui/orders/order-details';
import OrderSummary from '@/app/admin/ui/orders/order-summary';
import MailLogger, {
  MailLoggerSkeleton
} from '@/app/admin/ui/orders/mail-logger';
import { Suspense } from 'react';
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
          <CustomerInfo
            customer={order.customer}
            payment_status={order.payment_status}
          />

          {/* Shipping Information */}
          <ShippingInfo
            shipping_address={order.shipping_address}
            shipping_city={order.shipping_city}
            payment_method={order.payment_method}
            total_items={order.total_items}
          />
          {/* Order Details */}
          <OrderDetails
            id={order.id}
            created_at={order.created_at}
            updated_at={order.updated_at}
            total_price={order.total_price}
          />
        </div>

        {/* Status Update Form */}
        <div className="space-y-6">
          <StatusForm orderId={order.id} currentStatus={order.status as any} />

          {/* Order Summary */}
          <OrderSummary
            total_price={order.total_price}
            total_items={order.total_items}
          />
          <Suspense fallback={<MailLoggerSkeleton />}>
            <MailLogger orderId={order.id} email={order.customer.email} />
          </Suspense>
        </div>
      </div>

      {/* Products List */}
      <ProductTable order={order} productObj={productObj} />
    </main>
  );
}
