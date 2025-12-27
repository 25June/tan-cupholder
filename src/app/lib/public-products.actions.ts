'use server';

import { Product, ProductResponse } from '@/models/product';
import { ProductType } from '@/models/productType';
import { sql } from '@/lib/db';
import { Image } from '@/models/image';
import { ProductTag } from '@/models/productTag';

export async function fetchProductsByType(type: string) {
  try {
    const productType = await sql<ProductType[]>`
      SELECT * FROM product_types WHERE LOWER(unaccent(name)) LIKE LOWER(unaccent(${`%${type.toLowerCase()}%`}))
    `;

    return productType;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch products by type.');
  }
}

export async function publicFetchProducts(searchParams?: {
  readonly query?: string;
  readonly page?: string;
}) {
  try {
    const productTypes = await fetchProductsByType(searchParams?.query || '');
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
      WHERE p.name ILIKE '%' || ${
        searchParams?.query || ''
      } || '%'  OR p.type = ANY(${productTypes.map(
      (productType) => productType.id
    )})
      ORDER BY p.name ASC
      LIMIT 10 
      OFFSET ${searchParams?.page ? (Number(searchParams.page) - 1) * 10 : 0}
    `;

    console.log('[fetchProducts] products found:', products.length);

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
