'use client';

import { ProductType } from '@/models/productType';
import {
  DeleteProductType,
  UpdateProductType
} from '@/app/admin/ui/product-types/buttons';
import SimpleTable, { Column } from '@/components/simple-table/SimpleTable';
import { formatImagePath } from '@/shared/utils/formatImagePath.utils';
import { getImageUrl } from '@/shared/utils/getImageUrl';
import Image from 'next/image';

export default function ProductTypesTable({
  productTypes,
  loading = false,
  onSelectProductType
}: {
  productTypes: ProductType[];
  loading: boolean;
  onSelectProductType: (id: string) => void;
}) {
  const columns: Column<ProductType>[] = [
    {
      header: 'Name',
      render: (productType) => {
        return (
          <div className="flex items-center gap-4">
            <img
              src={
                productType.image_url
                  ? formatImagePath(
                      getImageUrl('product-types', productType.image_url)
                    )
                  : '/cup.png'
              }
              alt={`${productType.name}-${productType.image_url}`}
              className="rounded-lg w-16 h-16 object-cover shrink-0"
            />
            <p className="font-medium">{productType.name}</p>
          </div>
        );
      }
    },
    {
      header: 'Short Name',
      accessor: 'short_name'
    },
    {
      header: 'Description',
      render: (productType) => (
        <div className="truncate max-w-xs">
          {productType.description || 'No description'}
        </div>
      )
    }
  ];

  return (
    <SimpleTable
      data={productTypes}
      columns={columns}
      keyExtractor={(productType) => productType.id}
      actions={(productType) => (
        <div className="flex items-center gap-2">
          <UpdateProductType
            id={productType.id}
            onSelectProductType={onSelectProductType}
          />
          <DeleteProductType
            id={productType.id}
            onSelectProductType={onSelectProductType}
          />
        </div>
      )}
      emptyMessage="No product types found"
      loading={loading}
    />
  );
}
