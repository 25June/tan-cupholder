import { useTranslations } from 'next-intl';
import * as motion from 'motion/react-client';
import { yuseiMagic } from '@/styles/fonts';
import Image from 'next/image';
import SliderContainer from './SliderContainer';

interface Props {
  readonly products: any[];
}

export default function ProductSlider({ products }: Props) {
  const t = useTranslations('HomePage.ProductSliderSection');
  return (
    <div className="relative">
      <div className="relative z-20 w-full max-w-screen md:max-w-8xl mx-auto grid grid-rows-[40px_1fr_20px] items-center min-h-screen p-4 md:p-8 pb-10 md:pb-20 gap:8 md:gap-16 overflow-hidden">
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
            className="flex gap-2 md:gap-8 justify-center flex-wrap mb-2 md:mb-10 font-extrabold"
          >
            <button
              type="button"
              className="text-sm md:text-lg tracking-wide text-logo-orange hover:text-slate-100 rounded-full transition-all duration-300 border-logo-orange border-2 hover:bg-logo-orange py-1 px-4"
            >
              {t('allProducts')}
            </button>
            <button
              type="button"
              className="text-sm md:text-lg tracking-wide text-logo-orange hover:text-slate-100 rounded-full transition-all duration-300 border-logo-orange border-2 hover:bg-logo-orange py-1 px-4"
            >
              {t('latestProducts')}
            </button>
            <button
              type="button"
              className="text-sm md:text-lg tracking-wide text-logo-orange hover:text-slate-100 rounded-full transition-all duration-300 border-logo-orange border-2 hover:bg-logo-orange py-1 px-4"
            >
              {t('bestSellers')}
            </button>
            <button
              type="button"
              className="text-sm md:text-lg tracking-wide text-logo-orange hover:text-slate-100 rounded-full transition-all duration-300 border-logo-orange border-2 hover:bg-logo-orange py-1 px-4"
            >
              {t('featuredProducts')}
            </button>
          </motion.div>
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
