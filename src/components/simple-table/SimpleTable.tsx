'use client';

import { Column, SimpleTableProps } from './SimpleTable.types';
import SkeletonRows from './Skeleton';

export type { Column, SimpleTableProps };

// Table row component to properly handle hooks
const TableRow = <T,>({
  item,
  itemIndex,
  columns,
  renderCell,
  actions,
  keyExtractor
}: {
  item: T;
  itemIndex: number;
  columns: Column<T>[];
  renderCell: (item: T, column: Column<T>) => React.ReactNode;
  actions?: (item: T, index?: number) => React.ReactNode;
  keyExtractor: (item: T) => string;
}) => {
  return (
    <tr key={keyExtractor(item)} className="group bg-white">
      {columns.map((column, index) => (
        <td
          key={index}
          className={column.className || `whitespace-nowrap px-3 py-3 text-sm`}
        >
          {renderCell(item, column)}
        </td>
      ))}
      {actions && (
        <td className="whitespace-nowrap px-3 py-3">
          {actions(item, itemIndex)}
        </td>
      )}
    </tr>
  );
};

const SimpleTable = <T,>({
  data,
  columns,
  keyExtractor,
  actions,
  emptyMessage = 'No data available',
  className = '',
  loading = false,
  skeletonRows = 5
}: SimpleTableProps<T>) => {
  // Render cell content based on column configuration
  const renderCell = (item: T, column: Column<T>) => {
    if (column.render) {
      return column.render(item);
    }
    if (column.accessor) {
      return String(item[column.accessor] ?? '-');
    }
    return '-';
  };

  // Show empty message only if not loading and no data
  if (!loading && (!data || data.length === 0)) {
    return (
      <div className={`w-full ${className}`}>
        <div className="mt-6 flow-root">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden rounded-md bg-gray-50 p-8 text-center">
                <p className="text-gray-500">{emptyMessage}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md bg-gray-50 p-2">
              <table className="min-w-full rounded-md text-gray-900">
                <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                  <tr>
                    {columns.map((column, index) => (
                      <th
                        key={index}
                        scope="col"
                        className={
                          column.headerClassName || `px-3 py-2 font-medium`
                        }
                      >
                        {column.header}
                      </th>
                    ))}
                    {actions && (
                      <th scope="col" className="relative py-3 pl-6 pr-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    )}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 text-gray-900">
                  {loading ? (
                    <SkeletonRows
                      rows={skeletonRows}
                      columns={columns.length}
                      hasActions={!!actions}
                    />
                  ) : (
                    data.map((item, itemIndex) => (
                      <TableRow
                        key={keyExtractor(item)}
                        item={item}
                        itemIndex={itemIndex}
                        columns={columns}
                        renderCell={renderCell}
                        actions={actions}
                        keyExtractor={keyExtractor}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleTable;
