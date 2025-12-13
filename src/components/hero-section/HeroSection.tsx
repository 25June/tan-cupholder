'use client';

import * as motion from 'motion/react-client';
import { yuseiMagic } from '@/styles/fonts';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import CartIcon from '@/components/cart-icon/CartIcon';
import { getCartCountFromStorage } from '@/shared/utils/storage';
import Link from 'next/link';
import Slider from './Slider';
import { editableKey } from '@/constants/editableKey';

const imageArr = [
  editableKey.HERO_SECTION_IMAGE_1,
  editableKey.HERO_SECTION_IMAGE_2,
  editableKey.HERO_SECTION_IMAGE_3,
  editableKey.HERO_SECTION_IMAGE_4
];

const variants = ['/glass.png', '/coffee.png', '/cup.png'];
const Break = () => <br />;
export function HeroSection() {
  const t = useTranslations('HomePage.HeroSection');
  const router = useRouter();

  const [cartCount, setCartCount] = useState<number>(0);

  useEffect(() => {
    const count = getCartCountFromStorage();
    setCartCount(count);
  }, []);

  return (
    <div className="relative min-h-screen">
      <div className="max-w-8xl w-full  flex flex-col md:flex-row gap-4 md:gap-0 align-middle justify-center mx-auto pt-14 z-10 relative">
        <div className="relative w-full flex justify-start lg:justify-end pt-2 sm:pt-4 md:pt-16">
          <div className="w-5/5 lg:w-4/5 pl-4 md:pl-10">
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.4,
                scale: { type: 'spring', visualDuration: 0.4, bounce: 0.5 }
              }}
            >
              <Image
                src="/logo.png"
                alt="TAN cupholder logo"
                width={400}
                height={400}
                className={`rounded-full w-[100px] sm:w-[120px] md:w-[140px] lg:w-[160px]`}
              />
            </motion.div>

            <motion.div>
              <motion.h1
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.35,
                  scale: { type: 'spring', visualDuration: 0.35, bounce: 0.5 }
                }}
                className={`${yuseiMagic.className} text-3xl md:text-5xl subpixel-antialiased font-semibold tracking-wider mb-3`}
              >
                {t.rich('title', {
                  br: Break
                })}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.35,
                  scale: { type: 'spring', visualDuration: 0.35, bounce: 0.5 }
                }}
                className="font-light leading-6 text-gray-600 mb-4"
              >
                {t('subtitle')}
              </motion.p>
              <div className="flex gap-2 items-center">
                <motion.button
                  onClick={() => router.push('/products')}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.4,
                    scale: { type: 'spring', visualDuration: 0.4, bounce: 0.5 }
                  }}
                  type="button"
                  className="text-lg tracking-wide text-slate-100 font-semibold rounded-full transition-all duration-300 bg-logo-orange hover:bg-logo-orange-border py-1 px-4"
                >
                  {t('button')}
                </motion.button>
                <Link href={'/cart'} prefetch={true}>
                  <CartIcon cartCount={cartCount} />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="grow relative w-full h-full md:min-h-[512px] flex justify-center align-top pt-4 md:pt-28 ">
          <Slider imageArr={imageArr} />
        </div>
      </div>
      <div className="absolute -bottom-1 w-full overflow-x-hidden">
        <Image
          src={'/bottom-wave.svg'}
          width={160}
          height={90}
          alt="wave"
          className="w-full h-full object-cover object-bottom overflow-x-hidden color-transparent min-w-[768px] "
          priority
        />
      </div>
    </div>
  );
}
