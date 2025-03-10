import Image from 'next/image';

export const ProductSlider = () => {
  return (
    <div className="relative">
      <div className="relative max-w-8xl mx-auto grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="w-full flex gap-8 row-start-2 justify-stretch justify-items-stretch items-stretch"></main>
      </div>
      <div className="absolute top-0 w-screen">
        <Image
          src={'/top-wave.svg'}
          width={160}
          height={90}
          alt="wave"
          className="w-screen"
        />
      </div>
    </div>
  );
};
