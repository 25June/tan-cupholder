'use client';

import { useEffect } from 'react';
import { debounce } from '@/shared/utils/debounce';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useRouter, useSearchParams } from 'next/navigation';
interface Props {
  readonly onSearch: (search: string, color: string) => void;
}
export default function SearchProducts({ onSearch }: Props) {
  const { replace } = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const search = searchParams.get('search');
    if (search) {
      onSearch(search, '');
      replace(`/products`);
    }
  }, [searchParams]);
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value || '', '');
  };
  return (
    <label
      className={`input input-sm md:input-md focus:input-primary w-full max-w-64`}
    >
      <MagnifyingGlassIcon className="w-4 h-4" />
      <input
        type="search"
        className="grow"
        placeholder="Search"
        onChange={debounce(handleSearch, 1000)}
        defaultValue={searchParams.get('search') || undefined}
      />
    </label>
  );
}
