'use client';

import * as motion from 'motion/react-client';
import { useMemo, useState } from 'react';
import Image from 'next/image';
import { yuseiMagic } from '@/styles/fonts';
import { useTranslations } from 'next-intl';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export const Faq = () => {
  const t = useTranslations('HomePage.FaqSection');

  const mockData = useMemo(
    () => [
      {
        id: '1',
        title: t('question1.title'),
        answer: t('question1.answer'),
        opened: false
      },
      {
        id: '2',
        title: t('question2.title'),
        answer: t('question2.answer'),
        opened: false
      },
      {
        id: '3',
        title: t('question3.title'),
        answer: t('question3.answer'),
        opened: false
      },
      {
        id: '4',
        title: t('question4.title'),
        answer: t('question4.answer'),
        opened: false
      },
      {
        id: '5',
        title: t('question5.title'),
        answer: t('question5.answer'),
        opened: false
      }
    ],
    [t]
  );

  const [data, setData] = useState<any[]>(mockData);
  const onClick = (id: string) => {
    setData((prev) =>
      prev.map((i) => (i.id === id ? { ...i, opened: !i.opened } : i))
    );
  };
  return (
    <div className="relative">
      <div className="relative max-w-6xl mx-auto min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <div className="w-full">
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center font-bold text-1xl text-slate-500 tracking-wide"
          >
            {t('title')}
          </motion.h3>
          <motion.h4
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className={`text-center font-semibold text-4xl ${yuseiMagic.className}`}
          >
            {t('subtitle')}
          </motion.h4>
          <motion.div
            initial="offscreen"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              offscreen: {
                transition: {
                  staggerChildren: 0.05,
                  delayChildren: 0.1
                }
              },
              visible: {
                transition: {
                  staggerChildren: 0.1,
                  staggerDirection: 0.15
                }
              }
            }}
            className="mt-8 space-y-4 transition-all duration-300"
          >
            {data.map((item) => {
              return (
                <motion.div
                  viewport={{ once: true }}
                  variants={{
                    offscreen: {
                      opacity: 0.75,
                      scale: 0.75
                    },
                    visible: {
                      opacity: 1,
                      scale: 1,
                      transition: {
                        duration: 0.25,
                        ease: [0, 0.71, 0.2, 1.01]
                      }
                    }
                  }}
                  key={item.id}
                  className="relative transition-all duration-300 cursor-pointer"
                >
                  <motion.button
                    onClick={() => onClick(item.id)}
                    className={`relative z-10 p-4 transition-all duration-300 flex justify-between items-center justify-items-center border-logo-orange-border border-2 rounded-md border-solid w-full text-left cursor-pointer ${
                      item.opened
                        ? 'bg-logo-orange-pale-companion text-logo-orange-border'
                        : 'bg-white text-logo-text'
                    }`}
                  >
                    <p
                      className={`transition-all duration-300 ${
                        item.opened ? 'font-bold' : 'font-semibold'
                      }`}
                    >
                      {item.title}
                    </p>
                    <ChevronDownIcon
                      className={`w-4 h-4 transition-transform duration-300 transform ${
                        item.opened ? 'rotate-0' : '-rotate-90'
                      }`}
                    />
                  </motion.button>
                  <div
                    className={`bg-white max-h-full overflow-hidden rounded-md relative -top-3 transition-all duration-300 ${
                      item.opened ? '-translate-y-0' : '-translate-y-6'
                    }`}
                  >
                    <div
                      className={`transition-all duration-300 text-logo-text px-4 overflow-hidden ${
                        item.opened ? `pt-6 pb-4 max-h-128` : 'max-h-0'
                      }`}
                    >
                      {item.answer}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
