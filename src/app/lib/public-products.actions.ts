'use server';

import postgres from 'postgres';
import { ProductResponse } from '@/models/product';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function publicFetchProducts(searchParams?: {
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
        pt.name as type,
        p.stock,
        json_build_object(
          'id', product_image.id,
          'name', product_image.name,
          'type', product_image.type,
          'is_main', product_image.is_main
        ) as product_image
      FROM products p
      LEFT JOIN product_types pt ON p.type = pt.id
      LEFT JOIN images product_image ON p.id = product_image.product_id AND product_image.is_main = TRUE
      WHERE p.name ILIKE '%' || ${searchParams?.query || ''} || '%'
      ORDER BY p.name ASC
      LIMIT 10 
      OFFSET ${searchParams?.page ? (Number(searchParams.page) - 1) * 10 : 0}
    `;

    const totalCount = await sql<{ count: string }[]>`
      SELECT COUNT(*) AS count
      FROM products
    `;

    return { products, totalCount: Number(totalCount[0].count) };
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}
