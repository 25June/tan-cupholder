import { OrderStatus, ORDER_STATUS_ICONS } from '@/constants/common';

// Get order status icon component
export const getOrderStatusIcon = (status: OrderStatus) => {
  return ORDER_STATUS_ICONS[status];
};

// Get order status text
export const getOrderStatusText = (status: OrderStatus): string => {
  switch (status) {
    case OrderStatus.PENDING:
      return 'Pending';
    case OrderStatus.CONFIRMED:
      return 'Confirmed';
    case OrderStatus.PROCESSING:
      return 'Processing';
    case OrderStatus.PACKAGING:
      return 'Packaging';
    case OrderStatus.READY_TO_SHIP:
      return 'Ready to Ship';
    case OrderStatus.SHIPPING:
      return 'Shipping';
    case OrderStatus.DELIVERING:
      return 'Delivering';
    case OrderStatus.DELIVERED:
      return 'Delivered';
    case OrderStatus.CANCELLED:
      return 'Cancelled';
    case OrderStatus.RETURNED:
      return 'Returned';
    default:
      return 'Unknown';
  }
};

// Get order status color class
export const getOrderStatusColor = (status: OrderStatus): string => {
  switch (status) {
    case OrderStatus.PENDING:
      return 'bg-yellow-100 text-yellow-800';
    case OrderStatus.CONFIRMED:
      return 'bg-blue-100 text-blue-800';
    case OrderStatus.PROCESSING:
      return 'bg-orange-100 text-orange-800';
    case OrderStatus.PACKAGING:
      return 'bg-purple-100 text-purple-800';
    case OrderStatus.READY_TO_SHIP:
      return 'bg-indigo-100 text-indigo-800';
    case OrderStatus.SHIPPING:
      return 'bg-teal-100 text-teal-800';
    case OrderStatus.DELIVERING:
      return 'bg-cyan-100 text-cyan-800';
    case OrderStatus.DELIVERED:
      return 'bg-green-100 text-green-800';
    case OrderStatus.CANCELLED:
      return 'bg-red-100 text-red-800';
    case OrderStatus.RETURNED:
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
