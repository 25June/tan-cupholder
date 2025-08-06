'use server';

import { z } from 'zod';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const OrderSchema = z.object({
  productId: z.string().min(1, { message: 'Product ID is required' }),
  quantity: z.number().min(1, { message: 'Quantity must be at least 1' }),
  customerName: z.string().min(1, { message: 'Name is required' }),
  customerEmail: z.string().email({ message: 'Invalid email address' }),
  customerPhone: z.string().optional(),
  customerAddress: z.string().optional(),
  totalPrice: z.number().min(0, { message: 'Total price must be positive' })
});

export type OrderState = {
  errors?: {
    productId?: string[];
    quantity?: string[];
    customerName?: string[];
    customerEmail?: string[];
    customerPhone?: string[];
    customerAddress?: string[];
    totalPrice?: string[];
  };
  message?: string | null;
};

export async function createOrder(prevState: OrderState, formData: FormData) {
  const validatedFields = OrderSchema.safeParse({
    productId: formData.get('productId'),
    quantity: Number(formData.get('quantity')),
    customerName: formData.get('customerName'),
    customerEmail: formData.get('customerEmail'),
    customerPhone: formData.get('customerPhone'),
    customerAddress: formData.get('customerAddress'),
    totalPrice: Number(formData.get('totalPrice'))
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Order.'
    };
  }

  const {
    productId,
    quantity,
    customerName,
    customerEmail,
    customerPhone,
    customerAddress,
    totalPrice
  } = validatedFields.data;

  const date = new Date().toISOString();

  try {
    // First, create or find customer
    let customerId;
    const existingCustomer = await sql`
      SELECT id FROM customers WHERE email = ${customerEmail}
    `;

    if (existingCustomer.length > 0) {
      customerId = existingCustomer[0].id;
      // Update customer information if provided
      await sql`
        UPDATE customers 
        SET name = ${customerName}, 
            phone_number = ${customerPhone || null}, 
            address = ${customerAddress || null}, 
            updated_at = ${date}
        WHERE id = ${customerId}
      `;
    } else {
      const newCustomer = await sql`
        INSERT INTO customers (name, email, phone_number, image_url, address, created_at, updated_at)
        VALUES (${customerName}, ${customerEmail}, ${
        customerPhone || null
      }, ${'/logo.png'}, ${customerAddress || null}, ${date}, ${date})
        RETURNING id
      `;
      customerId = newCustomer[0].id;
    }

    // Create order with the correct schema
    const order = await sql`
      INSERT INTO orders (
        customer_id, 
        status, 
        total_items, 
        total_price, 
        payment_method, 
        payment_status, 
        payment_date, 
        shipping_address, 
        shipping_city, 
        created_at, 
        updated_at
      )
      VALUES (
        ${customerId}, 
        0, 
        ${quantity}, 
        ${totalPrice}, 
        'online', 
        'pending', 
        ${date}, 
        ${customerAddress || 'N/A'}, 
        'N/A', 
        ${date}, 
        ${date}
      )
      RETURNING id
    `;

    // Create order_products entry
    await sql`
      INSERT INTO order_products (order_id, product_id, quantity, created_at, updated_at)
      VALUES (${order[0].id}, ${productId}, ${quantity}, ${date}, ${date})
    `;

    return { orderId: order[0].id };
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to Create Order.' };
  }
}
