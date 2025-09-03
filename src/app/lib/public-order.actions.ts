'use server';

import { z } from 'zod';
import postgres from 'postgres';
import { sendEmail } from '@/app/admin/lib/actions/email.actions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const OrderSchema = z.object({
  products: z.string(),
  customerName: z.string().min(1, { message: 'Name is required' }),
  customerEmail: z.string().email({ message: 'Invalid email address' }),
  customerPhone: z.string().optional(),
  customerAddress: z.string().optional()
});

export type OrderState = {
  errors?: {
    products?: string[];
    customerName?: string[];
    customerEmail?: string[];
    customerPhone?: string[];
    customerAddress?: string[];
  };
  message?: string | null;
};

export async function createOrder(prevState: OrderState, formData: FormData) {
  const validatedFields = OrderSchema.safeParse({
    products: formData.get('products'),
    customerName: formData.get('customerName'),
    customerEmail: formData.get('customerEmail'),
    customerPhone: formData.get('customerPhone'),
    customerAddress: formData.get('customerAddress')
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Order.'
    };
  }

  const {
    products,
    customerName,
    customerEmail,
    customerPhone,
    customerAddress
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

    const decodedProducts = JSON.parse(products as string);
    const { productIds, quantities } = decodedProducts.reduce(
      (
        acc: { productIds: string[]; quantities: Record<string, number> },
        cur: { productId: string; quantity: number }
      ) => {
        return {
          productIds: acc.productIds.concat(cur.productId),
          quantities: {
            ...acc.quantities,
            [cur.productId]: cur.quantity
          }
        };
      },
      { productIds: [], quantities: {} as Record<string, number> }
    );

    const getProducts = await sql`
      SELECT * FROM products WHERE id = ANY(${productIds})
    `;
    const { totalQuantity, totalPrice } = getProducts.reduce(
      (acc, product) => {
        return {
          totalQuantity: acc.totalQuantity + quantities[product.id],
          totalPrice: acc.totalPrice + product.price * quantities[product.id]
        };
      },
      { totalQuantity: 0, totalPrice: 0 }
    );

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
        ${totalQuantity}, 
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

    const promises = decodedProducts.map(
      (product: { productId: string; quantity: number }) => {
        // Create order_products entry
        return sql`
      INSERT INTO order_products (order_id, product_id, quantity, created_at, updated_at)
      VALUES (${order[0].id}, ${product.productId}, ${product.quantity}, ${date}, ${date})
    `;
      }
    );
    await Promise.all(promises);
    await sendEmail(customerEmail, 'order-confirmation', {
      customerName: customerName,
      orderId: order[0].id,
      totalAmount: totalPrice,
      orderDate: date,
      orderProducts: decodedProducts
    });
    return { orderId: order[0].id };
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to Create Order.' };
  }
}

export async function getOrderById(orderId: string) {
  // -- We need GROUP BY here because:
  // -- 1. We're using json_agg() which is an aggregate function to combine multiple order_products rows into a JSON array
  // -- 2. Without GROUP BY, the aggregate function would try to combine ALL rows into a single result
  // -- 3. GROUP BY orders.id ensures we get one row per order, with all its order_products aggregated into an array

  const orders = await sql`
    SELECT orders.*, json_agg(order_products) as order_products 
    FROM orders
    LEFT JOIN order_products ON orders.id = order_products.order_id
    WHERE orders.id = ${orderId}
    GROUP BY orders.id
  `;
  const order = orders[0];
  if (!order) {
    return { message: 'Order not found' };
  }
  const productIds = order.order_products.map(
    (orderProduct: any) => orderProduct.product_id
  );
  const products = await sql`
    SELECT products.*, pt.name as type_name, json_build_object(
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
}
