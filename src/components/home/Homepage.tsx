'use client';

import { MenuBar } from '@/components/menu-bar/MenuBar';
import { HeroSection } from '@/components/hero-section/HeroSection';
import { CategorySection } from '@/components/category-section/CategorySection';
import { useState } from 'react';
import { Faq } from '@/components/faq/Faq';
import Footer from '@/components/footer/Footer';
import { View } from '@/constants/common';
import ProductSlider from '@/components/product-slider/ProductSlider';
import Preload from '../preload/Preload';
import { ProductResponse } from '@/models/product';
import { useModesContext } from '@/contexts/EditMode.context';
interface Props {
  readonly products: ProductResponse[];
}

export default function Homepage({ products }: Props) {
  const { isLoading } = useModesContext();
  return (
    <div className="relative min-h-screen">
      <Preload isLoading={isLoading} />

      <MenuBar />
      <div className="flex flex-col text-logo-text">
        <div className="snap-center" id={View.HERO}>
          <HeroSection />
        </div>
        <div className="snap-center bg-logo-orange-border" id={View.CATEGORY}>
          <CategorySection />
        </div>
        <div className="snap-center" id={View.PRODUCT}>
          <ProductSlider products={products} />
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
