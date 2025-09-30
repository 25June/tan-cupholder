'use server';

import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { EmailTemplateResponse } from '@/models/emailTemplate';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const EmailTemplateSchema = z.object({
  id: z.string().min(1, { message: 'Id is required' }),
  name: z.string().min(1, { message: 'Name is required' }),
  subject: z.string().min(1, { message: 'Subject is required' }),
  htmlContent: z.string().min(1, { message: 'HTML content is required' }),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});

export type State = {
  errors?: {
    name?: string[];
    subject?: string[];
    htmlContent?: string[];
    description?: string[];
    isActive?: string[];
  };
  message?: string | null;
};

const CreateEmailTemplate = EmailTemplateSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
const UpdateEmailTemplate = EmailTemplateSchema.omit({
  createdAt: true,
  updatedAt: true
});

/**
 * Creates a new email template
 */
export async function createEmailTemplate(
  prevState: State,
  formData: FormData
) {
  const validationResult = CreateEmailTemplate.safeParse({
    name: formData.get('name'),
    subject: formData.get('subject'),
    htmlContent: formData.get('htmlContent'),
    description: formData.get('description'),
    isActive: formData.get('isActive') === 'true' || false
  });

  if (!validationResult.success) {
    return {
      errors: validationResult.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Email Template.'
    };
  }

  const validatedFields = validationResult.data;
  let id = '';
  const date = new Date().toISOString();
  try {
    const result = await sql`
      INSERT INTO email_templates (name, subject, html_content, description, is_active, created_at, updated_at)
      VALUES (${validatedFields.name}, ${validatedFields.subject}, ${
      validatedFields.htmlContent
    }, ${validatedFields.description || ''}, ${
      validatedFields.isActive || false
    }, ${date}, ${date}) RETURNING id
    `;
    id = result[0].id;
    return {
      id
    };
  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Failed to create email template.'
    };
  }
}

/**
 * Updates an existing email template
 */
export async function updateEmailTemplate(
  id: string,
  prevState: State,
  formData: FormData
): Promise<State> {
  const validationResult = UpdateEmailTemplate.safeParse({
    id: formData.get('id'),
    name: formData.get('name'),
    subject: formData.get('subject'),
    htmlContent: formData.get('htmlContent'),
    description: formData.get('description'),
    isActive: formData.get('isActive') === 'true' || false
  });

  if (!validationResult.success) {
    return {
      errors: validationResult.error.flatten().fieldErrors,
      message: 'Please fill in all required fields.'
    };
  }

  const validatedFields = validationResult.data;
  const date = new Date().toISOString();
  try {
    await sql`
      UPDATE email_templates 
      SET name = ${validatedFields.name}, 
          subject = ${validatedFields.subject}, 
          html_content = ${validatedFields.htmlContent}, 
          description = ${validatedFields.description || ''}, 
          is_active = ${validatedFields.isActive || false}, 
          updated_at = ${date}
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error('Error updating email template:', error);
    throw new Error('Failed to update email template.');
  }

  revalidatePath('/admin/dashboard/email-templates');
  redirect('/admin/dashboard/email-templates');
}

/**
 * Deletes an email template
 */
export async function deleteEmailTemplate(id: string) {
  try {
    await sql`
      DELETE FROM email_templates 
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error('Database Error:', error);
  }

  revalidatePath('/admin/dashboard/email-templates');
}

/**
 * Fetches all email templates with search and pagination
 */
export async function fetchEmailTemplates(searchParams?: {
  readonly query?: string;
  readonly page?: string;
}) {
  try {
    const templates = await sql<EmailTemplateResponse[]>`
      SELECT id, name, subject, html_content as "htmlContent", description, is_active as "isActive", 
             created_at as "createdAt", updated_at as "updatedAt"
      FROM email_templates
      WHERE name ILIKE ${searchParams?.query ? `%${searchParams.query}%` : '%'}
      ORDER BY name ASC
      LIMIT 10 OFFSET ${
        searchParams?.page ? Number(searchParams.page) * 10 - 10 : 0
      }
    `;

    return templates;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch email templates.');
  }
}

export async function fetchTotalEmailTemplates() {
  try {
    const total = await sql`
      SELECT COUNT(*) as count
      FROM email_templates
    `;
    return Number(total[0].count);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total email templates.');
  }
}

/**
 * Fetches email template by ID
 */
export async function fetchEmailTemplateById(id: string) {
  try {
    const result = await sql<EmailTemplateResponse[]>`
      SELECT id, name, subject, html_content as "htmlContent", description, is_active as "isActive", 
             created_at as "createdAt", updated_at as "updatedAt"
      FROM email_templates
      WHERE id = ${id}
    `;

    if (result.length === 0) {
      throw new Error('Email template not found.');
    }

    const template = result[0];
    return template;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch email template.');
  }
}
