'use client';

import { yuseiMagic } from '@/styles/fonts';
import { useProduct } from '@/hooks/useProduct';
import { useEffect } from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import {
  numberWithCommas,
  calculatePercent,
} from '@/shared/utils/formatNumber';
import StaticMenuBar from '@/components/menu-bar/StaticMenuBar';
import Spinner from '@/components/spinner/Spinner';

export default function Page() {
  const { products, isLoading, onGetProducts } = useProduct();
  useEffect(() => {
    onGetProducts();
  }, []);

  return (
    <div>
      <StaticMenuBar />
      <div>
        <div
          className={`w-screen h-96 bg-center bg-cover bg-no-repeat bg-[url('/IMG_7197.jpg')]`}
        ></div>
      </div>
      <div className="relative h-full max-w-8xl mx-auto p-8 pb-20 gap-16 sm:p-20 ">
        <div className="flex justify-between">
          <div>
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className={`text-lg text-slate-400`}
            >
              Environment Friendly
            </motion.h2>
            <motion.h3
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className={`text-3xl antialiased text-logo-orange font-bold tracking-wide mb-4 ${yuseiMagic.className}`}
            >
              Low Impact Collections
            </motion.h3>
          </div>
          <div>
            <label className="input input-md">
              <svg
                className="h-[1em] opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </g>
              </svg>
              <input type="search" className="grow" placeholder="Search" />
            </label>
          </div>
        </div>

        <div className="relative grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-8 py-2 px-2">
          {products.map((item, index) => {
            return (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.25 * (index + 1),
                  scale: {
                    type: 'spring',
                    visualDuration: 0.25 * (index + 1),
                    bounce: 0.25,
                  },
                }}
                key={item.id}
                className="relative justify-self-center shadow-md hover:shadow-2xl transition-shadow duration-300 rounded-xl w-auto"
              >
                <div className="relative bg-black rounded-xl overflow-hidden outline outline-2 -outline-offset-8 outline-slate-100 transition-all duration-300 ">
                  <div className="z-10 absolute text-xs top-4 left-4 text-slate-100 rounded-full bg-logo-orange py-1 px-2 tracking-wider font-black">
                    {item.sale}%
                  </div>
                  <Image
                    src={item.image}
                    width={300}
                    height={300}
                    alt={item.image}
                    className="w-72 h-72 min-w-72 hover:scale-110 transform-none transition-all duration-300"
                  />
                </div>
                <div className="relative text-left p-2">
                  <div className="text-sm font-light text-slate-500">
                    {item.type}
                  </div>
                  <h4 className="text-lg font-semibold">{item.name}</h4>
                  <div>
                    <span className="text-slate-400 line-through decoration-slate-400">
                      {numberWithCommas(item.price)} vnd
                    </span>
                    {' -> '}
                    <span className="font-medium">
                      {calculatePercent(item.price, item.sale)} vnd
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        {isLoading && <Spinner />}
      </div>
    </div>
  );
}
