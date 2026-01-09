'use client';

import { useMemo, memo } from 'react';
import Image from 'next/image';
import { ProductResponse } from '@/models/product';
import { DeleteProduct, UpdateImage, UpdateProduct } from './buttons';
import { getImageUrl } from '@/shared/utils/getImageUrl';
import { formatImagePath } from '@/shared/utils/formatImagePath.utils';
import {
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
  BoltIcon
} from '@heroicons/react/24/outline';
import { formatPriceWithoutSymbol } from '@/shared/utils/formatPrice';
import { ProductTag } from '@/models/productTag';
import SimpleTable, { Column } from '@/components/simple-table/SimpleTable';
import SimpleDropdown from '@/components/simple-dropdown/simple-downdown';

const ActionDropdown = memo(
  ({ onSelectProduct }: { onSelectProduct: () => void }) => {
    return (
      <div className="flex justify-end items-center">
        <SimpleDropdown
          host={
            <button type="button" className="btn btn-sm btn-ghost btn-circle">
              <EllipsisVerticalIcon className="w-5" />
            </button>
          }
          content={
            <>
              <li>
                <UpdateImage onSelectProduct={onSelectProduct} />
              </li>
              <li>
                <UpdateProduct onSelectProduct={onSelectProduct} />
              </li>
              <li>
                <DeleteProduct onSelectProduct={onSelectProduct} />
              </li>
            </>
          }
        />
      </div>
    );
  }
);

interface ProductsTableProps {
  readonly products: ProductResponse[];
  readonly productTypes: Record<string, string>;
  readonly productTags: ProductTag[];
  readonly loading: boolean;
  readonly onSelectProduct: (product: ProductResponse) => void;
}

export default function ProductsTable({
  products,
  productTypes,
  productTags,
  loading = false,
  onSelectProduct
}: ProductsTableProps) {
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
                ? formatImagePath(
                    getImageUrl(product.id, product.product_image.name)
                  )
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
      header: 'Colors',
      render: (product) => {
        const colors = product.colors ? JSON.parse(product.colors) : [];
        const primaryColors = product.primaryColor
          ? JSON.parse(product.primaryColor)
          : [];
        return (
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-2">
              <MagnifyingGlassIcon className="w-4 h-4 text-gray-500" />
              {primaryColors.map((hex: string) => (
                <div
                  key={hex}
                  className="w-4 h-4 rounded-full border border-gray-200"
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <BoltIcon className="w-4 h-4 text-gray-500" />
              {colors.map((hex: string) => (
                <div
                  key={hex}
                  className="w-4 h-4 rounded-full border border-gray-200"
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>
          </div>
        );
      },
      className:
        'whitespace-nowrap px-3 py-3 text-sm text-ellipsis overflow-hidden max-w-16'
    }
  ];

  return (
    <SimpleTable
      data={products}
      columns={columns}
      keyExtractor={(product) => product.id}
      actions={(product) => (
        <ActionDropdown onSelectProduct={() => onSelectProduct(product)} />
      )}
      emptyMessage="No products found"
      loading={loading}
    />
  );
}
