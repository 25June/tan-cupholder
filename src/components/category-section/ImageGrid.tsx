import { ProductType } from '@/models/productType';
import { formatImagePath } from '@/shared/utils/formatImagePath.utils';
import { getImageUrl } from '@/shared/utils/getImageUrl';
import { motion } from 'motion/react';
import { yuseiMagic } from '@/styles/fonts';
import Image from 'next/image';
import { ScreenLayout } from '@/constants/common';
import { useQueryMedia } from '@/hooks/useQueryLayout';
import Link from 'next/link';
import { unaccent } from '@/shared/utils/unaccent';

const MotionLink = motion.create(Link);

const ImageGridItem = ({
  category,
  loading
}: {
  category: ProductType;
  loading: boolean;
}) => {
  const currentLayout = useQueryMedia();
  if (loading || !category) {
    return <div className="skeleton h-64"></div>;
  }
  return (
    <div className="relative w-full h-full group">
      <div className="absolute inset-0 flex items-center justify-center text-white text-lg z-10 pointer-events-none p-4">
        <p
          className={`${yuseiMagic.className} text-center flex items-center justify-center text-white text-3xl font-bold rounded-lg bg-gray-800 p-2 bg-opacity-20 opacity-0 group-hover:opacity-50 transition-opacity duration-300 w-full h-full`}
        >
          {category.name}
        </p>
      </div>
      <Image
        src={
          category.image_url
            ? formatImagePath(getImageUrl('product-types', category.image_url))
            : '/cup.png'
        }
        alt={category.name}
        className="relative object-cover w-full h-full scale-110 group-hover:scale-100 transition-all duration-300"
        style={{ objectPosition: 'center center' }}
        width={currentLayout === ScreenLayout.Mobile ? 300 : 600}
        height={currentLayout === ScreenLayout.Mobile ? 300 : 600}
        priority={true}
      />
    </div>
  );
};

export default function ImageGrid({
  categories,
  loading = false
}: {
  categories: ProductType[];
  loading: boolean;
}) {
  const generalStyle =
    'bg-gray-100 rounded-lg overflow-hidden w-full h-full max-h-64 border-4 border-gray-100 shadow-md';
  const classesArr = [
    `row-start-1 col-start-1 col-span-2 ${generalStyle}`,
    `row-start-1 col-start-3 col-span-1 ${generalStyle}`,
    `row-start-1 col-start-4 col-span-1 ${generalStyle}`,
    `row-start-2 col-start-1 col-span-1 ${generalStyle}`,
    `row-start-2 col-start-2 col-span-2 ${generalStyle}`,
    `row-start-2 col-start-4 col-span-1 ${generalStyle}`,
    `row-start-3 col-start-1 col-span-1 ${generalStyle}`,
    `row-start-3 col-start-2 col-span-1 ${generalStyle}`,
    `row-start-3 col-start-3 col-span-2 ${generalStyle}`
  ];

  const classes = classesArr.map((className, index) => {
    return (
      <MotionLink
        viewport={{ once: true }}
        initial="offscreen"
        whileInView="visible"
        key={index}
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
              delay: index * 0.25,
              ease: [0, 0.71, 0.2, 1.01]
            }
          }
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.8 }}
        className={className}
        href={`/products?search=${unaccent(categories[index]?.name || '')}`}
        prefetch={true}
      >
        <ImageGridItem category={categories[index]} loading={loading} />
      </MotionLink>
    );
  });
  return (
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
      className="grid grid-rows-3 grid-cols-4 gap-4 w-full h-full"
    >
      {classes}
    </motion.div>
  );
}
