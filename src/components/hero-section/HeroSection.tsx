import { yuseiMagic } from '@/styles/fonts';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const heroImageArr = [
  "bg-[url('/IMG_8677.jpg')]",
  "bg-[url('/IMG_7197.jpg')]",
  "bg-[url('/IMG_7278.jpg')]",
  "bg-[url('/IMG_8884.JPG')]",
];

const variants = ['/glass.png', '/coffee.png', '/cup.png'];

export function HeroSection() {
  const [translateX, setTranslateX] = useState<string[]>([]);
  const [opacity, setOpacity] = useState<string[]>([]);
  const [translateY, setTranslateY] = useState<string[]>([]);
  const [zIndex] = useState<string[]>(['z-30', 'z-20', 'z-10', 'z-0']);
  const [contrast, setContrast] = useState<string[]>([]);
  const [imgOrders, setImgOrders] = useState<string[]>(heroImageArr);
  const [startTransitions, setStartTransitions] = useState<boolean>(false);

  useEffect(() => {
    setContrast(['contrast-100', 'contrast-75', 'contrast-50', 'contrast-0']);
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
    setOpacity(['opacity-100', 'opacity-70', 'opacity-50', 'opacity-0']);
  }, []);

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
  return (
    <div className="relative">
      <div className="max-w-8xl w-screen h-screen flex align-middle justify-center mx-auto pt-14 z-10 relative">
        <div className="relative w-full h-full flex justify-end pt-16">
          <div className="w-4/5">
            <Image
              src="/logo.png"
              alt="TAN cupholder logo"
              width={200}
              height={200}
              className={`rounded-full`}
            />
            <div className="pl-10">
              <h1
                className={`${yuseiMagic.className} text-5xl subpixel-antialiased font-semibold tracking-wider mb-3`}
              >
                Back to <br /> Resiliant Material
              </h1>
              <p className="font-light leading-6 text-gray-600 mb-4">
                Colorful Model, Various Types, Amazing Endurant!!!
              </p>
              <button
                type="button"
                className="text-lg tracking-wide text-slate-100 font-semibold rounded-full transition-all duration-300 bg-logo-orange hover:bg-logo-orange-border py-1 px-4"
              >
                Shop now
              </button>
              <div className="flex gap-2 mt-6">
                {variants.map((item) => {
                  return (
                    <div key={item} className="p-4 border-2 rounded-lg">
                      <Image width={64} height={64} src={item} alt={item} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="relative w-full h-full flex justify-center pt-28">
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
                <div
                  className={`w-full h-full max-w-md max-h-128 overflow-hidden rounded-xl aspect-square bg-center bg-cover bg-no-repeat transition-all duration-300 ${img} ${zoomIn} `}
                ></div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="absolute bottom-0 w-screen">
        <Image
          src={'/bottom-wave.svg'}
          width={160}
          height={90}
          alt="wave"
          className="w-screen"
        />
      </div>
    </div>
  );
}
