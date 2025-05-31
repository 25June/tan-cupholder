import Image from 'next/image';
import { useRouter } from 'next/navigation';
import DropdownMenu from '@/components/menu-bar/DropdownMenu';
import { View } from '@/constants/common';

const StaticMenuBar = () => {
  const router = useRouter();
  const onNavigate = (view: string) => {
    if (view === View.HERO) {
      router.push('/');
    } else if (view === View.CATEGORY) {
      router.push('/categories');
    } else if (view === View.PRODUCT) {
      router.push('/collections');
    } else if (view === View.FAQ) {
      router.push('/faq');
    }
  };
  return (
    <div className="max-w-screen w-full mx-auto relative border-b-1 border-gray-200">
      <div className="max-w-8xl bg-white mx-auto flex justify-between md:justify-evenly p-2 md:p-4">
        <div className="relative grow md:grow-0 flex gap-2 justify-start">
          <div className="relative md:absolute w-8 md:w-12 h-8 md:h-12 -top-0 md:-top-[12px] -left-0 md:-left-[24px]">
            <Image
              onClick={() => onNavigate(View.HERO)}
              src="/logo.png"
              alt="TAN cupholder logo"
              width={48}
              height={48}
              className={`rounded-full absolute w-8 md:w-12 h-8 md:h-12 transition-opacity cursor-pointer`}
              priority
            />
          </div>
          <button
            onClick={() => onNavigate(View.HERO)}
            className="blocl md:hidden"
          >
            <p className="font-black font-extrabold tracking-wide hover:text-logo-orange transition-colors duration-300 cursor-pointer">
              Think About Nature
            </p>
          </button>
        </div>
        <button
          onClick={() => onNavigate(View.HERO)}
          className="hidden md:block"
        >
          <p className="font-black tracking-wide hover:text-logo-orange transition-colors duration-300 cursor-pointer">
            Home
          </p>
        </button>
        <button
          onClick={() => onNavigate(View.CATEGORY)}
          className="hidden md:block"
        >
          <p className="font-black tracking-wide hover:text-logo-orange transition-colors duration-300 cursor-pointer">
            Categories
          </p>
        </button>
        <button
          onClick={() => onNavigate(View.PRODUCT)}
          className="hidden md:block"
        >
          <p className="font-black tracking-wide hover:text-logo-orange transition-colors duration-300 cursor-pointer">
            Collections
          </p>
        </button>
        <button
          onClick={() => onNavigate(View.FAQ)}
          className="hidden md:block"
        >
          <p className="font-black tracking-wide hover:text-logo-orange transition-colors duration-300 cursor-pointer">
            Faq
          </p>
        </button>{' '}
        <DropdownMenu navigateToView={onNavigate} />
      </div>
    </div>
  );
};

export default StaticMenuBar;
