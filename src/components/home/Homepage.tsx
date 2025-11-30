'use client';

import { MenuBar } from '@/components/menu-bar/MenuBar';
import { HeroSection } from '@/components/hero-section/HeroSection';
import { CategorySection } from '@/components/category-section/CategorySection';
import { Faq } from '@/components/faq/Faq';
import Footer from '@/components/footer/Footer';
import { View } from '@/constants/common';
import ProductSlider from '@/components/product-slider/ProductSlider';
import Preload from '../preload/Preload';
import { ProductResponse } from '@/models/product';
import { useModesContext } from '@/contexts/EditMode.context';

export default function Homepage() {
  const { isLoading } = useModesContext();
  return (
    <div className="relative min-h-screen">
      <Preload isLoading={isLoading} />

      <MenuBar />
      <div className="flex flex-col text-logo-text">
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
        <section>
          <Footer />
        </section>
      </div>
    </div>
  );
}
