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
import { useModesContext } from '@/contexts/EditMode.context';
import EditableSlider from './EditableSlider';
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
  const { isEditorMode } = useModesContext();

  const [cartCount, setCartCount] = useState<number>(0);

  useEffect(() => {
    const count = getCartCountFromStorage();
    setCartCount(count);
  }, []);

  return (
    <div className="relative">
      <div className="max-w-8xl w-full h-screen flex align-middle justify-center mx-auto pt-14 z-10 relative">
        <div className="relative w-full h-full flex justify-start lg:justify-end pt-4 md:pt-16">
          <div className="w-5/5 lg:w-4/5">
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
                width={200}
                height={200}
                className={`rounded-full`}
              />
            </motion.div>

            <motion.div className="pl-10">
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

              <motion.p
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.35,
                  scale: { type: 'spring', visualDuration: 0.35, bounce: 0.5 }
                }}
                className="font-sm font-light leading-6 text-gray-600 mt-4"
              >
                {t('caption')}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.5,
                  scale: { type: 'spring', visualDuration: 0.5, bounce: 0.5 }
                }}
                className="flex gap-2 mt-2"
              >
                {variants.map((item) => {
                  return (
                    <div
                      key={item}
                      className="p-2 md:p-4 border-2 border-stone-500 rounded-lg w-[64px] md:w-[100px]"
                    >
                      <Image width={64} height={64} src={item} alt={item} />
                    </div>
                  );
                })}
              </motion.div>
            </motion.div>
          </div>
        </div>
        <div className="relative w-full h-full hidden md:flex justify-center pt-28">
          {isEditorMode ? (
            <EditableSlider imageArr={imageArr} />
          ) : (
            <Slider imageArr={imageArr} />
          )}
        </div>
      </div>
      <div className="absolute -bottom-1 w-full">
        <Image
          src={'/bottom-wave.svg'}
          width={160}
          height={90}
          alt="wave"
          className="w-full"
          priority
        />
      </div>
    </div>
  );
}
