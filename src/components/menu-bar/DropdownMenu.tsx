import Menu from '../icons/Menu';
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
        popoverTarget="popover-1"
        style={{ anchorName: '--anchor-1' } as React.CSSProperties}
      >
        <Menu />
      </button>
      <div className="dropdown dropdown-end">
        <ul
          className="dropdown menu bg-white rounded-box w-36"
          popover="auto"
          id="popover-1"
        >
          <li>
            <Link href={'/'}>
              <p className={menuItemClass}>{t('home')}</p>
            </Link>
          </li>
          <li>
            <Link href={'/material'}>
              <p className={menuItemClass}>{t('materials')}</p>
            </Link>
          </li>
          <li>
            <Link href={'/products'}>
              <p className={menuItemClass}>{t('collections')}</p>
            </Link>
          </li>
          <li>
            <Link href={'/question'}>
              <p className={menuItemClass}>{t('faq')}</p>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
