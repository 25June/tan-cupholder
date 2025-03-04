import Image from 'next/image';
import { useState, useEffect } from 'react';
import { throttle } from '@/shared/utils/throttle';

export function MenuBar() {
  const [isScrollToTop, setIsScrollToTop] = useState<boolean>(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setIsScrollToTop(false);
      } else {
        setIsScrollToTop(true);
      }
    };
    window.addEventListener('scroll', throttle(handleScroll, 200));
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
    <div className="max-w-full bg-white mx-auto sticky top-0 z-50">
      <div
        className={`max-w-5xl mx-auto flex justify-evenly p-4 rounded-b-3xl
 transition-shadow ${isScrollToTop ? 'shadow-sm' : 'shadow-xl'}`}
      >
        <div>Intro</div>
        <div>Products</div>
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

        <div>Story</div>
        <div>Contact</div>
      </div>
    </div>
  );
}
