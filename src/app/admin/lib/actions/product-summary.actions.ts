'use server';

import { sql } from '@/lib/db';

export type ProductSummaryData = {
  totalProducts: number;
  totalProductTypes: number;
  totalProductTags: number;
  totalProductImages: number;
};

export async function fetchProductSummary(): Promise<ProductSummaryData> {
  try {
    const [
      productsCount,
      productTypesCount,
      productTagsCount,
      productImagesCount
    ] = await Promise.all([
      sql<{ count: string }[]>`
          SELECT COUNT(*) AS count FROM products
        `,
      sql<{ count: string }[]>`
          SELECT COUNT(*) AS count FROM product_types
        `,
      sql<{ count: string }[]>`
          SELECT COUNT(*) AS count FROM product_tags
        `,
      sql<{ count: string }[]>`
          SELECT COUNT(*) AS count FROM images
        `
    ]);

    return {
      totalProducts: Number(productsCount[0].count),
      totalProductTypes: Number(productTypesCount[0].count),
      totalProductTags: Number(productTagsCount[0].count),
      totalProductImages: Number(productImagesCount[0].count)
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch product summary data.');
  }
}
