'use server';

import { z } from 'zod';
import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { generateSignedUrl } from '@/app/lib/bucket';
import { batchRemoveImages } from './images.actions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const FormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string(),
  image: z.string().optional(),
  imageType: z.string().optional(),
  price: z.number(),
  type: z.string(),
  sale: z.string(),
  stock: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  id: z.string().min(1, { message: 'Id is required' })
});

const CreateProduct = FormSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
const UpdateProduct = FormSchema.omit({
  image: true,
  imageType: true,
  createdAt: true,
  updatedAt: true
});

export type State = {
  errors?: {
    name?: string[];
    description?: string[];
    image?: string[];
    price?: string[];
    type?: string[];
    sale?: string[];
    stock?: string[];
  };
  message?: string | null;
};

export async function createProduct(prevState: State, formData: FormData) {
  const validatedFields = CreateProduct.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    image: formData.get('image'),
    price: Number(formData.get('price') || 0),
    type: formData.get('type'),
    sale: formData.get('sale'),
    stock: formData.get('stock')
  });
  console.log({ validatedFields });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Product.'
    };
  }

  const {
    name,
    description,
    image = '',
    price,
    type,
    sale,
    stock,
    imageType = ''
  } = validatedFields.data;
  const date = new Date().toISOString().split('T')[0];

  let id = '';
  try {
    const result =
      await sql`INSERT INTO products (name, image, price, type, sale, stock, createdAt, updatedAt, description) 
    VALUES (${name}, ${image}, ${price}, ${type}, ${sale}, ${stock}, ${date}, ${date}, ${description}) RETURNING id`;
    id = result[0].id;
  } catch (error) {
    console.error('Database Error:', error);
  }

  let presignedUrl = '';
  try {
    presignedUrl = await generateSignedUrl(id, image, imageType);
  } catch (error) {
    console.error('S3 Error:', error);
  }

  return {
    presignedUrl
  };

  // revalidatePath('/admin/dashboard/products');
  // redirect('/admin/dashboard/products');
}

export async function updateProduct(prevState: State, formData: FormData) {
  const validatedFields = UpdateProduct.safeParse({
    id: formData.get('id'),
    name: formData.get('name'),
    description: formData.get('description'),
    price: Number(formData.get('price') || 0),
    type: formData.get('type'),
    sale: formData.get('sale'),
    stock: formData.get('stock')
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Product.'
    };
  }

  const { name, description, price, type, sale, stock, id } =
    validatedFields.data;
  const date = new Date().toISOString().split('T')[0];

  try {
    await sql`
    UPDATE products 
    SET name = ${name}, description = ${description},  price = ${price}, type = ${type}, sale = ${sale}, stock = ${stock}, updatedAt = ${date} 
    WHERE id = ${id}`;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }

  revalidatePath('/admin/dashboard/products');
  redirect('/admin/dashboard/products');
}

export async function deleteProduct(id: string) {
  try {
    await sql`DELETE FROM images WHERE product_id = ${id}`;
    await sql`DELETE FROM products WHERE id = ${id}`;
    await batchRemoveImages(id);
  } catch (error) {
    console.error('Database Error:', error);
  }

  revalidatePath('/admin/dashboard/products');
}
