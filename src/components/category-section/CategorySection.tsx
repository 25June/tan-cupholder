'use client';

import * as motion from 'motion/react-client';
import { useTranslations } from 'next-intl';
import EditableImage from '@/components/editable-image/EditableImage';
import EditableText from '@/components/editable-text/EditableText';
import { editableKey } from '@/constants/editableKey';
import { useQueryMedia } from '@/hooks/useQueryLayout';
import { ScreenLayout } from '@/constants/common';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export const CategorySection = () => {
  const t = useTranslations('HomePage.CategorySection');
  const currentLayout = useQueryMedia();
  return (
    <div className="relative max-w-screen md:max-w-8xl mx-auto grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-full md:min-h-screen p-4 md:p-8 pb-20 gap-16 ">
      <main className="w-[90vw] md:w-full flex flex-col md:flex-row gap-8 row-start-2 justify-stretch justify-items-stretch items-stretch">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="relative bg-white border-4 border-white rounded-2xl w-2/2 md:w-1/3 min-w-2 sm:min-w-64 overflow-hidden"
        >
          <div className="relative w-full h-full max-h-[calc(100%-108px)]">
            <EditableImage
              imageKey={editableKey.CATEGORY_IMAGE_1}
              src={''}
              alt="category image"
              width={480}
              height={640}
              className="w-full h-full object-cover hover:scale-105 transition-all duration-300"
            />
            <div className="absolute bottom-0 left-0 w-full h-32 bg-from-white-to-transparent-180deg"></div>
          </div>
          <div className="relative z-1 w-full bg-[#f9f9f9] flex flex-col p-2">
            <h3
              className={`text-4xl text-center font-semibold font-[yusei-magic]`}
            >
              <EditableText textKey={editableKey.CATEGORY_TITLE_1} />
            </h3>
            <div className="text-center">
              <button className="btn btn-primary btn-soft btn-circle text-logo-orange hover:text-white">
                <ArrowRightIcon className="w-5 h-5 " />
              </button>
            </div>
          </div>
        </motion.div>
        <div className="flex gap-8 flex-col grow w-full">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="relative flex flex-col-reverse md:flex-row bg-white border-4 border-white rounded-2xl min-w-2 md:min-w-96 w-full max-h-96 min-h-64 h-full overflow-hidden"
          >
            <div className="relative z-1 h-full bg-[#f9f9f9] flex md:flex-row flex-col md:justify-between md:items-center gap-2 p-2">
              <h3
                className={`text-4xl text-center font-semibold font-[yusei-magic] md:[writing-mode:sideways-lr]`}
              >
                <EditableText textKey={editableKey.CATEGORY_TITLE_2} />
              </h3>
              <div className="text-center">
                <button className="btn btn-primary btn-soft btn-circle text-logo-orange hover:text-white">
                  <ArrowRightIcon className="w-5 h-5 " />
                </button>
              </div>
            </div>
            <div className="grow relative w-full max-w-full h-full max-h-[calc(100%-108px)] md:max-h-full">
              <EditableImage
                imageKey={editableKey.CATEGORY_IMAGE_2}
                src={''}
                alt="category image 2"
                width={960}
                height={640}
                className="w-full h-full object-cover hover:scale-105 transition-all duration-300"
              />
              <div
                className={`absolute bottom-0 left-0 w-full md:w-32 h-full ${
                  currentLayout === ScreenLayout.Mobile
                    ? 'bg-from-white-to-transparent-180deg'
                    : 'bg-from-white-to-transparent-270deg'
                }`}
              ></div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="relative flex flex-col-reverse md:flex-row bg-white border-4 border-white rounded-2xl min-w-2 md:min-w-96 w-full max-h-96 min-h-64 h-full overflow-hidden"
          >
            <div className="relative z-1 h-full bg-[#f9f9f9] flex md:flex-row flex-col md:justify-between md:items-center gap-2 p-2">
              <h3
                className={`text-4xl text-center font-semibold font-[yusei-magic] md:[writing-mode:sideways-lr]`}
              >
                <EditableText textKey={editableKey.CATEGORY_TITLE_3} />
              </h3>
              <div className="text-center">
                <button className="btn btn-primary btn-soft btn-circle text-logo-orange hover:text-white">
                  <ArrowRightIcon className="w-5 h-5 " />
                </button>
              </div>
            </div>
            <div className="grow relative w-full max-w-full h-full max-h-[calc(100%-108px)] md:max-h-full">
              <EditableImage
                imageKey={editableKey.CATEGORY_IMAGE_3}
                src={''}
                alt="category image 3"
                width={960}
                height={640}
                className="w-full h-full object-cover hover:scale-105 transition-all duration-300"
              />
              <div
                className={`absolute bottom-0 left-0 w-full md:w-32 h-full ${
                  currentLayout === ScreenLayout.Mobile
                    ? 'bg-from-white-to-transparent-180deg'
                    : 'bg-from-white-to-transparent-270deg'
                }`}
              ></div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};
