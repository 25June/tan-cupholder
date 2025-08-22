import {
  ClockIcon,
  CheckCircleIcon,
  CogIcon,
  GiftIcon,
  TruckIcon,
  MapPinIcon,
  CheckBadgeIcon,
  XCircleIcon,
  ArrowUturnLeftIcon
} from '@heroicons/react/24/outline';

export enum View {
  HERO = 'HERO',
  CATEGORY = 'CATEGORY',
  PRODUCT = 'PRODUCT',
  FAQ = 'FAQ'
}

export enum ScreenLayout {
  Mobile = 'mobile',
  Tablet = 'tablet',
  Desktop = 'desktop'
}

export enum OrderStatus {
  PENDING = 0,
  CONFIRMED = 1,
  PROCESSING = 2,
  PACKAGING = 3,
  READY_TO_SHIP = 4,
  SHIPPING = 5,
  DELIVERING = 6,
  DELIVERED = 7,
  CANCELLED = 8,
  RETURNED = 9
}

export const ORDER_STATUSES = [
  {
    id: OrderStatus.PROCESSING,
    name: 'Processing'
  },
  {
    id: OrderStatus.DELIVERING,
    name: 'Delivering'
  },
  {
    id: OrderStatus.DELIVERED,
    name: 'Delivered'
  }
];

export const ORDER_STATUS_ICONS: Record<OrderStatus, React.ElementType> = {
  [OrderStatus.PENDING]: ClockIcon,
  [OrderStatus.CONFIRMED]: CheckCircleIcon,
  [OrderStatus.PROCESSING]: CogIcon,
  [OrderStatus.PACKAGING]: GiftIcon,
  [OrderStatus.READY_TO_SHIP]: TruckIcon,
  [OrderStatus.SHIPPING]: TruckIcon,
  [OrderStatus.DELIVERING]: MapPinIcon,
  [OrderStatus.DELIVERED]: CheckBadgeIcon,
  [OrderStatus.CANCELLED]: XCircleIcon,
  [OrderStatus.RETURNED]: ArrowUturnLeftIcon
};
