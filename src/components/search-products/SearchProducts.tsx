'use client';

import { debounce } from '@/shared/utils/debounce';

interface Props {
  readonly onSearch: (search: string) => void;
}
export default function SearchProducts({ onSearch }: Props) {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value || '');
  };
  return (
    <label className="input input-md input-primary w-full">
      <svg
        className="h-[1em] opacity-50"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <g
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth="2.5"
          fill="none"
          stroke="currentColor"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.3-4.3"></path>
        </g>
      </svg>
      <input
        type="search"
        className="grow"
        placeholder="Search"
        onChange={debounce(handleSearch, 500)}
      />
    </label>
  );
}
