export type Order = {
  id: string;
  customer_id: string;
  status: number;
  total_items: number;
  total_price: number;
  payment_method: string;
  payment_status: string;
  payment_date: string;
  shipping_address: string;
  shipping_city: string;
  created_at: string;
  updated_at: string;
};

export type OrderProduct = {
  order_products: {
    id: string;
    order_id: string;
    product_id: string;
    quantity: number;
    price: number;
    created_at: string;
    updated_at: string;
    image_url: string;
  }[];
} & Order;
