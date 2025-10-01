import bcrypt from 'bcrypt';
import postgres from 'postgres';
import { invoices, customers, revenue, users } from '../lib/placeholder-data';

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

async function seedProductImages() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS images (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      product_id UUID NOT NULL,
      name VARCHAR(255) NOT NULL,
      type VARCHAR(255) NOT NULL,
      is_main BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id)
    );
  `;
}

async function seedAddFeatureProducts() {
  await sql`
    ALTER TABLE products
    ADD COLUMN IF NOT EXISTS priority INTEGER NOT NULL DEFAULT 0;
  `;
}

async function seedCustomer() {
  await sql`
    ALTER TABLE customers
    ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20),
    ADD COLUMN IF NOT EXISTS address TEXT,
    ADD COLUMN IF NOT EXISTS is_email_verified BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
  `;
}

async function seedOrders() {
  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      customer_id UUID NOT NULL,
      status INTEGER NOT NULL DEFAULT 0,
      total_items INT NOT NULL,
      total_price INT NOT NULL,
      payment_method VARCHAR(255) NOT NULL,
      payment_status VARCHAR(255) NOT NULL,
      payment_date TIMESTAMP NOT NULL,
      shipping_address TEXT NOT NULL,
      shipping_city VARCHAR(255) NOT NULL,
      is_verified BOOLEAN NOT NULL DEFAULT FALSE,
      is_paid BOOLEAN NOT NULL DEFAULT FALSE,
      is_shipped BOOLEAN NOT NULL DEFAULT FALSE,
      is_delivered BOOLEAN NOT NULL DEFAULT FALSE,
      is_cancelled BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers(id)
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS order_products (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      order_id UUID NOT NULL,
      product_id UUID NOT NULL,
      quantity INT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );
  `;
}

async function seedFeatureImage() {
  await sql`CREATE TABLE IF NOT EXISTS feature_images (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`;
}

async function seedContent() {
  await sql`
    CREATE TABLE IF NOT EXISTS content (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      key VARCHAR(255) NOT NULL UNIQUE,
      value TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      created_by VARCHAR(255) NOT NULL,
      updated_by VARCHAR(255) NOT NULL
    )`;
}

async function seedUserRole() {
  await sql`
    CREATE TABLE IF NOT EXISTS user_roles (
      id INT PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    )`;

  await sql`
    INSERT INTO user_roles (id, name)
    VALUES (1, 'ADMIN'), (2, 'STAFF')
    ON CONFLICT (id) DO NOTHING;
  `;
}

const firstUser = {
  id: 'f30c4f5f-fbf8-4a61-8d1a-599f1af84f8a',
  firstName: 'Phu',
  lastName: 'Nguyen',
  fullName: 'Phu Nguyen',
  email: 'ngocphu2506@gmail.com',
  password: 'Abc@12345',
  avatarURL: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  role: '1',
  status: 'ACTIVE',
  emailVerified: true,
  emailVerifiedAt: new Date().toISOString()
};

async function seedUser() {
  await sql`
    CREATE TABLE IF NOT EXISTS user_info (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      first_name VARCHAR(255) NOT NULL,
      last_name VARCHAR(255) NOT NULL,
      full_name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      avatar_url VARCHAR(255),
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      role INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      email_verified BOOLEAN NOT NULL DEFAULT FALSE,
      email_verified_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (role) REFERENCES user_roles(id)
    )`;

  const insertedUserInfo = await sql`
    INSERT INTO user_info (id, first_name, last_name, full_name, email, avatar_url, created_at, updated_at, role, status, email_verified, email_verified_at)
    VALUES (${firstUser.id}, ${firstUser.firstName}, ${firstUser.lastName}, ${firstUser.fullName}, ${firstUser.email}, ${firstUser.avatarURL}, ${firstUser.createdAt}, ${firstUser.updatedAt}, ${firstUser.role}, ${firstUser.status}, ${firstUser.emailVerified}, ${firstUser.emailVerifiedAt})
    ON CONFLICT (id) DO NOTHING;
  `;

  return insertedUserInfo;
}

async function seedUserCredentials() {
  await sql`
    CREATE TABLE IF NOT EXISTS user_credentials (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES user_info(id),
      password TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      provider VARCHAR(255) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`;
  const hashedPassword = await bcrypt.hash(firstUser.password, 10);
  return sql`
        INSERT INTO user_credentials (user_id, password, email, provider, created_at, updated_at)
        VALUES (${firstUser.id}, ${hashedPassword}, ${
    firstUser.email
  }, ${'credentials'}, ${firstUser.createdAt}, ${firstUser.updatedAt})
        ON CONFLICT (id) DO NOTHING;
      `;
}

async function seedEmailTemplates() {
  await sql`
    CREATE TABLE IF NOT EXISTS email_templates (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      subject VARCHAR(255) NOT NULL,
      html_content TEXT NOT NULL,
      description TEXT,
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `;
}

export async function GET() {
  try {
    // const userRole = await sql.begin(seedUserRole);

    // const userInfo = await sql.begin(seedUser);
    // const userCredentials = await sql.begin(seedUserCredentials);
    // const result = await sql.begin(seedEmailTemplates);

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
