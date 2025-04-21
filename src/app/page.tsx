'use client';

import { motion, useScroll } from 'motion/react';
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
  const { scrollYProgress } = useScroll({ container: divRef });

  return (
    <div>
      <MenuBar />
      <motion.div
        id="scroll-indicator"
        style={{
          scaleX: scrollYProgress,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 5,
          originX: 0,
          zIndex: 100,
          borderBottomRightRadius: '5px',
          borderTopRightRadius: '5px',
          backgroundColor: '#f57722',
        }}
      />
      <div
        ref={divRef}
        className="h-screen flex flex-col overflow-y-scroll text-logo-text snap-y snap-proximity scroll-smooth"
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
