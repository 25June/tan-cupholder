import { View } from '@/constants/common';
import Image from 'next/image';

export function MenuBar() {
  const scrollToView = (id: string) => {
    const element = document.getElementById(id);
    console.log(element);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <div className="max-w-screen w-full mx-auto absolute top-5 z-50">
      <div
        className={`max-w-5xl bg-white mx-auto flex justify-evenly p-4 rounded-3xl
 transition-shadow duration-300 shadow-2xl `}
      >
        <button onClick={() => scrollToView(View.HERO)}>
          <p className="font-black tracking-wide hover:text-logo-orange transition-colors duration-300 cursor-pointer">
            Home
          </p>
        </button>
        <button onClick={() => scrollToView(View.CATEGORY)}>
          <p className="font-black tracking-wide hover:text-logo-orange transition-colors duration-300 cursor-pointer">
            Categories
          </p>
        </button>
        <div className="relative">
          <div className={`${'w-1 h-1'} transition-width`}></div>
          <div className="absolute w-12 h-12 top-1/2 left-1/2">
            <Image
              src="/logo.png"
              alt="TAN cupholder logo"
              width={48}
              height={48}
              className={`rounded-full absolute -translate-x-1/2 -translate-y-1/2 w-12 h-12 transition-opacity`}
              priority
            />
          </div>
        </div>

        <button onClick={() => scrollToView(View.PRODUCT)}>
          <p className="font-black tracking-wide hover:text-logo-orange transition-colors duration-300 cursor-pointer">
            Collections
          </p>
        </button>
        <button onClick={() => scrollToView(View.FAQ)}>
          <p className="font-black tracking-wide hover:text-logo-orange transition-colors duration-300 cursor-pointer">
            Faq
          </p>
        </button>
      </div>
    </div>
  );
}
