import { motion } from 'motion/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  numberWithCommas,
  calculatePercent,
} from '@/shared/utils/formatNumber';
import { Product } from '@/models/product';
import ArrowLongRight from '@/components/icons/ArrowLongRight';
import Eye from '@/components/icons/Eye';
interface CardProps {
  readonly item: Product;
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
          bounce: 0.25,
        },
      }}
      className="relative justify-self-center shadow-md hover:shadow-2xl transition-shadow duration-300 rounded-xl w-auto min-w-72"
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
      <div className="relative text-left p-4">
        <div className="flex justify-between items-center">
          <h4 className="text-lg font-semibold">{item.name}</h4>
          <p className="text-sm font-light text-slate-500">{item.type}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400 line-through decoration-slate-400">
            {numberWithCommas(item.price)} vnd
          </span>
          <ArrowLongRight className="size-4" />
          <span className="text-logo-orange font-extrabold">
            {calculatePercent(item.price, item.sale)} vnd
          </span>
        </div>
        <div className="w-full text-right mt-4">
          <button
            onClick={() => router.push(`/products/${item.id}`)}
            className="btn btn-primary btn-sm text-right"
          >
            View
            <Eye className="size-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
