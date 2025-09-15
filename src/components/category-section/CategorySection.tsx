'use client';

import * as motion from 'motion/react-client';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import EditableImage from '@/components/editable-image/EditableImage';
import EditableText from '@/components/editable-text/EditableText';

export const CategorySection = () => {
  const t = useTranslations('HomePage.CategorySection');
  return (
    <div className="relative max-w-screen md:max-w-8xl mx-auto grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-full md:min-h-screen p-4 md:p-8 pb-20 gap-16 ">
      <main className="w-[90vw] md:w-full flex flex-col md:flex-row gap-8 row-start-2 justify-stretch justify-items-stretch items-stretch">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="relative bg-white border-4 border-white rounded-2xl w-2/2 md:w-1/3 min-w-2 sm:min-w-64 overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-full">
            <EditableImage
              imageKey="categoryImage1"
              src={''}
              alt="category image"
              width={480}
              height={640}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-10 bottom-0 w-full bg-from-white-to-transparent-0deg flex justify-end flex-col p-7">
            <h3>
              <EditableText textKey="categorySection1Title" />
            </h3>
            <p>
              <EditableText textKey="categorySection1Description" />
            </p>
            <p>
              <EditableText textKey="categorySection1Price" />
            </p>
            <div>
              <button>
                <EditableText textKey="categorySection1Button" />
              </button>
            </div>
          </div>
        </motion.div>
        <div className="flex gap-8 flex-col grow w-full">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="relative bg-white border-4 border-white rounded-2xl min-w-2 md:min-w-96 w-full max-h-96 min-h-64 h-full overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-full">
              <Image
                src={'/IMG_7197.jpg'}
                alt="category image 1"
                width={960}
                height={640}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative z-10 w-full h-96 md:h-full bg-from-white-to-transparent-270deg flex justify-end flex-col p-7">
              <h3>{t('itemTitle')}</h3>
              <p>{t('itemDescription')}</p>
              <p>{t('itemPrice')}</p>
              <div>
                <button>{t('itemButton')}</button>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="relative bg-white border-4 border-white rounded-2xl min-w-2 md:min-w-96 w-full max-h-96 min-h-64 h-full overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-full">
              <Image
                src={'/IMG_7278.jpg'}
                alt="category image 2"
                width={960}
                height={640}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative z-10 w-full h-96 md:h-full bg-from-white-to-transparent-270deg flex justify-end flex-col p-7">
              <h3>{t('itemTitle')}</h3>
              <p>{t('itemDescription')}</p>
              <p>{t('itemPrice')}</p>
              <div>
                <button>{t('itemButton')}</button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};
