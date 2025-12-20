'use server';

import { sql } from '@/lib/db';
import { getAndParseConfig } from '@/app/admin/lib/actions/public-config.actions';
import { ProductType } from '@/models/productType';

export async function getPublicCategories() {
  try {
    const productTypes = await getAndParseConfig<ProductType[]>(
      'product_types'
    );
    if (!productTypes || productTypes.length === 0) {
      const categories = await sql`
      SELECT * FROM product_types 
      WHERE image_url IS NOT NULL
      ORDER BY created_at DESC
      LIMIT 9
    `;
      return categories;
    }

    const categories = await sql`
      SELECT * FROM product_types 
      WHERE id = ANY(${productTypes.map((productType) => productType.id)})
      ORDER BY created_at DESC
      LIMIT 9
    `;
    return categories;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch public categories.');
  }
}
