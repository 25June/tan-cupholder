import Image from 'next/image';

const StaticMenuBar = () => {
  return (
    <div className="max-w-screen w-full mx-auto relative shadow-2xl">
      <div className="max-w-8xl bg-white mx-auto flex justify-evenly p-4">
        <div className="relative">
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

        <button onClick={() => {}}>
          <p className="font-black tracking-wide hover:text-logo-orange transition-colors duration-300 cursor-pointer">
            Home
          </p>
        </button>
        <button onClick={() => {}}>
          <p className="font-black tracking-wide hover:text-logo-orange transition-colors duration-300 cursor-pointer">
            Categories
          </p>
        </button>
        <button onClick={() => {}}>
          <p className="font-black tracking-wide hover:text-logo-orange transition-colors duration-300 cursor-pointer">
            Collections
          </p>
        </button>
        <button onClick={() => {}}>
          <p className="font-black tracking-wide hover:text-logo-orange transition-colors duration-300 cursor-pointer">
            Faq
          </p>
        </button>
      </div>
    </div>
  );
};

export default StaticMenuBar;
