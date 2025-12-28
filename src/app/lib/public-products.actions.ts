'use server';

import { Product, ProductResponse } from '@/models/product';
import { ProductType } from '@/models/productType';
import { sql } from '@/lib/db';
import { Image } from '@/models/image';
import { ProductTag } from '@/models/productTag';

export async function publicFetchProducts(searchParams?: {
  readonly query?: string;
  readonly page?: string;
  readonly selectedColors?: string;
}) {
  try {
    const query = searchParams?.query || '';
    const offset = searchParams?.page
      ? (Number(searchParams.page) - 1) * 10
      : 0;
    const selectedColors =
      searchParams?.selectedColors?.split(',').filter(Boolean) ?? [];
    const hasColorFilter = selectedColors.length > 0;

    // Single optimized query with window function for total count
    const results = hasColorFilter
      ? await sql<(ProductResponse & { total_count: string })[]>`
          SELECT DISTINCT ON (p.id)
            p.id, p.name, p.description, p.price, p.sale,
            pt.name as type, p.stock,
            json_build_object(
              'id', product_image.id,
              'name', product_image.name,
              'type', product_image.type,
              'is_main', product_image.is_main
            ) as product_image,
            COUNT(*) OVER() as total_count
          FROM products p
          LEFT JOIN product_types pt ON p.type = pt.id
          LEFT JOIN images product_image ON p.id = product_image.product_id AND product_image.is_main = TRUE
          INNER JOIN product_colors pc ON p.id = pc.product_id
          WHERE (p.name ILIKE '%' || ${query} || '%' OR pt.name ILIKE '%' || ${query} || '%')
            AND pc.color_hex = ANY(${selectedColors})
          ORDER BY p.id, p.name DESC
          LIMIT 10 OFFSET ${offset}
        `
      : await sql<(ProductResponse & { total_count: string })[]>`
          SELECT 
            p.id, p.name, p.description, p.price, p.sale,
            pt.name as type, p.stock,
            json_build_object(
              'id', product_image.id,
              'name', product_image.name,
              'type', product_image.type,
              'is_main', product_image.is_main
            ) as product_image,
            COUNT(*) OVER() as total_count
          FROM products p
          LEFT JOIN product_types pt ON p.type = pt.id
          LEFT JOIN images product_image ON p.id = product_image.product_id AND product_image.is_main = TRUE
          WHERE p.name ILIKE '%' || ${query} || '%' OR LOWER(unaccent(pt.name)) ILIKE '%' || LOWER(unaccent(${query})) || '%'
          ORDER BY p.name DESC
          LIMIT 10 OFFSET ${offset}
        `;

    const totalCount = results.length > 0 ? Number(results[0].total_count) : 0;

    // Strip total_count from response
    const products = results.map(({ total_count, ...product }) => product);

    return { products, totalCount };
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch products.');
  }
}

export async function publicFetchOtherProducts(): Promise<ProductResponse[]> {
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
    LIMIT 10 
    OFFSET 0
  `;
  return products;
}

export async function publicFetchProductByIds(ids: string[]) {
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
    WHERE p.id = ANY(${ids})
  `;
  return products;
}

export async function publicFetchProductById(id: string) {
  try {
    const product = await sql<Product[]>`
      SELECT * FROM products WHERE id = ${id}
    `;

    const images = await sql<Image[]>`
      SELECT id, name, type, is_main as "isMain", product_id as "productId"
      FROM images 
      WHERE product_id = ${id}
    `;

    const productType = await sql<ProductType[]>`
      SELECT * FROM product_types WHERE id = ${product[0].type}
    `;

    const tags = await sql<ProductTag[]>`
      SELECT 
        product_tags.id,
        product_tags.name,
        product_tags.color
      FROM product_tag_mappings 
      LEFT JOIN product_tags ON product_tag_mappings.tag_id = product_tags.id
      WHERE product_tag_mappings.product_id = ${id}
    `;

    return {
      product: {
        ...product?.[0]
      },
      tags: tags ?? [],
      images: images || [],
      productType: productType?.[0] ?? null
    };
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch product.');
  }
}

async function getProductsByTag(tagId: string) {
  const tagData = await sql<{ id: string }[]>`
  SELECT id FROM product_tags WHERE id = ${tagId}
`;
  if (!tagData[0]) {
    return [];
  } else {
    const id = tagData[0].id;
    // get product ids from product_tag_mappings where tag_id = id
    const productIds = await sql<{ product_id: string }[]>`
      SELECT product_id FROM product_tag_mappings WHERE tag_id = ${id}
    `;
    if (!productIds[0]) {
      return [];
    } else {
      // get products from product_ids
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
    WHERE p.id = ANY(${productIds.map((product) => product.product_id)})
      `;
      return products;
    }
  }
}

async function getTop20Products() {
  const products = await sql<ProductResponse[]>`
    SELECT * FROM products ORDER BY sale DESC LIMIT 20
  `;
  return products;
}

export async function publicFetchProductCategories() {
  const categories: Record<string, ProductResponse[]> = {
    bestSeller: [],
    new: [],
    featured: [],
    all: []
  };

  categories.bestSeller = await getProductsByTag(
    'e49a2f98-d2f8-416b-a4a5-570e5fee6f8b'
  );
  categories.new = await getProductsByTag(
    '28cd1bfb-948c-478e-9abf-96341b8827a5'
  );
  categories.featured = await getProductsByTag(
    'a275e4d9-5719-410a-b15a-2097b7f2e9cd'
  );
  categories.all = await publicFetchOtherProducts();

  return categories;
}
