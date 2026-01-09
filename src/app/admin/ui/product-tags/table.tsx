'use client';

import { ProductTag } from '@/models/productTag';
import {
  DeleteProductTag,
  UpdateProductTag
} from '@/app/admin/ui/product-tags/buttons';
import SimpleTable, { Column } from '@/components/simple-table/SimpleTable';

interface ProductTagsTableProps {
  readonly productTags: ProductTag[];
  readonly loading: boolean;
  readonly onSelectProductTag: (tag: ProductTag) => void;
}

export default function ProductTagsTable({
  productTags,
  loading = false,
  onSelectProductTag
}: ProductTagsTableProps) {
  // Define columns configuration
  const columns: Column<ProductTag>[] = [
    {
      header: 'Name',
      accessor: 'name',
      render: (tag) => (
        <div className="flex items-center gap-3">
          <p className="font-medium">{tag.name}</p>
        </div>
      )
    },
    {
      header: 'Short Name',
      accessor: 'short_name'
    },
    {
      header: 'Color',
      render: (tag) => (
        <div className="flex items-center gap-2 ">
          <span
            className="p-2 rounded-md"
            style={{ backgroundColor: tag.color }}
          >
            {tag.color || '-'}
          </span>
        </div>
      )
    },
    {
      header: 'Description',
      render: (tag) => (
        <div className="truncate">{tag.description || 'No description'}</div>
      ),
      className: 'whitespace-nowrap px-4 py-5 text-sm max-w-xs'
    }
  ];

  return (
    <SimpleTable
      data={productTags}
      columns={columns}
      keyExtractor={(tag) => tag.id}
      actions={(tag) => (
        <div className="flex items-center gap-2">
          <UpdateProductTag
            onSelectProductTag={() => onSelectProductTag(tag)}
          />
          <DeleteProductTag
            onSelectProductTag={() => onSelectProductTag(tag)}
          />
        </div>
      )}
      loading={loading}
      emptyMessage="No product tags found"
    />
  );
}
