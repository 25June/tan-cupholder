'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import {
  deleteFile,
  deleteFiles,
  generateSignedUrl,
  listFiles
} from '@/app/lib/bucket';

import { sql } from '@/lib/db';

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

const DeleteImage = FormSchema.omit({
  isMain: true,
  type: true,
  name: true,
  productId: true
});

export type State = {
  errors?: {
    id?: string[];
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
    presignedUrl = await generateSignedUrl(productId, name, type);
  } catch (error) {
    console.error('S3 Error:', error);
  }

  const date = new Date().toISOString();

  try {
    await sql`INSERT INTO images (name, type, product_id, is_main, created_at, updated_at) VALUES (${name}, ${type}, ${productId}, ${
      isMain || false
    }, ${date}, ${date} )`;
    revalidatePath('/admin/dashboard/products');
  } catch (error) {
    console.error('Database Error:', error);
  }

  return {
    presignedUrl
  };
}

export async function removeImage(id: string) {
  if (!id) {
    return {
      errors: { id: ['Id is required'] }
    };
  }

  const image = await sql`SELECT * FROM images WHERE id = ${id}`;

  if (!image) {
    return {
      errors: { id: ['Image not found'] }
    };
  }

  try {
    await sql`DELETE FROM images WHERE id = ${id}`;
    await deleteFile(image[0].product_id, image[0].name);
  } catch (error) {
    console.error('Database Error:', error);
  }

  revalidatePath('/admin/dashboard/products');
  return {
    message: 'Image removed successfully'
  };
}

export async function batchRemoveImages(folderPrefix: string) {
  const listResponse = await listFiles(folderPrefix);
  if (!listResponse) {
    return {
      errors: { folderPrefix: ['Folder prefix not found'] }
    };
  }
  const deleteResponse = await deleteFiles(listResponse);
  if (!deleteResponse?.success) {
    return {
      errors: { folderPrefix: ['Failed to delete files'] }
    };
  }
  return {
    message: 'Images removed successfully'
  };
}
