'use client';

import { MenuBar } from '@/components/menu-bar/MenuBar';
import { HeroSection } from '@/components/hero-section/HeroSection';
import { CategorySection } from '@/components/category-section/CategorySection';
import { ProductSlider } from '@/components/product-slider/ProductSlider';
import { useState, useEffect } from 'react';
import { throttle } from '@/shared/utils/throttle';
import { Faq } from '@/components/faq/Faq';
import { Footer } from '@/components/footer/Footer';

export default function Home() {
  const [isScrollToTop, setIsScrollToTop] = useState<boolean>(false);
  useEffect(() => {
    const handleScroll = () => {
      console.log(window.scrollY);
      if (window.scrollY > 100) {
        setIsScrollToTop(() => false);
      } else {
        setIsScrollToTop(() => true);
      }
    };
    window.addEventListener('scroll', throttle(handleScroll, 200));
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
    <div>
      <MenuBar isScrollToTop={isScrollToTop} />
      <div className="h-screen flex flex-col overflow-y-auto text-logo-text snap-y snap-proximity scroll-smooth">
        <div className="snap-center">
          <HeroSection />
        </div>
        <div className="snap-center bg-logo-orange-border">
          <CategorySection />
        </div>
        <div className="snap-center">
          <ProductSlider />
        </div>
        <div>
          <Faq />
        </div>
        <div>
          <Footer />
        </div>
      </div>
    </div>
  );
}
