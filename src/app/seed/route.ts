import bcrypt from 'bcrypt';
import postgres from 'postgres';
import { invoices, customers, revenue, users } from '../lib/placeholder-data';
import { Content } from '@/models/content';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function seedUsers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
    })
  );

  return insertedUsers;
}

async function seedInvoices() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      customer_id UUID NOT NULL,
      order_id UUID,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `;

  const insertedInvoices = await Promise.all(
    invoices.map(
      (invoice) => sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
        ON CONFLICT (id) DO NOTHING;
      `
    )
  );

  return insertedInvoices;
}

async function seedCustomers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL
    );
  `;

  const insertedCustomers = await Promise.all(
    customers.map(
      (customer) => sql`
        INSERT INTO customers (id, name, email, image_url)
        VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
        ON CONFLICT (id) DO NOTHING;
      `
    )
  );

  return insertedCustomers;
}

async function seedRevenue() {
  await sql`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(4) NOT NULL UNIQUE,
      revenue INT NOT NULL
    );
  `;

  const insertedRevenue = await Promise.all(
    revenue.map(
      (rev) => sql`
        INSERT INTO revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
        ON CONFLICT (month) DO NOTHING;
      `
    )
  );

  return insertedRevenue;
}

async function seedProducts() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      price INT NOT NULL,
      sale INT NOT NULL,
      type VARCHAR(255) NOT NULL,
      image VARCHAR(255) NOT NULL,
      stock INT NOT NULL,
      createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `;
  const date = new Date().toISOString();
  const mockProducts = [
    {
      id: '1',
      name: 'Product 1',
      description: 'Description 1',
      price: 89900,
      sale: 20,
      type: 'Type 1',
      stock: 10,
      image: '/IMG_7210.jpg',
      createdAt: date,
      updatedAt: date
    }
  ];
  const insertedProducts = await Promise.all(
    [mockProducts[0]].map(
      (product) => sql`
        INSERT INTO products (name, description, price, sale, type, image, stock, createdAt, updatedAt)
        VALUES (${product.name}, ${product.description}, ${product.price}, ${product.sale}, ${product.type}, ${product.image}, ${product.stock}, ${product.createdAt}, ${product.updatedAt})
        ON CONFLICT (id) DO NOTHING;
      `
    )
  );
  return insertedProducts;
}

async function seedProductTags() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS product_tags (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      short_name VARCHAR(50) NOT NULL UNIQUE,
      description TEXT,
      color VARCHAR(16),
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS product_tag_mappings (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      product_id UUID NOT NULL REFERENCES products(id),
      tag_id UUID NOT NULL REFERENCES product_tags(id),
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(product_id, tag_id)
    );
  `;

  const date = new Date().toISOString();
  const baseTags = [
    {
      name: 'New',
      short_name: 'NEW',
      description: 'New arrival',
      color: '#22c55e'
    },
    {
      name: 'Hot',
      short_name: 'HOT',
      description: 'Trending product',
      color: '#ef4444'
    },
    {
      name: 'Sale',
      short_name: 'SALE',
      description: 'On sale',
      color: '#f59e0b'
    }
  ];

  await Promise.all(
    baseTags.map(
      (t) =>
        sql`
        INSERT INTO product_tags (name, short_name, description, color, created_at, updated_at)
        VALUES (${t.name}, ${t.short_name}, ${t.description}, ${t.color}, ${date}, ${date})
        ON CONFLICT (short_name) DO NOTHING;
      `
    )
  );
}

export async function GET() {
  try {
    // Optionally run seeders:
    // await seedProducts();
    // await seedProductTags();

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
