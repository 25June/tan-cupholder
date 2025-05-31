import Menu from '../icons/Menu';
import { useTranslations } from 'next-intl';
import { View } from '@/constants/common';

interface DropdownMenuProps {
  readonly navigateToView: (id: string) => void;
}

export default function DropdownMenu({ navigateToView }: DropdownMenuProps) {
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
          className="dropdown menu bg-white rounded-box w-56"
          popover="auto"
          id="popover-1"
        >
          <li>
            <button onClick={() => navigateToView(View.HERO)}>
              <p className={menuItemClass}>{t('home')}</p>
            </button>
          </li>
          <li>
            <button onClick={() => navigateToView(View.CATEGORY)}>
              <p className={menuItemClass}>{t('categories')}</p>
            </button>
          </li>
          <li>
            <button onClick={() => navigateToView(View.PRODUCT)}>
              <p className={menuItemClass}>{t('collections')}</p>
            </button>
          </li>
          <li>
            <button onClick={() => navigateToView(View.FAQ)}>
              <p className={menuItemClass}>{t('faq')}</p>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
