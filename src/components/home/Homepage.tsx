'use client';

import { useScroll } from 'motion/react';
import { MenuBar } from '@/components/menu-bar/MenuBar';
import { HeroSection } from '@/components/hero-section/HeroSection';
import { CategorySection } from '@/components/category-section/CategorySection';
import { useRef } from 'react';
import { Faq } from '@/components/faq/Faq';
import Footer from '@/components/footer/Footer';
import { View } from '@/constants/common';
import ProductSlider from '@/components/product-slider/ProductSlider';
import Preload from '../preload/Preload';
import { ProductResponse } from '@/models/product';

interface Props {
  readonly products: ProductResponse[];
}

export default function Homepage({ products }: Props) {
  const divRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: divRef });

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Preload />
      <MenuBar scrollYProgress={scrollYProgress} />
      <div
        ref={divRef}
        className="h-screen flex flex-col text-logo-text snap-y snap-proximity overflow-y-scroll scroll-smooth"
      >
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
