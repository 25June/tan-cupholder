'use client';

import { MenuBar } from '@/components/menu-bar/MenuBar';
import { HeroSection } from '@/components/hero-section/HeroSection';
import { CategorySection } from '@/components/category-section/CategorySection';
import { Faq } from '@/components/faq/Faq';
import { View } from '@/constants/common';
import ProductSlider from '@/components/product-slider/ProductSlider';
import Preload from '../preload/Preload';
import { useModesContext } from '@/contexts/EditMode.context';

export default function Homepage() {
  const { isLoading } = useModesContext();

  return (
    <div className="relative min-h-screen">
      <Preload isLoading={isLoading} />
      <div className="w-screen z-50 fixed top-0 left-0">
        <div className="w-0 h-[4px] md:h-[8px] bg-logo-orange-border progress"></div>
      </div>
      <MenuBar />

      <main className="flex flex-col text-logo-text">
        <section id={View.HERO}>
          <HeroSection />
        </section>
        <section className="bg-logo-orange-border" id={View.CATEGORY}>
          <CategorySection />
        </section>
        <section id={View.PRODUCT}>
          <ProductSlider />
        </section>
        <section id={View.FAQ}>
          <Faq />
        </section>
      </main>
    </div>
  );
}
