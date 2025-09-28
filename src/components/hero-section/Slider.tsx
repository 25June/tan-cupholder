import { useEffect, useState } from 'react';
import Image from 'next/image';
import EditableImage from '../editable-image/EditableImage';
import { editableKey } from '@/constants/editableKey';

const Z_INDEX = ['z-30', 'z-20', 'z-10', 'z-0'];
const CONTRAST = ['contrast-100', 'contrast-75', 'contrast-50', 'contrast-0'];
const TRANSLATE_X = [
  '-translate-x-9',
  '-translate-x-6',
  '-translate-x-3',
  '-translate-x-0'
];
const TRANSLATE_Y = [
  '-translate-y-9',
  '-translate-y-6',
  '-translate-y-3',
  '-translate-y-0'
];
const OPACITY = ['opacity-100', 'opacity-70', 'opacity-50', 'opacity-0'];

export default function Slider({
  imageArr,
  onLoad
}: {
  imageArr: editableKey[];
  onLoad: () => void;
}) {
  const [contrast, setContrast] = useState<string[]>(CONTRAST);
  const [imgOrders, setImgOrders] = useState<editableKey[]>(imageArr);
  const [startTransitions, setStartTransitions] = useState<boolean>(false);
  const [translateX, setTranslateX] = useState<string[]>([]);
  const [opacity, setOpacity] = useState<string[]>([]);
  const [translateY, setTranslateY] = useState<string[]>([]);
  const [zIndex] = useState<string[]>(Z_INDEX);
  const [isLoaded, setIsLoaded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setStartTransitions(() => false);
      setImgOrders((prev) => {
        const newArr = [...prev.slice(1), prev[0]];
        return newArr;
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, [imgOrders]);

  useEffect(() => {
    if (startTransitions === false) {
      const timer = setTimeout(() => {
        setStartTransitions(() => true);
      }, 4250);

      return () => clearTimeout(timer);
    }
  }, [startTransitions]);

  useEffect(() => {
    setContrast(CONTRAST);
    setTranslateX(TRANSLATE_X);
    setTranslateY(TRANSLATE_Y);
    setOpacity(OPACITY);
  }, []);

  useEffect(() => {
    if (
      Object.values(isLoaded).length &&
      Object.values(isLoaded).every((value) => value === true)
    ) {
      onLoad();
    }
  }, [isLoaded]);
  return (
    <>
      {imgOrders.map((img, index) => {
        let transitionIndex = index;
        let o = opacity[transitionIndex];
        let tranformX = translateX[transitionIndex];
        let tranformY = translateY[transitionIndex];
        const zoomIn = index === 0 ? 'hover:scale-110' : 'hover:scale-100';

        if (startTransitions) {
          if (index === 0) {
            o = 'opacity-0';
            tranformX = '-translate-x-12';
            tranformY = '-translate-y-12';
          } else {
            transitionIndex = index - 1;
            o = opacity[transitionIndex];
            tranformX = translateX[transitionIndex];
            tranformY = translateY[transitionIndex];
          }
        }
        return (
          <div
            key={img}
            className={`w-2/3 md:w-4/5 h-4/5 max-w-md max-h-128 absolute transition-all duration-700 drop-shadow-lg overflow-hidden rounded-xl ${tranformY} ${zIndex[transitionIndex]} ${tranformX} ${contrast[index]} ${o}`}
          >
            <EditableImage
              imageKey={img}
              src={''}
              alt={img}
              width={800}
              height={800}
              onLoad={() => setIsLoaded((prev) => ({ ...prev, [img]: true }))}
              className={`w-full h-full object-cover object-center transition-all duration-300 ${zoomIn}`}
            />
          </div>
        );
      })}
    </>
  );
}
