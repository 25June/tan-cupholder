import { clsx } from 'clsx';
import Link from 'next/link';
import { lusitana } from '@/app/admin/ui/fonts';

interface Breadcrumb {
  label: string;
  href: string;
  active?: boolean;
}

export default function Breadcrumbs({
  breadcrumbs
}: {
  breadcrumbs: Breadcrumb[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 block">
      <ol
        className={`${clsx(
          lusitana.className,
          'flex text-lg md:text-2xl'
        )} w-full`}
      >
        {breadcrumbs.map((breadcrumb, index) => (
          <li
            key={breadcrumb.href}
            aria-current={breadcrumb.active}
            className={`${clsx(
              breadcrumb.active ? 'text-gray-900' : 'text-gray-500'
            )} ${index === breadcrumbs.length - 1 ? 'truncate' : ''} `}
          >
            <Link
              className="w-full truncate"
              href={breadcrumb.href}
              prefetch={true}
            >
              {breadcrumb.label}
              {index < breadcrumbs.length - 1 ? (
                <span className="mx-3 inline-block">/</span>
              ) : null}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
