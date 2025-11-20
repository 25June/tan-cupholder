interface SkeletonRowsProps {
  rows: number;
  columns: number;
  hasActions?: boolean;
}

const SkeletonRows = ({ rows, columns, hasActions }: SkeletonRowsProps) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={`skeleton-${rowIndex}`} className="group bg-white">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <td key={colIndex} className="whitespace-nowrap px-3 py-3 text-sm">
              <div className="skeleton h-4 w-full"></div>
            </td>
          ))}
          {hasActions && (
            <td className="whitespace-nowrap py-3 pl-6 pr-3">
              <div className="flex justify-end gap-3">
                <div className="skeleton h-8 w-16"></div>
                <div className="skeleton h-8 w-16"></div>
              </div>
            </td>
          )}
        </tr>
      ))}
    </>
  );
};

export default SkeletonRows;
