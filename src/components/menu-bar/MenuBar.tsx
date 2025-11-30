'use client';

import { View } from '@/constants/common';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion } from 'motion/react';
import DropdownMenu from '@/components/menu-bar/DropdownMenu';
import TranslateDropdown from '../translate-dropdown/TranslateDropdown';
import { useEffect } from 'react';

export function MenuBar() {
  const t = useTranslations('Menu');

  useEffect(() => {
    // const handleScroll = (e: Event) => {
    //   const element = (e.target as Document).scrollingElement;
    //   const clientHeight = element?.clientHeight || 0;
    //   const scrollTop = element?.scrollTop || 0;
    //   const scrollHeight = element?.scrollHeight || 0;
    //   const result = Math.round(
    //     (scrollTop / (scrollHeight - clientHeight)) * 100
    //   );
    //   const scrollElement = document.getElementById('scroll-indicator');
    //   if (scrollElement) {
    //     scrollElement.style.setProperty(
    //       'transform',
    //       `translateX(-${100 - result}%)`
    //     );
    //   }
    // };
    // window.addEventListener('scroll', handleScroll);
    onAddEvent();
    return () => {
      // window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const onAddEvent = () => {
    const sectionHero = document.getElementById(View.HERO);
    const sectionCategory = document.getElementById(View.CATEGORY);
    const sectionProduct = document.getElementById(View.PRODUCT);
    const sectionFaq = document.getElementById(View.FAQ);
    const linkMap = {
      [View.HERO]: document.getElementById(`link-${View.HERO}`),
      [View.CATEGORY]: document.getElementById(`link-${View.CATEGORY}`),
      [View.PRODUCT]: document.getElementById(`link-${View.PRODUCT}`),
      [View.FAQ]: document.getElementById(`link-${View.FAQ}`)
    };

    const sections = [sectionHero, sectionCategory, sectionProduct, sectionFaq];

    const observer = new IntersectionObserver(
      (entries) => {
        console.log(entries);
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const linkTarget = linkMap[entry.target.id as keyof typeof linkMap];
            if (linkTarget) {
              linkTarget.classList.add('viewed-active');
            }
          } else {
            const linkTarget = linkMap[entry.target.id as keyof typeof linkMap];
            if (linkTarget) {
              linkTarget.classList.remove('viewed-active');
            }
          }
        });
      },
      { threshold: 0.6 }
    );

    sections.forEach((section) => section && observer.observe(section));
  };

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
          <div className="absolute hidden md:block right-4 top-2">
            <TranslateDropdown id={'2'} />
          </div>
        </div>

        <div
          className={` flex justify-between md:justify-evenly p-1 md:p-2 rounded-3xl
  duration-300  `}
        >
          <button
            id={`link-${View.HERO}`}
            onClick={() => scrollToView(View.HERO)}
            className="hidden md:block px-4 py-1 rounded-full transition-all duration-300 ease-in-out"
          >
            <p className="font-black tracking-wide hover:text-logo-orange transition-colors duration-300 cursor-pointer">
              {t('home')}
            </p>
          </button>
          <button
            id={`link-${View.CATEGORY}`}
            onClick={() => scrollToView(View.CATEGORY)}
            className="hidden md:block px-4 py-1 rounded-full transition-all duration-300 ease-in-out"
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
                width={200}
                height={200}
                className={`rounded-full absolute w-8 md:w-12 h-8 md:h-12 transition-opacity cursor-pointer`}
                priority
              />
            </div>
            <button
              id={`link-${View.HERO}`}
              onClick={() => scrollToView(View.HERO)}
              className="blocl md:hidden px-4 py-1 rounded-full transition-all duration-300 ease-in-out"
            >
              <p className="font-black font-extrabold tracking-wide hover:text-logo-orange transition-colors duration-300 cursor-pointer">
                {t('appName')}
              </p>
            </button>
          </div>

          <button
            id={`link-${View.PRODUCT}`}
            onClick={() => scrollToView(View.PRODUCT)}
            className="hidden md:block px-4 py-1 rounded-full transition-all duration-300 ease-in-out"
          >
            <p className="font-black tracking-wide hover:text-logo-orange transition-colors duration-300 cursor-pointer">
              {t('collections')}
            </p>
          </button>
          <button
            id={`link-${View.FAQ}`}
            onClick={() => scrollToView(View.FAQ)}
            className="hidden md:block px-4 py-1 rounded-full transition-all duration-300 ease-in-out"
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
