'use server';

import { z } from 'zod';

import { revalidatePath } from 'next/cache';
import { Customer } from '@/models/customer';

import { sql } from '@/lib/db';

const CustomerSchema = z.object({
  id: z.string().min(1, { message: 'Id is required' }),
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phone_number: z.string().optional(),
  address: z.string().optional(),
  image_url: z.string().optional(),
  is_email_verified: z.boolean().optional(),
  created_at: z.string(),
  updated_at: z.string()
});

const CreateCustomer = CustomerSchema.omit({
  id: true,
  created_at: true,
  updated_at: true
});

const UpdateCustomer = CustomerSchema.omit({
  created_at: true,
  updated_at: true
});

export type State = {
  errors?: {
    name?: string[];
    email?: string[];
    phone_number?: string[];
    address?: string[];
  };
  message?: string | null;
};

export async function createCustomer(prevState: State, formData: FormData) {
  const validatedFields = CreateCustomer.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    phone_number: formData.get('phone_number'),
    address: formData.get('address'),
    image_url: formData.get('image_url') || '',
    is_email_verified: formData.get('is_email_verified') === 'true'
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Customer.'
    };
  }

  const { name, email, phone_number, address, image_url, is_email_verified } =
    validatedFields.data;
  const date = new Date().toISOString();

  try {
    await sql`
      INSERT INTO customers (name, email, phone_number, address, image_url, is_email_verified, created_at, updated_at)
      VALUES (${name}, ${email}, ${phone_number || null}, ${address || null}, ${
      image_url || null
    }, ${is_email_verified || false}, ${date}, ${date})
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Create Customer.' };
  }

  revalidatePath('/admin/dashboard/customers');
  return { message: 'Customer created successfully.' };
}

export async function updateCustomer(prevState: State, formData: FormData) {
  const validatedFields = UpdateCustomer.safeParse({
    id: formData.get('id'),
    name: formData.get('name'),
    email: formData.get('email'),
    phone_number: formData.get('phone_number'),
    address: formData.get('address'),
    image_url: formData.get('image_url') || '',
    is_email_verified: formData.get('is_email_verified') === 'true'
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Customer.'
    };
  }

  const {
    id,
    name,
    email,
    phone_number,
    address,
    image_url,
    is_email_verified
  } = validatedFields.data;
  const date = new Date().toISOString();
  try {
    await sql`
      UPDATE customers
      SET name = ${name}, email = ${email}, phone_number = ${
      phone_number || ''
    }, address = ${address || ''}, image_url = ${
      image_url || ''
    }, is_email_verified = ${is_email_verified || false}, updated_at = ${date}
      WHERE id = ${id}
    `;
  } catch (error) {
    console.log('Database Error: Failed to Update Customer.', error);
    return { message: 'Database Error: Failed to Update Customer.' };
  }

  revalidatePath('/admin/dashboard/customers');
  return { message: 'Customer updated successfully.' };
}

export async function deleteCustomer(id: string) {
  try {
    await sql`DELETE FROM customers WHERE id = ${id}`;
  } catch (error) {
    console.error('Database Error:', error);
  }

  revalidatePath('/admin/dashboard/customers');
}

export async function fetchCustomerById(id: string) {
  try {
    const customer = await sql<Customer[]>`
      SELECT * FROM customers WHERE id = ${id}
    `;
    return customer[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch customer.');
  }
}

export async function fetchCustomers({
  query,
  page
}: {
  query: string;
  page: string;
}) {
  try {
    const ITEMS_PER_PAGE = 10;
    const offset = (Number(page) - 1) * ITEMS_PER_PAGE;

    let customers;
    if (query) {
      customers = await sql<Customer[]>`
        SELECT * FROM customers
        WHERE name ILIKE ${`%${query}%`} OR email ILIKE ${`%${query}%`}
        ORDER BY created_at DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `;
    } else {
      customers = await sql<Customer[]>`
        SELECT * FROM customers
        ORDER BY created_at DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `;
    }
    return customers;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch customers.');
  }
}

export async function fetchTotalCustomers() {
  try {
    const count = await sql`
      SELECT COUNT(*) FROM customers
    `;
    return Number(count[0].count);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total customers.');
  }
}
