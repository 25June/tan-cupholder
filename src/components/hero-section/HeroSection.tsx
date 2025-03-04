import Image from 'next/image';
import { useState, useEffect } from 'react';

const arr = [
  "bg-[url('/IMG_8677.jpg')]",
  "bg-[url('/IMG_7197.jpg')]",
  "bg-[url('/IMG_7278.jpg')]",
  "bg-[url('/IMG_8884.jpg')]",

  // '/IMG_7197.jpg',
  // '/IMG_7278.jpg',
  // '/IMG_8884.jpg',
  // '/IMG_8677 copy.jpg',
];

export function HeroSection() {
  const [translateX, setTranslateX] = useState<string[]>([]);
  const [opacity, setOpacity] = useState<string[]>([]);
  const [translateY, setTranslateY] = useState<string[]>([]);
  const [zIndex, setZIndex] = useState<string[]>([]);
  const [imgOrders, setImgOrders] = useState<string[]>(arr);
  const [startTransitions, setStartTransitions] = useState<boolean>(false);

  useEffect(() => {
    setTranslateX([
      '-translate-x-9',
      '-translate-x-6',
      '-translate-x-3',
      '-translate-x-0',
    ]);
    setTranslateY([
      '-translate-y-9',
      '-translate-y-6',
      '-translate-y-3',
      '-translate-y-0',
    ]);
    setOpacity(['opacity-100', 'opacity-80', 'opacity-60', 'opacity-0']);
    setZIndex(['z-30', 'z-20', 'z-10', 'z-0']);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStartTransitions(false);
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
        setStartTransitions(true);
      }, 4500);

      return () => clearTimeout(timer);
    }
  }, [startTransitions]);
  return (
    <div className="max-w-full w-screen h-screen bg-white flex align-middle justify-center">
      <div className="relative w-full h-full flex justify-end pt-24">
        <div className="w-4/5">
          <Image
            src="/logo.png"
            alt="TAN cupholder logo"
            width={350}
            height={350}
            className={`rounded-full`}
          />
          <h1 className="pl-10 font-sans text-5xl subpixel-antialiased font-semibold tracking-wide">
            Back to Resilian Material
          </h1>
        </div>
      </div>
      <div className="relative w-full h-full flex justify-center pt-32">
        {imgOrders.map((img, index) => {
          let transitionIndex = index;
          let o = opacity[transitionIndex];
          let tranformX = translateX[transitionIndex];
          let tranformY = translateY[transitionIndex];

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
              className={`w-2/3 md:w-4/5 h-4/5 absolute transition-all duration-300 ${tranformY} ${zIndex[transitionIndex]} ${tranformX} ${o}`}
            >
              <div
                className={`w-full h-4/5 rounded-xl aspect-square bg-center bg-cover bg-no-repeat ${img}`}
              ></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
