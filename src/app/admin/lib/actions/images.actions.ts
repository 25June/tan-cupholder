'use server';

import { z } from 'zod';
import postgres from 'postgres';
import s3Service from '@/app/lib/bucket';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const FormSchema = z.object({
  id: z.string().min(1, { message: 'Id is required' }),
  productId: z.string().min(1, { message: 'Product ID is required' }),
  name: z.string().min(1, { message: 'Image name is required' }),
  type: z.string().min(1, { message: 'Image type is required' }),
  isMain: z.boolean().optional()
});

const CreateImage = FormSchema.omit({
  id: true
});

const UpdateImage = FormSchema.omit({
  name: true,
  type: true
});

export type State = {
  errors?: {
    productId?: string[];
    name?: string[];
    type?: string[];
    isMain?: string[];
  };
  message?: string | null;
};

export async function createImage(prevState: State, formData: FormData) {
  const validatedFields = CreateImage.safeParse({
    name: formData.get('name'),
    type: formData.get('type'),
    productId: formData.get('productId'),
    isMain: formData.get('isMain') === 'true'
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors
    };
  }

  const { name, type, productId, isMain } = validatedFields.data;

  let presignedUrl = '';
  try {
    presignedUrl = await s3Service.getSignedUrl(name, type);
  } catch (error) {
    console.error('S3 Error:', error);
  }

  const date = new Date().toISOString().split('T')[0];

  try {
    await sql`INSERT INTO images (name, type, product_id, is_main, created_at, updated_at) VALUES (${name}, ${type}, ${productId}, ${
      isMain || false
    }, ${date}, ${date} )`;
  } catch (error) {
    console.error('Database Error:', error);
  }

  return {
    presignedUrl
  };
}

export async function removeImage(prevState: State, formData: FormData) {
  const validatedFields = UpdateImage.safeParse({
    id: formData.get('id')
  });

  if (!validatedFields.success) {
    return {
      errors: { id: ['Id is required'] }
    };
  }

  const { id } = validatedFields.data;

  try {
    await sql`DELETE FROM images WHERE id = ${id}`;
  } catch (error) {
    console.error('Database Error:', error);
  }

  return {
    message: 'Image removed successfully'
  };
}
