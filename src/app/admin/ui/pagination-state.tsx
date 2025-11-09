'use client';

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { generatePagination } from '@/app/admin/lib/utils';

interface PaginationStateProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function PaginationState({
  totalPages,
  currentPage,
  onPageChange
}: PaginationStateProps) {
  const allPages = generatePagination(currentPage, totalPages);

  const handlePageClick = (page: number | string) => {
    if (typeof page === 'number') {
      onPageChange(page);
    }
  };

  return (
    <div className="inline-flex">
      <PaginationArrow
        direction="left"
        onClick={() => handlePageClick(currentPage - 1)}
        isDisabled={currentPage <= 1}
      />

      <div className="flex -space-x-px">
        {allPages.map((page, index) => {
          let position: 'first' | 'last' | 'single' | 'middle' | undefined;

          if (index === 0) position = 'first';
          if (index === allPages.length - 1) position = 'last';
          if (allPages.length === 1) position = 'single';
          if (page === '...') position = 'middle';

          return (
            <PaginationNumber
              key={`${page}-${index}`}
              onClick={() => handlePageClick(page)}
              page={page}
              position={position}
              isActive={currentPage === page}
            />
          );
        })}
      </div>

      <PaginationArrow
        direction="right"
        onClick={() => handlePageClick(currentPage + 1)}
        isDisabled={currentPage >= totalPages}
      />
    </div>
  );
}

function PaginationNumber({
  page,
  onClick,
  isActive,
  position
}: {
  page: number | string;
  onClick: () => void;
  position?: 'first' | 'last' | 'middle' | 'single';
  isActive: boolean;
}) {
  const className = clsx(
    'flex h-10 w-10 items-center justify-center text-sm border',
    {
      'rounded-l-md': position === 'first' || position === 'single',
      'rounded-r-md': position === 'last' || position === 'single',
      'z-10 bg-logo-orange-border border-logo-orange-border text-white':
        isActive,
      'hover:bg-gray-100 cursor-pointer': !isActive && position !== 'middle',
      'text-gray-300 cursor-default': position === 'middle'
    }
  );

  return (
    <div
      className={className}
      onClick={position !== 'middle' ? onClick : undefined}
    >
      {page}
    </div>
  );
}

function PaginationArrow({
  onClick,
  direction,
  isDisabled
}: {
  onClick: () => void;
  direction: 'left' | 'right';
  isDisabled?: boolean;
}) {
  const className = clsx(
    'flex h-10 w-10 items-center justify-center rounded-md border',
    {
      'pointer-events-none text-gray-300': isDisabled,
      'hover:bg-gray-100 cursor-pointer': !isDisabled,
      'mr-2 md:mr-4': direction === 'left',
      'ml-2 md:ml-4': direction === 'right'
    }
  );

  const icon =
    direction === 'left' ? (
      <ArrowLeftIcon className="w-4" />
    ) : (
      <ArrowRightIcon className="w-4" />
    );

  return (
    <div className={className} onClick={!isDisabled ? onClick : undefined}>
      {icon}
    </div>
  );
}
