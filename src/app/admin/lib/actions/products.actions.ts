'use server';

import { z } from 'zod';
import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { batchRemoveImages } from './images.actions';
import { Product, ProductResponse } from '@/models/product';
import { Image } from '@/models/image';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const FormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string(),
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
  createdAt: true,
  updatedAt: true
});

export type State = {
  errors?: {
    name?: string[];
    description?: string[];
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
    price: Number(formData.get('price') || 0),
    type: formData.get('type'),
    sale: formData.get('sale'),
    stock: formData.get('stock')
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Product.'
    };
  }

  const { name, description, price, type, sale, stock } = validatedFields.data;
  const date = new Date().toISOString().split('T')[0];

  let id = '';
  try {
    const result =
      await sql`INSERT INTO products (name, price, type, sale, stock, created_at, updated_at, description) 
    VALUES (${name}, ${price}, ${type}, ${sale}, ${stock}, ${date}, ${date}, ${description}) RETURNING id`;
    id = result[0].id;
  } catch (error) {
    console.error('Database Error:', error);
  }

  return {
    id
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
  console.log({ name });
  try {
    await sql`
    UPDATE products 
    SET name = ${name}, description = ${description},  price = ${price}, type = ${type}, sale = ${sale}, stock = ${stock}, updated_at = ${date} 
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

export async function updateActiveImage(newId: string, oldId: string) {
  try {
    await sql`UPDATE images SET is_main = ${true} WHERE id = ${newId}`;
    await sql`UPDATE images SET is_main = ${false} WHERE id = ${oldId}`;
  } catch (error) {
    console.error('Database Error:', error);
  }
}

export async function fetchProductById(id: string) {
  try {
    const product = await sql<Product[]>`
      SELECT * FROM products WHERE id = ${id}
    `;

    const images = await sql<Image[]>`
      SELECT id, name, type, is_main as "isMain", product_id as "productId", created_at as "createdAt", updated_at as "updatedAt" 
      FROM images 
      WHERE product_id = ${id}
    `;

    return { product: product[0], images: images || [] };
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch product.');
  }
}

export async function fetchProducts(searchParams?: {
  readonly query?: string;
  readonly page?: string;
}) {
  try {
    const products = await sql<ProductResponse[]>`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.sale,
        p.type,
        p.stock,
        json_build_object(
          'id', product_image.id,
          'name', product_image.name,
          'type', product_image.type,
          'is_main', product_image.is_main
        ) as product_image
      FROM products p
      LEFT JOIN images product_image ON p.id = product_image.product_id AND product_image.is_main = TRUE
      WHERE p.name ILIKE ${
        searchParams?.query ? `%${searchParams.query}%` : '%'
      }
      ORDER BY p.name ASC
      LIMIT 10 
      OFFSET ${searchParams?.page ? Number(searchParams.page) * 10 - 10 : 0}
    `;

    return products;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchTotalProducts() {
  try {
    const data = await sql<{ count: string }[]>`
      SELECT COUNT(*) AS count
      FROM products
    `;

    return Number(data[0].count);
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch total number of products.');
  }
}
