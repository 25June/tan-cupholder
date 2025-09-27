'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  numberWithCommas,
  calculatePercent
} from '@/shared/utils/formatNumber';
import { ProductResponse } from '@/models/product';
import {
  ArrowRightCircleIcon,
  ArrowLongRightIcon
} from '@heroicons/react/24/outline';
import { formatPrice } from '@/shared/utils/formatPrice';
import { getImageUrl } from '@/shared/utils/getImageUrl';
import Link from 'next/link';

interface CardProps {
  readonly item: ProductResponse;
}

export default function Card({ item }: CardProps) {
  const router = useRouter();
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
      className="relative max-w-72 justify-self-center shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl w-auto min-w-72"
    >
      <div className=" relative bg-black rounded-xl overflow-hidden outline-2 -outline-offset-8 outline-slate-100 transition-all duration-300">
        <div className="z-10 absolute text-xs top-4 left-4 text-slate-100 rounded-full bg-logo-orange py-1 px-2 tracking-wider font-black">
          {item.sale}%
        </div>
        <Image
          src={getImageUrl(item.id, item.product_image.name)}
          width={300}
          height={300}
          alt={item.product_image.name}
          className="h-72 w-72 object-cover hover:scale-110 transform-none transition-all duration-300"
        />
      </div>
      <div className="relative text-left p-4">
        <div className="mb-2">
          <h4 className="text-lg font-semibold">{item.name}</h4>
          <p className="text-sm font-light text-slate-500">{item.type}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400 line-through decoration-slate-400">
            {numberWithCommas(item.price)} VND
          </span>
          <ArrowLongRightIcon className="size-4" />
          <span className="text-logo-orange font-extrabold">
            {formatPrice(calculatePercent(item.price, item.sale), '')}
          </span>
        </div>
        <div className="w-full text-right mt-4">
          <Link
            href={`/products/${item.id}`}
            prefetch={true}
            className="btn btn-primary btn-sm text-right"
          >
            View
            <ArrowRightCircleIcon className="size-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
