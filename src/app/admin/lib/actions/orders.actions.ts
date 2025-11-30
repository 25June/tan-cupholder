'use server';

import { z } from 'zod';
import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { Order, OrderProduct } from '@/models/order';
import { ProductCustom } from '@/models/product';
import { createInvoice } from './invoices.actions';
import { OrderStatus } from '@/constants/common';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// Define order status schema
const OrderStatusSchema = z.object({
  status: z
    .number()
    .min(0)
    .max(9, { message: 'Status must be between 0 and 9' })
});

export type OrderState = {
  errors?: {
    status?: string[];
  };
  message?: string | null;
};

export type OrderWithCustomer = Order & {
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  customer_address?: string;
};

export type OrderDetail = OrderProduct & {
  customer: {
    id: string;
    name: string;
    email: string;
    phone_number?: string;
    address?: string;
  };
  products: Array<{
    id: string;
    name: string;
    price: number;
    type_name: string;
    image: {
      id: string;
      name: string;
    } | null;
    quantity: number;
  }>;
};

// Fetch orders with customer data
export async function fetchOrders({
  query,
  page
}: {
  query: string;
  page: string;
}) {
  try {
    const ITEMS_PER_PAGE = 10;
    const offset = (Number(page) - 1) * ITEMS_PER_PAGE;

    let orders;
    if (query) {
      orders = await sql<OrderWithCustomer[]>`
        SELECT 
          o.*, 
          c.name as customer_name, 
          c.email as customer_email,
          c.phone_number as customer_phone,
          c.address as customer_address
        FROM orders o
        LEFT JOIN customers c ON o.customer_id = c.id
        WHERE 
          c.name ILIKE ${`%${query}%`} OR 
          c.email ILIKE ${`%${query}%`} OR 
          o.id::text ILIKE ${`%${query}%`}
        ORDER BY o.created_at DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `;
    } else {
      orders = await sql<OrderWithCustomer[]>`
        SELECT 
          o.*, 
          c.name as customer_name, 
          c.email as customer_email,
          c.phone_number as customer_phone,
          c.address as customer_address
        FROM orders o
        LEFT JOIN customers c ON o.customer_id = c.id
        ORDER BY o.created_at DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `;
    }
    return orders;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch orders.');
  }
}

// Fetch total orders count
export async function fetchTotalOrders(query?: string) {
  try {
    let count: { count: string }[];

    if (query) {
      count = await sql`
        SELECT COUNT(*) 
        FROM orders o
        LEFT JOIN customers c ON o.customer_id = c.id
        WHERE 
          c.name ILIKE ${`%${query}%`} OR 
          c.email ILIKE ${`%${query}%`} OR 
          o.id::text ILIKE ${`%${query}%`}
      `;
    } else {
      count = await sql`
        SELECT COUNT(*) FROM orders
      `;
    }

    return Number(count[0].count);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total orders count.');
  }
}

// Fetch order detail by ID
export async function fetchOrderById(orderId: string): Promise<
  | {
      order: OrderDetail;
      products: ProductCustom[];
    }
  | {
      message: string;
    }
> {
  try {
    const orders = await sql<OrderDetail[]>`
    SELECT orders.*, json_agg(order_products) as order_products, 
    json_build_object('id', c.id, 'name', c.name, 'email', c.email, 'phone_number', c.phone_number, 'address', c.address) as customer
    FROM orders
    LEFT JOIN order_products ON orders.id = order_products.order_id
    LEFT JOIN customers c ON orders.customer_id = c.id
    WHERE orders.id = ${orderId}
    GROUP BY orders.id, c.id
  `;
    const order = orders[0];
    if (!order) {
      return { message: 'Order not found' };
    }
    const productIds = order.order_products.map(
      (orderProduct: any) => orderProduct.product_id
    );
    const products = await sql<ProductCustom[]>`
    SELECT products.id, products.name, pt.name as type_name, json_build_object(
      'id', images.id,
      'name', images.name
    ) as image
    FROM products
    LEFT JOIN product_types pt ON products.type = pt.id
    LEFT JOIN images ON products.id = images.product_id AND images.is_main = TRUE
    WHERE products.id = ANY(${productIds})
    ORDER BY products.priority DESC
  `;

    return { order, products };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch order detail.');
  }
}

// Update order status
export async function updateOrderStatus(
  prevState: OrderState,
  formData: FormData
) {
  const validatedFields = OrderStatusSchema.safeParse({
    status: Number(formData.get('status'))
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Order Status.'
    };
  }

  const { status } = validatedFields.data;
  const orderId = formData.get('orderId') as string;
  const date = new Date().toISOString();

  try {
    await sql`
      UPDATE orders
      SET status = ${status}, updated_at = ${date}
      WHERE id = ${orderId}
    `;

    // if Order status === confirmed, create invoice
    if (status === OrderStatus.CONFIRMED) {
      await createInvoice(orderId);
    }
  } catch (error) {
    return { message: 'Database Error: Failed to Update Order Status.' };
  }

  revalidatePath('/admin/dashboard/orders');
  return { message: 'Order status updated successfully!' };
}
