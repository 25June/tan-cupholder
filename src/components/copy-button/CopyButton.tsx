'use client';

import {
  ClipboardDocumentIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline';

interface CopyButtonProps {
  text: string;
}

export default function CopyButton({ text }: CopyButtonProps) {
  const copyImageUrl = (
    e: React.MouseEvent<HTMLButtonElement>,
    value: string
  ) => {
    navigator.clipboard.writeText(value);
    setTimeout(() => {
      const input = document.getElementById(`copy-${value}`);
      if (input) {
        (input as HTMLInputElement).checked = false;
      }
    }, 2000);
  };
  return (
    <button onClick={(e) => copyImageUrl(e, text || '')}>
      <label className="swap swap-rotate">
        {/* this hidden checkbox controls the state */}
        <input id={`copy-${text}`} type="checkbox" />

        {/* Copy icon */}
        <ClipboardDocumentIcon className="swap-off w-6 h-6 text-logo-orange" />

        {/* Copied icon */}
        <ClipboardDocumentCheckIcon className="swap-on w-6 h-6 text-green-500" />
      </label>
    </button>
  );
}
