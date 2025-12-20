'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useGetCategories } from '@/hooks/useGetCategories';
import ImageGrid from './ImageGrid';
import { motion } from 'motion/react';
import { yuseiMagic } from '@/styles/fonts';

export const CategorySection = () => {
  const t = useTranslations('HomePage.CategorySection');
  const { categories, loading, onGetCategories } = useGetCategories();
  useEffect(() => {
    onGetCategories();
  }, [onGetCategories]);
  return (
    <div className="relative max-w-screen md:max-w-8xl mx-auto grid grid-rows-[15%_1fr_5%] md:grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-full md:min-h-screen p-4 md:p-8 pb-20 gap-4 md:gap-16 ">
      <motion.div
        initial="offscreen"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          offscreen: {
            transition: {
              staggerChildren: 1,
              delayChildren: 1
            }
          },
          visible: {
            transition: {
              staggerChildren: 0.2,
              staggerDirection: 1
            }
          }
        }}
      >
        <motion.h2
          initial="offscreen"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            offscreen: {
              opacity: 0,
              y: 50
            },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.5,
                ease: [0, 0.71, 0.2, 1.01]
              }
            }
          }}
          className={`${yuseiMagic.className} text-2xl md:text-4xl font-bold text-white`}
        >
          {t('title')}
        </motion.h2>
      </motion.div>
      <main className="w-[90vw] md:w-full flex flex-col md:flex-row gap-8 row-start-2 justify-stretch justify-items-stretch items-stretch">
        <ImageGrid categories={categories} loading={loading} />
      </main>
    </div>
  );
};
