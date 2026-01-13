'use client';

import { v4 as uuidv4 } from 'uuid';

interface Props {
  host: React.ReactNode;
  content: React.ReactNode;
}

const SimpleDropdown = ({ host, content }: Props) => {
  const randomId = uuidv4();
  const popoverId = `simple-dropdown-${randomId}`;
  const anchorName = `--anchor-simple-dropdown-${randomId}`;
  return (
    <>
      <button
        type="button"
        popoverTarget={popoverId}
        className="rounded-md border border-gray-500 hover:border-gray-700 transition-all duration-100 p-2 hover:bg-gray-100"
        style={{ anchorName } as React.CSSProperties}
      >
        {host}
      </button>
      <div className="dropdown dropdown-end">
        <ul
          id={popoverId}
          popover="auto"
          className="dropdown menu bg-white border border-gray-200 rounded-lg max-w-48 shadow-xl py-1 m-0"
          style={{ positionAnchor: anchorName } as React.CSSProperties}
        >
          {content}
        </ul>
      </div>
    </>
  );
};

export default SimpleDropdown;
