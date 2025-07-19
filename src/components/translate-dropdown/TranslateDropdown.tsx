import { useTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import Spinner from '../spinner/Spinner';

export default function TranslateDropdown({ id }: { id: string }) {
  const router = useRouter();

  const pathname = usePathname();

  const [isPending, startTransition] = useTransition();
  const onSelectChange = (value: string) => {
    startTransition(() => {
      router.replace(`/${value}${pathname.substring(3)}`);
    });
  };
  return (
    <div>
      <button
        className="btn btn-sm btn-circle bg-transparent border-0"
        popoverTarget={id}
        style={{ anchorName: '--anchor-2' } as React.CSSProperties}
      >
        {isPending ? <Spinner /> : <GlobeAltIcon />}
      </button>
      <div className="dropdown dropdown-end">
        <ul popover="auto" id={id} className="dropdown menu bg-white w-24 z-1">
          <li>
            <button onClick={() => onSelectChange('vi')}>
              <Image
                src="/vi.png"
                alt="Vietnamese Flag"
                width={24}
                height={16}
              />
              Vi
            </button>
          </li>
          <li>
            <button onClick={() => onSelectChange('en')}>
              <Image
                src="/en.png"
                alt="united-kingdom Flag"
                width={24}
                height={16}
              />
              En
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
