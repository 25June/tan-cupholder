'use server';

import { sql } from '@/lib/db';

export async function getProductById(id: string) {
  try {
    const product = await sql`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.sale,
        p.stock,
        pt.name as type_name,
        json_build_object(
          'id', product_image.id,
          'name', product_image.name,
          'type', product_image.type,
          'is_main', product_image.is_main
        ) as product_image
      FROM products p
      LEFT JOIN product_types pt ON p.type = pt.id
      LEFT JOIN images product_image ON p.id = product_image.product_id AND product_image.is_main = TRUE
      WHERE p.id = ${id}
    `;

    return product[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch product.');
  }
}
