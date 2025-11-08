'use server';

import { z } from 'zod';
import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { ProductType } from '@/models/productType';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const ProductTypeSchema = z.object({
  id: z.string().min(1, { message: 'Id is required' }),
  name: z.string().min(1, { message: 'Name is required' }),
  shortName: z.string().min(1, { message: 'Short name is required' }),
  description: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string()
});

const CreateProductType = ProductTypeSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

const UpdateProductType = ProductTypeSchema.omit({
  createdAt: true,
  updatedAt: true
});

export type State = {
  errors?: {
    name?: string[];
    shortName?: string[];
    description?: string[];
  };
  message?: string | null;
};

export async function getProductTypes({
  query,
  page
}: {
  query: string;
  page: string;
}) {
  try {
    let productTypes;
    if (page === '0') {
      productTypes = await sql<ProductType[]>`
        SELECT * FROM product_types
        ORDER BY created_at DESC
      `;
      return productTypes;
    }

    const ITEMS_PER_PAGE = 50;
    const offset = (Number(page) - 1) * ITEMS_PER_PAGE;

    if (query) {
      productTypes = await sql<ProductType[]>`
        SELECT * FROM product_types
        WHERE name ILIKE ${`%${query}%`} OR short_name ILIKE ${`%${query}%`}
        ORDER BY created_at DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `;
    } else {
      productTypes = await sql<ProductType[]>`
        SELECT * FROM product_types
        ORDER BY created_at DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `;
    }
    return productTypes;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch product types.');
  }
}

export async function fetchTotalProductTypes() {
  try {
    const count = await sql`
      SELECT COUNT(*) FROM product_types
    `;
    return Number(count[0].count);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total product types.');
  }
}

export async function getProductTypeById(id: string) {
  try {
    const productType = await sql<ProductType[]>`
      SELECT * FROM product_types 
      WHERE id = ${id}
    `;
    return productType[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch product type.');
  }
}

export async function createProductType(prevState: State, formData: FormData) {
  const validatedFields = CreateProductType.safeParse({
    name: formData.get('name'),
    shortName: formData.get('shortName'),
    description: formData.get('description')
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Product Type.'
    };
  }

  const { name, shortName, description } = validatedFields.data;
  const date = new Date().toISOString();

  try {
    await sql`
      INSERT INTO product_types (name, short_name, description, created_at, updated_at)
      VALUES (${name}, ${shortName}, ${description || null}, ${date}, ${date})
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Create Product Type.' };
  }

  revalidatePath('/admin/dashboard/product-types');
  return { message: 'Product type updated successfully.' };
}

export async function updateProductType(prevState: State, formData: FormData) {
  const validatedFields = UpdateProductType.safeParse({
    id: formData.get('id'),
    name: formData.get('name'),
    shortName: formData.get('shortName'),
    description: formData.get('description')
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Product Type.'
    };
  }

  const { id, name, shortName, description } = validatedFields.data;
  const date = new Date().toISOString();

  try {
    await sql`
      UPDATE product_types
      SET name = ${name}, short_name = ${shortName}, description = ${
      description || null
    }, updated_at = ${date}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Product Type.' };
  }

  revalidatePath('/admin/dashboard/product-types');
  return { message: 'Product type updated successfully.' };
}

export async function deleteProductType(id: string) {
  try {
    await sql`DELETE FROM product_types WHERE id = ${id}`;
  } catch (error) {
    console.error('Database Error:', error);
  }

  revalidatePath('/admin/dashboard/product-types');
}
