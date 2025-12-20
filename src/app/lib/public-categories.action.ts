'use server';

import { sql } from '@/lib/db';
import { getAndParseConfig } from '@/app/admin/lib/actions/public-config.actions';
import { ProductType } from '@/models/productType';

export async function getPublicCategories() {
  try {
    const ids = await getAndParseConfig<string[]>('product_types');
    if (!ids || ids.length === 0) {
      const categories = await sql`
      SELECT * FROM product_types 
      WHERE image_url IS NOT NULL
      ORDER BY created_at DESC
      LIMIT 9
    `;
      return categories;
    }

    const top9 = ids.slice(0, 9);

    const productTypes = await sql`
      SELECT * FROM product_types 
    `;

    const categories = top9.map((id) =>
      productTypes.find((productType: ProductType) => productType.id === id)
    );

    return categories;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch public categories.');
  }
}
