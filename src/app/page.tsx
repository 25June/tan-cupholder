'use client';

import { motion, useScroll } from 'motion/react';
import { MenuBar } from '@/components/menu-bar/MenuBar';
import { HeroSection } from '@/components/hero-section/HeroSection';
import { CategorySection } from '@/components/category-section/CategorySection';
import { useEffect, useRef, useState } from 'react';
import { Faq } from '@/components/faq/Faq';
import { Footer } from '@/components/footer/Footer';
import { View, ScreenLayout } from '@/constants/common';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useQueryMedia } from '@/hooks/useQueryLayout';

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
