'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { sql } from '@/lib/db';

const FormSchema = z.object({
  id: z.string(),
  orderId: z.string({
    invalid_type_error: 'Please provide an order ID.'
  }),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.'
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.'
  }),
  date: z.string()
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export type State = {
  errors?: {
    orderId?: string[];
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
  // Validate form fields using Zod
  const validatedFields = CreateInvoice.safeParse({
    orderId: formData.get('orderId'),
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status')
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.'
    };
  }

  // Prepare data for insertion into the database
  const { orderId, customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString();

  // Insert data into the database
  try {
    await sql`
      INSERT INTO invoices (order_id, customer_id, amount, status, date)
      VALUES (${orderId}, ${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Create Invoice.'
    };
  }

  // Revalidate the cache for the invoices page
  revalidatePath('/admin/dashboard/invoices');
  return { message: 'Invoice created successfully!' };
}

// Invoices can no longer be updated - they are created from orders and are immutable
// Only status updates might be allowed in the future if needed

export async function deleteInvoice(id: string) {
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath('/admin/dashboard/invoices');
}
