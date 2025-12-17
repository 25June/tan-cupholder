'use server';

import { z } from 'zod';

import { revalidatePath } from 'next/cache';
import { ProductTag } from '@/models/productTag';

import { sql } from '@/lib/db';

const ProductTagSchema = z.object({
  id: z.string().min(1, { message: 'Id is required' }),
  name: z.string().min(1, { message: 'Name is required' }),
  shortName: z.string().min(1, { message: 'Short name is required' }),
  description: z.string().optional(),
  color: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string()
});

const CreateProductTag = ProductTagSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

const UpdateProductTag = ProductTagSchema.omit({
  createdAt: true,
  updatedAt: true
});

export type State = {
  errors?: {
    name?: string[];
    shortName?: string[];
    description?: string[];
    color?: string[];
  };
  message?: string | null;
};

export async function getProductTags({
  query,
  page
}: {
  query: string;
  page: string;
}) {
  try {
    let productTags;
    if (page === '0') {
      productTags = await sql<ProductTag[]>`
        SELECT * FROM product_tags
        ORDER BY created_at DESC
      `;
      return productTags;
    }

    const ITEMS_PER_PAGE = 50;
    const offset = (Number(page) - 1) * ITEMS_PER_PAGE;

    if (query) {
      productTags = await sql<ProductTag[]>`
        SELECT * FROM product_tags
        WHERE name ILIKE ${`%${query}%`} OR short_name ILIKE ${`%${query}%`}
        ORDER BY created_at DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `;
    } else {
      productTags = await sql<ProductTag[]>`
        SELECT * FROM product_tags
        ORDER BY created_at DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `;
    }
    return productTags;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch product tags.');
  }
}

export async function fetchTotalProductTags() {
  try {
    const count = await sql`
      SELECT COUNT(*) FROM product_tags
    `;
    return Number(count[0].count);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total product tags.');
  }
}

export async function getProductTagById(id: string) {
  try {
    const productTag = await sql<ProductTag[]>`
      SELECT * FROM product_tags 
      WHERE id = ${id}
    `;
    return productTag[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch product tag.');
  }
}

export async function createProductTag(prevState: State, formData: FormData) {
  const validatedFields = CreateProductTag.safeParse({
    name: formData.get('name'),
    shortName: formData.get('shortName'),
    description: formData.get('description'),
    color: formData.get('color')
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Product Tag.'
    };
  }

  const { name, shortName, description, color } = validatedFields.data;
  const date = new Date().toISOString();

  try {
    await sql`
      INSERT INTO product_tags (name, short_name, description, color, created_at, updated_at)
      VALUES (${name}, ${shortName}, ${description || null}, ${
      color || null
    }, ${date}, ${date})
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Create Product Tag.' };
  }

  revalidatePath('/admin/dashboard/product-tags');
  return { message: 'Product tag created successfully.' };
}

export async function updateProductTag(prevState: State, formData: FormData) {
  const validatedFields = UpdateProductTag.safeParse({
    id: formData.get('id'),
    name: formData.get('name'),
    shortName: formData.get('shortName'),
    description: formData.get('description'),
    color: formData.get('color')
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Product Tag.'
    };
  }

  const { id, name, shortName, description, color } = validatedFields.data;
  const date = new Date().toISOString();

  try {
    await sql`
      UPDATE product_tags
      SET name = ${name}, short_name = ${shortName}, description = ${
      description || null
    }, color = ${color || null}, updated_at = ${date}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Product Tag.' };
  }

  revalidatePath('/admin/dashboard/product-tags');
  return { message: 'Product tag updated successfully.' };
}

export async function deleteProductTag(id: string) {
  try {
    await sql`DELETE FROM product_tags WHERE id = ${id}`;
  } catch (error) {
    console.error('Database Error:', error);
  }

  revalidatePath('/admin/dashboard/product-tags');
}
