import Image from 'next/image';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import DropdownMenu from '@/components/menu-bar/DropdownMenu';

const StaticMenuBar = () => {
  const t = useTranslations('Menu');
  return (
    <div className="max-w-screen w-full mx-auto relative border-b-1 border-gray-200">
      <div className="max-w-8xl bg-white mx-auto flex justify-between md:justify-evenly p-2 md:p-4">
        <div className="relative grow md:grow-0 flex gap-2 justify-start">
          <Link
            href={'/'}
            className="relative md:absolute w-8 md:w-12 h-8 md:h-12 -top-0 md:-top-[12px] -left-0 md:-left-[24px]"
          >
            <Image
              src="/logo.png"
              alt="TAN cupholder logo"
              width={48}
              height={48}
              className={`rounded-full absolute w-8 md:w-12 h-8 md:h-12 transition-opacity cursor-pointer`}
              priority
            />
          </Link>
          <Link
            href={'/'}
            className="block md:hidden my-auto font-black font-extrabold tracking-wide hover:text-logo-orange transition-colors duration-300 cursor-pointer"
          >
            {t('appName')}
          </Link>
        </div>
        <Link
          href={'/'}
          className="hidden md:block font-black tracking-wide hover:text-logo-orange transition-colors duration-300 cursor-pointer"
        >
          {t('home')}
        </Link>
        <Link
          href={'/material'}
          className="hidden md:block font-black tracking-wide hover:text-logo-orange transition-colors duration-300 cursor-pointer"
        >
          {t('materials')}
        </Link>
        <Link
          href={'/products'}
          className="hidden md:block font-black tracking-wide hover:text-logo-orange transition-colors duration-300 cursor-pointer"
        >
          {t('collections')}
        </Link>
        <Link
          href={'/question'}
          className="hidden md:block font-black tracking-wide hover:text-logo-orange transition-colors duration-300 cursor-pointer"
        >
          {t('faq')}
        </Link>
        <DropdownMenu />
      </div>
    </div>
  );
};

export default StaticMenuBar;
