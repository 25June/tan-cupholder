'use client';

import {
  HomeIcon,
  PuzzlePieceIcon,
  ShoppingBagIcon,
  UsersIcon,
  PhotoIcon,
  UserGroupIcon,
  EnvelopeIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Home', href: '/admin/dashboard', icon: HomeIcon },
  {
    name: 'Orders',
    href: '/admin/dashboard/orders',
    icon: ClipboardDocumentListIcon
  },
  {
    name: 'Product Types',
    href: '/admin/dashboard/product-types',
    icon: PuzzlePieceIcon
  },
  {
    name: 'Product Tags',
    href: '/admin/dashboard/product-tags',
    icon: PuzzlePieceIcon
  },
  {
    name: 'Products',
    href: '/admin/dashboard/products',
    icon: ShoppingBagIcon
  },
  {
    name: 'Customers',
    href: '/admin/dashboard/customers',
    icon: UsersIcon
  },
  {
    name: 'Users',
    href: '/admin/dashboard/users',
    icon: UserGroupIcon
  },
  {
    name: 'Feature Images',
    href: '/admin/dashboard/feature-images',
    icon: PhotoIcon
  },
  {
    name: 'Email Templates',
    href: '/admin/dashboard/email-templates',
    icon: EnvelopeIcon
  }
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            prefetch={true}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-logo-orange-border md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-logo-orange-border': pathname === link.href
              }
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
