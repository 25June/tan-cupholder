'use client';

import { motion } from 'motion/react';
import CDNImage from '@/components/cdn-image/CDNImage';

import { calculatePercent } from '@/shared/utils/formatNumber';
import { ProductResponse } from '@/models/product';
import {
  ArrowLongRightIcon,
  ArrowUpRightIcon
} from '@heroicons/react/24/outline';

import { formatPrice } from '@/shared/utils/formatPrice';
import { getImageUrl } from '@/shared/utils/getImageUrl';
import Link from 'next/link';

const MotionLink = motion.create(Link);

interface SpecialCardProps {
  readonly item: ProductResponse;
}

export default function SpecialCard({ item }: SpecialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.25,
        scale: {
          type: 'spring',
          visualDuration: 0.25,
          bounce: 0.25
        }
      }}
      className="relative max-w-72 flex flex-col gap-2 justify-self-center shadow-md shadow-logo-orange-pale-companion hover:shadow-lg transition-shadow duration-300 rounded-2xl w-auto min-w-72 bg-logo-orange-pale-companion p-2"
    >
      <div className="relative rounded-2xl overflow-hidden outline-2 -outline-offset-8 outline-logo-orange-pale-companion transition-all duration-300">
        <div className="z-10 absolute text-xs top-4 left-4 text-logo-orange-border rounded-full bg-logo-orange-pale-companion py-1 px-2 tracking-wider font-black">
          {item.sale}%
        </div>
        <CDNImage
          src={getImageUrl(item.id, item.product_image.name)}
          width={400}
          height={400}
          alt={item.product_image.name}
          className="h-72 w-72 object-cover hover:scale-110 transform-none transition-all duration-300"
        />
      </div>
      <div className="relative grow text-left p-4 bg-white rounded-2xl">
        <div className="mb-2 flex justify-between items-center gap-2">
          <div className="flex flex-col gap-1 grow">
            <h4 className="text-lg font-semibold">{item.name}</h4>
            <p className="text-sm font-light text-slate-500">{item.type}</p>
          </div>
          <MotionLink
            href={`/products/${item.id}`}
            prefetch={true}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.8 }}
            className="hover:scale-110 transform-none transition-all duration-300 bg-special-card rounded-full p-2 shrink-0"
          >
            <ArrowUpRightIcon className="size-4 stroke-logo-orange-border" />
          </MotionLink>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400 line-through decoration-slate-400">
            {formatPrice(item.price)}
          </span>
          <ArrowLongRightIcon className="size-4" />
          <span className="text-logo-orange font-extrabold">
            {formatPrice(calculatePercent(item.price, item.sale))}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
