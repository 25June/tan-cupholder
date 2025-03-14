import Image from 'next/image';

interface Props {
  isScrollToTop: boolean;
}

export function MenuBar({ isScrollToTop }: Props) {
  return (
    <div className="max-w-screen w-full mx-auto absolute z-50">
      <div
        className={`max-w-5xl bg-white mx-auto flex justify-evenly p-4 rounded-b-3xl
 transition-shadow ${isScrollToTop ? 'shadow-sm' : 'shadow-xl'}`}
      >
        <div>Intro</div>
        <div>Products</div>
        <div className="relative">
          <div className={`${'w-1 h-1'} transition-width`}></div>
          <div className="absolute w-12 h-12 top-1/2 left-1/2">
            <Image
              src="/logo.png"
              alt="TAN cupholder logo"
              width={48}
              height={48}
              className={`rounded-full absolute -translate-x-1/2 -translate-y-1/2 w-12 h-12 transition-opacity`}
              priority
            />
          </div>
        </div>

        <div>Story</div>
        <div>Contact</div>
      </div>
    </div>
  );
}
