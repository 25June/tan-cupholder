'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { ProductResponse } from '@/models/product';
import { DeleteProduct, UpdateImage, UpdateProduct } from './buttons';
import { getImageUrl } from '@/shared/utils/getImageUrl';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { formatPriceWithoutSymbol } from '@/shared/utils/formatPrice';
import { ProductTag } from '@/models/productTag';
import SimpleTable, { Column } from '@/components/simple-table/SimpleTable';

export default function ProductsTable({
  products,
  productTypes,
  productTags,
  loading = false
}: {
  products: ProductResponse[];
  productTypes: Record<string, string>;
  productTags: ProductTag[];
  loading: boolean;
}) {
  // Map tag IDs to tag objects for quick lookup
  const tagObj = useMemo(() => {
    return productTags.reduce((acc: Record<string, ProductTag>, tag) => {
      return {
        ...acc,
        [tag.id]: tag
      };
    }, {});
  }, [productTags]);

  const columns: Column<ProductResponse>[] = [
    {
      header: 'Name',
      render: (product) => (
        <div className="flex items-center gap-3">
          <Image
            src={
              product.product_image.name
                ? `${getImageUrl(product.id, product.product_image.name)}`
                : '/cup.png'
            }
            className="rounded-full w-16 h-16 object-cover shrink-0"
            alt={`${product.name}'s profile picture`}
            width={128}
            height={128}
          />
          <div>
            <p>{product.name}</p>
            <div className="flex flex-wrap gap-2">
              {product.tagIds?.map((tagId) => (
                <span
                  key={tagId}
                  className="badge badge-sm"
                  style={{
                    backgroundColor: tagObj[tagId]?.color
                  }}
                >
                  {tagObj[tagId]?.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      header: 'Price',
      render: (product) => formatPriceWithoutSymbol(product.price)
    },
    {
      header: 'Type',
      render: (product) => productTypes[product.type] || 'No type found'
    },
    {
      header: 'Sale',
      accessor: 'sale'
    },
    {
      header: 'Stock',
      accessor: 'stock'
    },
    {
      header: 'Description',
      render: (product) => product.description,
      className:
        'whitespace-nowrap px-3 py-3 text-sm text-ellipsis overflow-hidden max-w-16'
    }
  ];

  return (
    <SimpleTable
      data={products}
      columns={columns}
      keyExtractor={(product) => product.id}
      actions={(product, index) => (
        <div className="flex justify-end">
          <div
            className={`dropdown dropdown-end ${
              (index ?? 0) > 5 ? 'dropdown-top' : 'dropdown-bottom'
            }`}
          >
            <div
              tabIndex={0}
              role="button"
              className="btn btn-sm btn-ghost btn-circle"
            >
              <EllipsisVerticalIcon className="w-5" />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-white border border-gray-200 rounded-lg w-48 shadow-lg z-50"
            >
              <li>
                <UpdateImage id={product.id} />
              </li>
              <li>
                <UpdateProduct
                  id={product.id}
                  product={{
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    sale: product.sale,
                    stock: product.stock,
                    type: product.type,
                    tagIds: product.tagIds
                  }}
                />
              </li>
              <li>
                <DeleteProduct id={product.id} />
              </li>
            </ul>
          </div>
        </div>
      )}
      emptyMessage="No products found"
      loading={loading}
    />
  );
}
