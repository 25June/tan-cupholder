'use client';

import { useTranslations } from 'next-intl';
import * as motion from 'motion/react-client';
import { yuseiMagic } from '@/styles/fonts';
import Image from 'next/image';
import SliderContainer from './SliderContainer';
import { ProductResponse } from '@/models/product';
import { useEffect, useState } from 'react';
import { publicFetchProductCategories } from '@/app/lib/public-products.actions';
import Spinner from '../spinner/Spinner';

export default function ProductSlider() {
  const t = useTranslations('HomePage.ProductSliderSection');

  const [categories, setCategories] = useState<
    Record<string, ProductResponse[]>
  >({});
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    setLoading(true);
    publicFetchProductCategories()
      .then((categories) => {
        setCategories(categories);
        setProducts(categories.all);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="relative">
      <div className="relative z-20 w-full max-w-screen md:max-w-8xl mx-auto grid grid-rows-[20px_1fr_20px] md:grid-rows-[10%_1fr_20px] items-center min-h-screen p-4 md:p-8 pb-10 md:pb-20 gap:8 md:gap-16 overflow-hidden">
        <main className="w-full gap-8 row-start-2 text-center">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className={`text-md md:text-lg text-slate-400`}
          >
            {t('title')}
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className={`text-xl md:text-3xl antialiased text-logo-orange font-bold tracking-wide mb-4 ${yuseiMagic.className}`}
          >
            {t('subtitle')}
          </motion.h3>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex gap-x-2 gap-y-2 md:gap-x-6 justify-center flex-wrap mb-2 md:mb-10 font-extrabold"
          >
            {['all', 'new', 'bestSeller', 'featured'].map((category) => (
              <motion.button
                key={category}
                initial={{ scale: 0.75, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                whileHover={{
                  scale: 1.1,
                  transition: { duration: 0.1 }
                }}
                animate={{ scale: selectedCategory === category ? 1.1 : 1 }}
                transition={
                  selectedCategory === category
                    ? {
                        delay:
                          0.25 *
                          ['all', 'new', 'bestSeller', 'featured'].indexOf(
                            category
                          ),
                        duration: 0.6,
                        type: 'spring',
                        bounce: 0.35
                      }
                    : {
                        duration: 0.06, // fast transition on scale down
                        type: 'tween'
                      }
                }
                whileTap={{ scale: 0.9, transition: { duration: 0.1 } }}
                type="button"
                onClick={() => {
                  setSelectedCategory(category);
                  setProducts(categories[category]);
                }}
                className={`text-sm md:text-lg tracking-wide text-logo-orange hover:text-slate-100 rounded-full transition-all duration-300 border-logo-orange border-2 hover:bg-logo-orange py-1 px-4 ${
                  selectedCategory === category
                    ? 'bg-logo-orange text-slate-100'
                    : ''
                }`}
              >
                {t(`${category}`)}
              </motion.button>
            ))}
          </motion.div>
          {loading && <Spinner />}
          <SliderContainer products={products} />
        </main>
      </div>
      <div className="absolute -top-1 w-full">
        <Image
          src={'/top-wave.svg'}
          width={160}
          height={90}
          alt="wave"
          className="w-full"
        />
      </div>
    </div>
  );
}
