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
import { isDesktopDevice } from '@/shared/utils/device.utils';

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
  const desktopDevice = isDesktopDevice();

  return (
    <div className="relative w-full h-full group">
      <div className="absolute inset-0 flex items-center justify-center text-white text-lg z-10 pointer-events-none p-0 md:p-4 bottom-0 h-[30%] lg:h-full">
        <p
          className={`${
            yuseiMagic.className
          } text-center flex items-center justify-center text-white text-lg lg:text-3xl font-bold rounded-lg bg-gray-800 p-2 bg-opacity-20 ${
            desktopDevice ? 'opacity-0' : 'opacity-50'
          } group-hover:opacity-50 transition-opacity duration-300 w-full h-full`}
        >
          {currentLayout === ScreenLayout.Mobile
            ? category.short_name
            : category.name}
        </p>
      </div>
      <Image
        src={
          category.image_url
            ? formatImagePath(getImageUrl('product-types', category.image_url))
            : '/cup.png'
        }
        alt={category.name}
        className="relative object-cover w-full h-full scale-110 transition-all duration-300 group-hover:scale-100"
        style={{ objectPosition: 'center center' }}
        width={currentLayout === ScreenLayout.Mobile ? 300 : 600}
        height={currentLayout === ScreenLayout.Mobile ? 300 : 600}
        priority={true}
      />
    </div>
  );
};

const Line = ({
  data,
  loading,
  startAtIndex,
  categories
}: {
  data: string[];
  loading: boolean;
  startAtIndex: number;
  categories: ProductType[];
}) => {
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
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      className="grid grid-rows-1 grid-cols-4 gap-2 md:gap-4 w-full h-full overflow-x-auto overflow-y-hidden p-1 md:p-2"
    >
      {data.map((className, index) => {
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
            href={`/products?search=${unaccent(
              categories[index + startAtIndex]?.name || ''
            )}`}
            prefetch={true}
          >
            <ImageGridItem
              category={categories[index + startAtIndex]}
              loading={loading}
            />
          </MotionLink>
        );
      })}
    </motion.div>
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

  const firstLineClasses = [
    `col-start-1 col-span-2 ${generalStyle}`,
    `col-start-3 col-span-1 ${generalStyle}`,
    `col-start-4 col-span-1 ${generalStyle}`
  ];
  const secondLineClasses = [
    `col-start-1 col-span-1 ${generalStyle}`,
    `col-start-2 col-span-2 ${generalStyle}`,
    `col-start-4 col-span-1 ${generalStyle}`
  ];
  const thirdLineClasses = [
    `col-start-1 col-span-1 ${generalStyle}`,
    `col-start-2 col-span-1 ${generalStyle}`,
    `col-start-3 col-span-2 ${generalStyle}`
  ];

  return (
    <div className="w-full h-full">
      <Line
        data={firstLineClasses}
        loading={loading}
        startAtIndex={0}
        categories={categories}
      />
      <Line
        data={secondLineClasses}
        loading={loading}
        startAtIndex={3}
        categories={categories}
      />
      <Line
        data={thirdLineClasses}
        loading={loading}
        startAtIndex={6}
        categories={categories}
      />
    </div>
  );
}
