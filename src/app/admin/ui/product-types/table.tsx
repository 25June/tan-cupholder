'use client';

import { ProductType } from '@/models/productType';
import {
  DeleteProductType,
  UpdateProductType
} from '@/app/admin/ui/product-types/buttons';
import SimpleTable, { Column } from '@/components/simple-table/SimpleTable';

export default function ProductTypesTable({
  productTypes,
  loading = false
}: {
  productTypes: ProductType[];
  loading: boolean;
}) {
  const columns: Column<ProductType>[] = [
    {
      header: 'Name',
      render: (productType) => (
        <div className="flex items-center gap-3">
          <p className="font-medium">{productType.name}</p>
        </div>
      )
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
        <>
          <UpdateProductType id={productType.id} />
          <DeleteProductType id={productType.id} />
        </>
      )}
      emptyMessage="No product types found"
      loading={loading}
    />
  );
}
