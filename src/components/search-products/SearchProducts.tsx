'use client';

import { debounce } from '@/shared/utils/debounce';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
interface Props {
  readonly onSearch: (search: string) => void;
}
export default function SearchProducts({ onSearch }: Props) {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value || '');
  };
  return (
    <label className="input input-md input-primary w-full">
      <MagnifyingGlassIcon className="w-4 h-4" />
      <input
        type="search"
        className="grow"
        placeholder="Search"
        onChange={debounce(handleSearch, 500)}
      />
    </label>
  );
}
