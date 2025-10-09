'use client';

import { View } from '@/constants/common';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion } from 'motion/react';
import DropdownMenu from '@/components/menu-bar/DropdownMenu';
import TranslateDropdown from '../translate-dropdown/TranslateDropdown';
import { useEffect } from 'react';
import { throttle } from '@/shared/utils/debounce';

export function MenuBar() {
  const t = useTranslations('Menu');

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const element = (e.target as Document).scrollingElement;
      const clientHeight = element?.clientHeight || 0;
      const scrollTop = element?.scrollTop || 0;
      const scrollHeight = element?.scrollHeight || 0;
      if (scrollTop === 0) {
        document
          .getElementById('scroll-indicator')
          ?.style.setProperty('width', `${0}%`);
        return;
      }
      const result = Math.round(
        (scrollTop / (scrollHeight - clientHeight)) * 100
      );

      document
        .getElementById('scroll-indicator')
        ?.style.setProperty('width', `${result}%`);
    };
    window.addEventListener('scroll', throttle(handleScroll, 50));
    return () => {
      window.removeEventListener('scroll', throttle(handleScroll, 50));
    };
  }, []);

  const scrollToView = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <div className="max-w-screen w-full mx-auto fixed top-2 md:top-5 z-50">
      <div className="max-w-[95vw] md:max-w-5xl rounded-3xl mx-auto bg-white overflow-hidden transition-shadow shadow-2xl">
        <div className="relative">
          <motion.div
            id="scroll-indicator"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 5,
              originX: 0,
              zIndex: 1,
              borderBottomRightRadius: '5px',
              borderTopRightRadius: '5px',
              backgroundColor: '#f57722',
              transition: 'width 0.3s ease-in'
            }}
          />
          <div className="absolute hidden md:block right-4 top-3">
            <TranslateDropdown id={'2'} />
          </div>
        </div>

        <div
          className={` flex justify-between md:justify-evenly p-2 md:p-4 rounded-3xl
  duration-300  `}
        >
          <button
            onClick={() => scrollToView(View.HERO)}
            className="hidden md:block"
          >
            <p className="font-black tracking-wide hover:text-logo-orange transition-colors duration-300 cursor-pointer">
              {t('home')}
            </p>
          </button>
          <button
            onClick={() => scrollToView(View.CATEGORY)}
            className="hidden md:block"
          >
            <p className="font-black tracking-wide hover:text-logo-orange transition-colors duration-300 cursor-pointer">
              {t('categories')}
            </p>
          </button>
          <div className="relative grow md:grow-0 flex gap-2 justify-start">
            <div className="relative md:absolute w-8 md:w-12 h-8 md:h-12 -top-0 md:-top-[12px] -left-0 md:-left-[24px]">
              <Image
                src="/logo.png"
                alt="TAN cupholder logo"
                width={48}
                height={48}
                className={`rounded-full absolute w-8 md:w-12 h-8 md:h-12 transition-opacity cursor-pointer`}
                priority
              />
            </div>
            <button
              onClick={() => scrollToView(View.HERO)}
              className="blocl md:hidden"
            >
              <p className="font-black font-extrabold tracking-wide hover:text-logo-orange transition-colors duration-300 cursor-pointer">
                {t('appName')}
              </p>
            </button>
          </div>

          <button
            onClick={() => scrollToView(View.PRODUCT)}
            className="hidden md:block"
          >
            <p className="font-black tracking-wide hover:text-logo-orange transition-colors duration-300 cursor-pointer">
              {t('collections')}
            </p>
          </button>
          <button
            onClick={() => scrollToView(View.FAQ)}
            className="hidden md:block"
          >
            <p className="font-black tracking-wide hover:text-logo-orange transition-colors duration-300 cursor-pointer">
              {t('faq')}
            </p>
          </button>
          <div className="block md:hidden">
            <TranslateDropdown id={'3'} />
          </div>
          <DropdownMenu />
        </div>
      </div>
    </div>
  );
}
