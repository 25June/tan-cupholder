'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

import { sql } from '@/lib/db';
import { EmailLog, EmailLogState } from '@/models/emailLog';

// Define email log validation schema
const EmailLogSchema = z.object({
  order_id: z.string().uuid({ message: 'Invalid order ID format' }),
  to: z.string().email({ message: 'Invalid email address' }),
  subject: z.string().min(1, { message: 'Subject is required' }),
  content: z.string().min(1, { message: 'Content is required' })
});

/**
 * Add a new email log entry to the database
 */
export async function addEmailLog(
  orderId: string,
  to: string,
  subject: string,
  content: string
): Promise<EmailLogState> {
  const date = new Date().toISOString();

  try {
    await sql`
      INSERT INTO email_logs (order_id, to_email, subject, content, created_at)
      VALUES (${orderId}, ${to}, ${subject}, ${content}, ${date})
    `;
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to Create Email Log.' };
  }

  revalidatePath('/admin/dashboard/orders');
  return { message: 'Email log created successfully.' };
}

/**
 * Add email log directly without form data (for programmatic use)
 */
export async function createEmailLog({
  orderId,
  to,
  subject,
  content
}: {
  orderId: string;
  to: string;
  subject: string;
  content: string;
}): Promise<{ success: boolean; message: string; id?: string }> {
  const validatedFields = EmailLogSchema.safeParse({
    order_id: orderId,
    to,
    subject,
    content
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: `Validation Error: ${
        validatedFields.error.errors[0]?.message || 'Invalid input'
      }`
    };
  }

  const date = new Date().toISOString();

  try {
    const result = await sql<{ id: string }[]>`
      INSERT INTO email_logs (order_id, to_email, subject, content, created_at)
      VALUES (${orderId}, ${to}, ${subject}, ${content}, ${date})
      RETURNING id
    `;

    return {
      success: true,
      message: 'Email log created successfully.',
      id: result[0]?.id
    };
  } catch (error) {
    console.error('Database Error:', error);
    return {
      success: false,
      message: 'Database Error: Failed to Create Email Log.'
    };
  }
}

/**
 * Delete an email log by ID
 */
export async function deleteEmailLog(
  id: string
): Promise<{ success: boolean; message: string }> {
  try {
    await sql`DELETE FROM email_logs WHERE id = ${id}`;
    revalidatePath('/admin/dashboard/orders');
    return { success: true, message: 'Email log deleted successfully.' };
  } catch (error) {
    console.error('Database Error:', error);
    return {
      success: false,
      message: 'Database Error: Failed to Delete Email Log.'
    };
  }
}

/**
 * Get all email logs for a specific email address
 */
export async function getEmailLogsByEmail(email: string): Promise<EmailLog[]> {
  try {
    const logs = await sql<EmailLog[]>`
      SELECT id, order_id, to_email as to, subject, content, created_at
      FROM email_logs
      WHERE to_email = ${email}
      ORDER BY created_at DESC
    `;
    return logs;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch email logs by email.');
  }
}

/**
 * Get all email logs for a specific order
 */
export async function getEmailLogsByOrderId(
  orderId: string
): Promise<EmailLog[]> {
  try {
    const logs = await sql<EmailLog[]>`
      SELECT id, order_id, to_email as to, subject, content, created_at
      FROM email_logs
      WHERE order_id = ${orderId}
      ORDER BY created_at DESC
    `;
    return logs;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch email logs by order ID.');
  }
}

/**
 * Get email log by ID
 */
export async function getEmailLogById(id: string): Promise<EmailLog | null> {
  try {
    const logs = await sql<EmailLog[]>`
      SELECT id, order_id, to_email as to, subject, content, created_at
      FROM email_logs
      WHERE id = ${id}
    `;
    return logs[0] || null;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch email log.');
  }
}
