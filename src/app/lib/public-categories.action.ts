'use server';

import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function getPublicCategories() {
  try {
    const categories = await sql`
      SELECT * FROM product_types 
      WHERE image_url IS NOT NULL
      ORDER BY created_at DESC
      LIMIT 9
    `;
    return categories;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch public categories.');
  }
}
