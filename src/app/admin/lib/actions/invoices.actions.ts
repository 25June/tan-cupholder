'use server';

import { fetchFilteredInvoices, fetchInvoicesPages } from '../data';
import { Invoice } from '@/app/lib/definitions';
import { OrderDetail } from './orders.actions';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// Server action to fetch filtered invoices
export const getFilteredInvoices = async (
  query: string,
  currentPage: number
) => {
  try {
    return await fetchFilteredInvoices(query, currentPage);
  } catch (error) {
    console.error('Failed to fetch invoices:', error);
    throw new Error('Failed to fetch invoices');
  }
};

// Server action to fetch invoice pages count
export const getInvoicesPages = async (query: string) => {
  try {
    return await fetchInvoicesPages(query);
  } catch (error) {
    console.error('Failed to fetch invoice pages:', error);
    throw new Error('Failed to fetch invoice pages');
  }
};

// Server action to fetch invoice with order details
export const getInvoiceWithOrder = async (id: string) => {
  try {
    return await fetchInvoiceWithOrderById(id);
  } catch (error) {
    console.error('Failed to fetch invoice details:', error);
    throw new Error('Failed to fetch invoice details');
  }
};

export async function createInvoice(orderId: string) {
  try {
    const orders = await sql<OrderDetail[]>`
      SELECT * FROM orders WHERE id = ${orderId}
    `;
    if (!orders) {
      return { message: 'Order not found' };
    }
    const order = orders[0];
    const amount = order.total_price;
    const status = 'pending';
    const date = new Date().toISOString();
    const id = await sql<Invoice[]>`
      INSERT INTO invoices (order_id, customer_id, amount, status, date)
      VALUES (${orderId}, ${order.customer_id}, ${amount}, ${status}, ${date})
    `;

    return { id: id, message: 'Invoice created successfully!' };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to create invoice for order.');
  }
}

export async function fetchInvoiceWithOrderById(id: string) {
  try {
    const data = await sql`
      SELECT
        invoices.id,
        invoices.order_id,
        invoices.customer_id,
        invoices.amount,
        invoices.status,
        invoices.date,
        customers.name as customer_name,
        customers.email as customer_email,
        customers.image_url as customer_image_url,
        orders.total_items,
        orders.total_price,
        orders.payment_method,
        orders.payment_status,
        orders.shipping_address,
        orders.shipping_city,
        orders.created_at as order_date
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      LEFT JOIN orders ON invoices.order_id = orders.id
      WHERE invoices.id = ${id};
    `;

    return data[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice with order details.');
  }
}
