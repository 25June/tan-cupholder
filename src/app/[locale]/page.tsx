'use client';

import { useScroll } from 'motion/react';
import { MenuBar } from '@/components/menu-bar/MenuBar';
import { HeroSection } from '@/components/hero-section/HeroSection';
import { CategorySection } from '@/components/category-section/CategorySection';
import { useEffect, useRef, useState, useTransition } from 'react';
import { Faq } from '@/components/faq/Faq';
import { Footer } from '@/components/footer/Footer';
import { View, ScreenLayout } from '@/constants/common';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useQueryMedia } from '@/hooks/useQueryLayout';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

const NoSSRProductSlider = dynamic(
  () => import('@/components/product-slider/ProductSlider').then((mod) => mod),
  { ssr: false }
);

export default function Home() {
  const [removeLoading, setRemoveLoading] = useState<boolean>(false);
  const currentLayout = useQueryMedia();
  const [loadingMedia, setLoadingMedia] = useState<boolean>(true);
  const divRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: divRef });

  const router = useRouter();
  const currentLocale = useLocale();
  const pathname = usePathname();

  const [isPending, startTransition] = useTransition();
  const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;
    startTransition(() => {
      // Replace the current locale in the URL with the new locale
      // Example: If current path is /en/products/123, and new locale is 'vi'
      //          pathname.substring(3) gives 'products/123'
      //          Resulting path: /vi/products/123
      router.replace(`/${nextLocale}${pathname.substring(3)}`);
    });
  };

  useEffect(() => {
    if (currentLayout === ScreenLayout.Mobile) {
      setLoadingMedia(false);
    }
  }, [currentLayout]);

  useEffect(() => {
    if (!loadingMedia) {
      const timer = setTimeout(() => {
        setRemoveLoading(true);
      }, 3000); // Simulate loading time

      return () => clearTimeout(timer);
    }
  }, [loadingMedia]);

  return (
    <div>
      {!removeLoading && (
        <div
          className={`fixed w-screen h-screen flex items-center justify-center bg-white transition-all duration-300 ease-in-out ${
            loadingMedia ? 'z-1000 opacity-100' : 'opacity-0 z-0'
          }`}
        >
          <Image
            src="/logo.png"
            alt="TAN cupholder logo"
            width={200}
            height={200}
            className={`rounded-full animate-fade-in-out`}
          />
        </div>
      )}
      <MenuBar scrollYProgress={scrollYProgress} />
      <div className="flex items-center space-x-2 mt-20">
        <select
          id="locale-select"
          defaultValue={currentLocale}
          onChange={onSelectChange}
          disabled={isPending} // Disable dropdown while navigating
          className="
          p-2 border border-gray-300 rounded-md shadow-sm
          bg-white text-gray-900
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          disabled:opacity-70 disabled:cursor-not-allowed
        "
        >
          <option value="en">English</option>
          <option value="vi">Tiếng Việt</option>
        </select>
        {isPending && (
          <span className="text-sm text-gray-500">
            {/* Optional: Add a simple loading indicator */}
            Switching...
          </span>
        )}
      </div>
      <div
        ref={divRef}
        className="h-screen flex flex-col overflow-y-scroll text-logo-text snap-y snap-proximity scroll-smooth"
      >
        <div className="snap-center" id={View.HERO}>
          <HeroSection setReady={setLoadingMedia} />
        </div>
        <div className="snap-center bg-logo-orange-border" id={View.CATEGORY}>
          <CategorySection />
        </div>
        <div className="snap-center" id={View.PRODUCT}>
          <NoSSRProductSlider />
        </div>
        <div id={View.FAQ}>
          <Faq />
        </div>
        <div>
          <Footer />
        </div>
      </div>
    </div>
  );
}
