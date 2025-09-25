import { Bars3Icon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

interface DropdownMenuProps {}

export default function DropdownMenu({}: DropdownMenuProps) {
  const t = useTranslations('Menu');
  const menuItemClass =
    'font-black tracking-wide hover:text-logo-orange transition-colors duration-300 cursor-pointer';
  return (
    <div className="block md:hidden">
      <button
        className="btn btn-sm btn-circle bg-transparent border-0"
        popoverTarget="popover-menu"
        style={{ anchorName: '--anchor-menu' } as React.CSSProperties}
      >
        <Bars3Icon />
      </button>
      <div className="dropdown dropdown-end">
        <ul
          className="dropdown menu bg-white rounded-box w-36"
          popover="auto"
          id="popover-menu"
          style={{ positionAnchor: '--anchor-menu' } as React.CSSProperties}
        >
          <li>
            <Link href={'/'} prefetch={true}>
              <p className={menuItemClass}>{t('home')}</p>
            </Link>
          </li>
          <li>
            <Link href={'/material'} prefetch={true}>
              <p className={menuItemClass}>{t('materials')}</p>
            </Link>
          </li>
          <li>
            <Link href={'/products'} prefetch={true}>
              <p className={menuItemClass}>{t('collections')}</p>
            </Link>
          </li>
          <li>
            <Link href={'/question'} prefetch={true}>
              <p className={menuItemClass}>{t('faq')}</p>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
