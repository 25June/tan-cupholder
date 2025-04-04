'use client';

import { MenuBar } from '@/components/menu-bar/MenuBar';
import { HeroSection } from '@/components/hero-section/HeroSection';
import { CategorySection } from '@/components/category-section/CategorySection';
import { ProductSlider } from '@/components/product-slider/ProductSlider';
import { useRef } from 'react';
import { Faq } from '@/components/faq/Faq';
import { Footer } from '@/components/footer/Footer';
import { View } from '@/constants/common';

export default function Home() {
  const divRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <MenuBar />
      <div
        ref={divRef}
        className="h-screen flex flex-col overflow-y-auto text-logo-text snap-y snap-proximity scroll-smooth"
      >
        <div className="snap-center" id={View.HERO}>
          <HeroSection />
        </div>
        <div className="snap-center bg-logo-orange-border" id={View.CATEGORY}>
          <CategorySection />
        </div>
        <div className="snap-center" id={View.PRODUCT}>
          <ProductSlider />
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
