'use server';

import { z } from 'zod';

import { revalidatePath } from 'next/cache';
import { batchRemoveImages } from './images.actions';
import { Product, ProductResponse } from '@/models/product';
import { Image } from '@/models/image';
import { ProductType } from '@/models/productType';

import { sql } from '@/lib/db';

const FormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string(),
  shortDescription: z.string().max(255).optional(), // Short summary for preview pages
  price: z.number(),
  type: z.string(),
  sale: z.string(),
  stock: z.string(),
  tagIds: z.string().optional(),
  primaryColor: z.string().optional(),
  colors: z.string().optional(),
  pattern: z.string().optional(),
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
    shortDescription?: string[];
    price?: string[];
    type?: string[];
    sale?: string[];
    stock?: string[];
    tag?: string[];
  };
  message?: string | null;
};

export async function createProduct(prevState: State, formData: FormData) {
  const validatedFields = CreateProduct.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    shortDescription: formData.get('shortDescription') || '',
    price: Number(formData.get('price') || 0),
    type: formData.get('type'),
    sale: formData.get('sale'),
    stock: formData.get('stock'),
    tagIds: formData.get('tagIds'),
    primaryColor: formData.get('primaryColor'),
    colors: formData.get('colors'),
    pattern: formData.get('pattern')
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Product.'
    };
  }

  const {
    name,
    description,
    shortDescription,
    price,
    type,
    sale,
    stock,
    tagIds,
    primaryColor,
    colors,
    pattern
  } = validatedFields.data;
  const date = new Date().toISOString();

  const tagIdsArray = tagIds ? tagIds.split(',') : [];

  // Parse primaryColor as JSON array of color hex values
  const colorHexArray = JSON.parse(primaryColor || '[]') as string[];

  let id = '';
  try {
    const result =
      await sql`INSERT INTO products (name, price, type, sale, stock, created_at, updated_at, description, short_description, primary_color, colors, pattern) 
    VALUES (${name}, ${price}, ${type}, ${sale}, ${stock}, ${date}, ${date}, ${description}, ${
        shortDescription || ''
      }, ${primaryColor || ''}, ${colors || ''}, ${
        pattern || ''
      }) RETURNING id`;
    id = result[0].id;

    // Insert tag mappings
    for (const tagId of tagIdsArray) {
      await sql`INSERT INTO product_tag_mappings (product_id, tag_id, created_at) VALUES (${id}, ${tagId}, ${date})`;
    }

    // Insert color mappings for searchable product colors
    for (const colorHex of colorHexArray) {
      await sql`INSERT INTO product_colors (product_id, color_hex, created_at) VALUES (${id}, ${colorHex}, ${date})`;
    }
  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Failed to Create Product.',
      errors: {}
    };
  }

  revalidatePath('/admin/dashboard/products');
  return {
    id,
    message: 'Product created successfully.'
  };
}

export async function updateProduct(prevState: State, formData: FormData) {
  const validatedFields = UpdateProduct.safeParse({
    id: formData.get('id'),
    name: formData.get('name'),
    description: formData.get('description'),
    shortDescription: formData.get('shortDescription') || '',
    price: Number(formData.get('price') || 0),
    type: formData.get('type'),
    sale: formData.get('sale'),
    stock: formData.get('stock'),
    tagIds: formData.get('tagIds'),
    primaryColor: formData.get('primaryColor'),
    colors: formData.get('colors'),
    pattern: formData.get('pattern')
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Product.'
    };
  }

  const {
    name,
    description,
    shortDescription,
    price,
    type,
    sale,
    stock,
    id,
    tagIds,
    primaryColor,
    colors,
    pattern
  } = validatedFields.data;
  const date = new Date().toISOString();

  const tagIdsArray = tagIds ? tagIds.split(',') : [];

  // Parse primaryColor as JSON array of color hex values
  const colorHexArray = JSON.parse(primaryColor || '[]') as string[];

  console.log('Starting update product');
  console.log({ tagIdsArray, tagIds, colorHexArray });
  try {
    await sql`
    UPDATE products 
    SET name = ${name}, description = ${description}, short_description = ${
      shortDescription || ''
    }, price = ${price}, type = ${type}, sale = ${sale}, stock = ${stock}, updated_at = ${date}, primary_color = ${
      primaryColor || ''
    }, colors = ${colors || ''}, pattern = ${pattern || ''} 
    WHERE id = ${id}`;

    // Update product tag mappings (delete and re-insert)
    await sql`DELETE FROM product_tag_mappings WHERE product_id = ${id}`;
    for (const tagId of tagIdsArray) {
      await sql`INSERT INTO product_tag_mappings (product_id, tag_id, created_at) VALUES (${id}, ${tagId}, ${date})`;
    }

    // Update product color mappings for searchable colors (delete and re-insert)
    await sql`DELETE FROM product_colors WHERE product_id = ${id}`;
    for (const colorHex of colorHexArray) {
      await sql`INSERT INTO product_colors (product_id, color_hex, created_at) VALUES (${id}, ${colorHex}, ${date})`;
    }
  } catch (error) {
    return { message: 'Database Error: Failed to Update Product.' };
  }

  revalidatePath('/admin/dashboard/products');
  return { message: 'Product updated successfully.' };
}

export async function deleteProduct(id: string) {
  try {
    await sql`DELETE FROM images WHERE product_id = ${id}`;
    console.log('Deleted product images');

    // Delete product tag mappings if exist
    const productTagMappings =
      await sql`SELECT * FROM product_tag_mappings WHERE product_id = ${id}`;
    if (productTagMappings.length > 0) {
      await sql`DELETE FROM product_tag_mappings WHERE product_id = ${id}`;
      console.log('Deleted product tag mappings');
    }

    // Delete product color mappings (also handled by ON DELETE CASCADE)
    await sql`DELETE FROM product_colors WHERE product_id = ${id}`;
    console.log('Deleted product color mappings');

    await sql`DELETE FROM products WHERE id = ${id}`;
    console.log('Deleted product');
    await batchRemoveImages(id);
    console.log('Deleted images media');
  } catch (error) {
    console.error('Database Error:', error);
  }

  revalidatePath('/admin/dashboard/products');
}

export async function updateActiveImage(newId: string, oldId: string) {
  try {
    await sql`UPDATE images SET is_main = ${true} WHERE id = ${newId}`;
    await sql`UPDATE images SET is_main = ${false} WHERE id = ${oldId}`;
    revalidatePath('/admin/dashboard/products');
  } catch (error) {
    console.error('Database Error:', error);
  }
}

export async function fetchProductImages(id: string) {
  try {
    const images = await sql<Image[]>`
      SELECT id, name, type, is_main as "isMain", product_id as "productId", created_at as "createdAt", updated_at as "updatedAt" 
      FROM images 
      WHERE product_id = ${id}
    `;

    return images || [];
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch product images.');
  }
}

export async function fetchProductById(id: string) {
  try {
    const product = await sql<Product[]>`
      SELECT id, name, price, sale, type, stock, description, short_description as "shortDescription", primary_color as "primaryColor", colors, pattern, created_at as "createdAt", updated_at as "updatedAt"
      FROM products WHERE id = ${id}
    `;

    const images = await sql<Image[]>`
      SELECT id, name, type, is_main as "isMain", product_id as "productId", created_at as "createdAt", updated_at as "updatedAt"
      FROM images 
      WHERE product_id = ${id}
    `;

    const productType = await sql<ProductType[]>`
      SELECT * FROM product_types WHERE id = ${product[0].type}
    `;

    const tagMappings = await sql<{ tag_id: string }[]>`
      SELECT tag_id FROM product_tag_mappings WHERE product_id = ${id}
    `;

    return {
      product: {
        ...product[0],
        tagIds: (tagMappings || []).map(({ tag_id }) => tag_id)
      },
      images: images || [],
      productType: productType[0]
    };
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
        p.short_description as "shortDescription",
        p.price,
        p.sale,
        p.type,
        p.stock,
        p.primary_color as "primaryColor",
        p.colors,
        p.pattern,
        json_build_object(
          'id', product_image.id,
          'name', product_image.name,
          'type', product_image.type,
          'is_main', product_image.is_main
        ) as product_image,
        COALESCE(
          (
            SELECT array_agg(ptm.tag_id::text)
            FROM product_tag_mappings ptm
            WHERE ptm.product_id = p.id
          ),
          ARRAY[]::text[]
        ) as "tagIds"
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
    throw new Error('Failed to fetch all products.');
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
