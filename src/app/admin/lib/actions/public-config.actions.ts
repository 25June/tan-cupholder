'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { sql } from '@/lib/db';
import { PublicConfig } from '@/models/publicConfig';
import { parseConfigValue } from '@/app/admin/lib/utils';

const PublicConfigSchema = z.object({
  key: z.string().min(1, { message: 'Key is required' }),
  value: z.string().min(1, { message: 'Value is required' }),
  description: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string()
});

const CreatePublicConfig = PublicConfigSchema.omit({
  createdAt: true,
  updatedAt: true
});

const UpdatePublicConfig = PublicConfigSchema.omit({
  createdAt: true,
  updatedAt: true
});

export type State = {
  errors?: {
    key?: string[];
    value?: string[];
    description?: string[];
  };
  message?: string | null;
};

// Get all public configs
export const getAllPublicConfigs = async () => {
  try {
    const configs = await sql<PublicConfig[]>`
      SELECT * FROM public_config
      ORDER BY created_at DESC
    `;
    return configs;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch public configs.');
  }
};

// Get config by key
export const getPublicConfigByKey = async (key: string) => {
  try {
    const config = await sql<PublicConfig[]>`
      SELECT * FROM public_config
      WHERE key = ${key}
    `;
    return config[0] || null;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error(`Failed to fetch public config with key: ${key}`);
  }
};

// Create new public config
export const createPublicConfig = async (
  prevState: State,
  formData: FormData
) => {
  const validatedFields = CreatePublicConfig.safeParse({
    key: formData.get('key'),
    value: formData.get('value'),
    description: formData.get('description')
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Public Config.'
    };
  }

  const { key, value, description } = validatedFields.data;
  const date = new Date().toISOString();

  try {
    // Check if key already exists
    const existing = await sql<PublicConfig[]>`
      SELECT * FROM public_config
      WHERE key = ${key}
    `;

    if (existing.length > 0) {
      return {
        errors: { key: ['Key already exists'] },
        message: 'Key already exists. Please use a different key.'
      };
    }

    await sql`
      INSERT INTO public_config (key, value, description, created_at, updated_at)
      VALUES (${key}, ${value}, ${description || null}, ${date}, ${date})
    `;
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to Create Public Config.' };
  }

  revalidatePath('/admin/dashboard/public-config');
  return { message: 'Public config created successfully.' };
};

// Alternative create method that accepts object parameters
export const createPublicConfigDirect = async (data: {
  key: string;
  value: string;
  description?: string;
}) => {
  const date = new Date().toISOString();

  try {
    // Check if key already exists
    const existing = await sql<PublicConfig[]>`
      SELECT * FROM public_config
      WHERE key = ${data.key}
    `;

    if (existing.length > 0) {
      throw new Error('Key already exists. Please use a different key.');
    }

    await sql`
      INSERT INTO public_config (key, value, description, created_at, updated_at)
      VALUES (${data.key}, ${data.value}, ${
      data.description || null
    }, ${date}, ${date})
    `;

    revalidatePath('/admin/dashboard/public-config');
    return { success: true, message: 'Public config created successfully.' };
  } catch (error) {
    console.error('Database Error:', error);
    throw error;
  }
};

// Update public config by key
export const updatePublicConfig = async (
  prevState: State,
  formData: FormData
) => {
  const validatedFields = UpdatePublicConfig.safeParse({
    key: formData.get('key'),
    value: formData.get('value'),
    description: formData.get('description')
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Public Config.'
    };
  }

  const { key, value, description } = validatedFields.data;
  const date = new Date().toISOString();

  try {
    const result = await sql`
      UPDATE public_config
      SET value = ${value}, description = ${
      description || null
    }, updated_at = ${date}
      WHERE key = ${key}
    `;

    if (result.length === 0) {
      return { message: 'Public config not found.' };
    }
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to Update Public Config.' };
  }

  revalidatePath('/admin/dashboard/public-config');
  return { message: 'Public config updated successfully.' };
};

// Alternative update method that accepts object parameters
export const updatePublicConfigDirect = async (
  key: string,
  data: {
    value: string;
    description?: string;
  }
) => {
  const date = new Date().toISOString();
  console.log('Updating public config:', key, data);
  try {
    const result = await sql`
      UPDATE public_config
      SET value = ${data.value}, description = ${
      data.description || null
    }, updated_at = ${date}
      WHERE key = ${key}
    `;

    revalidatePath('/admin/dashboard/public-config');
    return { success: true, message: 'Public config updated successfully.' };
  } catch (error) {
    console.error('Database Error:', error);
    throw error;
  }
};

// Delete public config by key
export const deletePublicConfig = async (key: string) => {
  try {
    await sql`DELETE FROM public_config WHERE key = ${key}`;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to delete public config.');
  }

  revalidatePath('/admin/dashboard/public-config');
  return { message: 'Public config deleted successfully.' };
};

// Helper function to get and parse config by key
export const getAndParseConfig = async <T = any>(
  key: string
): Promise<T | null> => {
  const config = await getPublicConfigByKey(key);
  return parseConfigValue<T>(config);
};
