import { View } from '@/constants/common';
import Image from 'next/image';
import Menu from '../icons/Menu';
import { motion, MotionValue } from 'motion/react';

interface DropdownMenuProps {
  readonly scrollToView: (id: string) => void;
}

function DropdownMenu({ scrollToView }: DropdownMenuProps) {
  return (
    <div className="block md:hidden">
      <button
        className="btn btn-sm btn-circle bg-transparent border-0"
        popoverTarget="popover-1"
        style={{ anchorName: '--anchor-1' } as React.CSSProperties}
      >
        <Menu />
      </button>
      <div className="dropdown dropdown-end">
        <ul
          className="dropdown menu bg-white rounded-box w-56"
          popover="auto"
          id="popover-1"
        >
          <li>
            <button onClick={() => scrollToView(View.HERO)}>
              <p className="font-black tracking-wide hover:text-logo-orange transition-colors duration-300 cursor-pointer">
                Home
              </p>
            </button>
          </li>
          <li>
            <button onClick={() => scrollToView(View.CATEGORY)}>
              <p className="font-black tracking-wide hover:text-logo-orange transition-colors duration-300 cursor-pointer">
                Categories
              </p>
            </button>
          </li>
          <li>
            <button onClick={() => scrollToView(View.PRODUCT)}>
              <p className="font-black tracking-wide hover:text-logo-orange transition-colors duration-300 cursor-pointer">
                Collections
              </p>
            </button>
          </li>
          <li>
            <button onClick={() => scrollToView(View.FAQ)}>
              <p className="font-black tracking-wide hover:text-logo-orange transition-colors duration-300 cursor-pointer">
                Faq
              </p>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

interface MenuBarProps {
  readonly scrollYProgress: MotionValue<number>;
}

export function MenuBar({ scrollYProgress }: MenuBarProps) {
  const scrollToView = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <div className="max-w-screen w-full mx-auto absolute top-2 md:top-5 z-50">
      <div className="max-w-[95vw] md:max-w-5xl rounded-3xl mx-auto bg-white overflow-hidden transition-shadow shadow-2xl">
        <div className="relative ">
          <motion.div
            id="scroll-indicator"
            style={{
              scaleX: scrollYProgress,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 5,
              originX: 0,
              zIndex: 1,
              borderBottomRightRadius: '5px',
              borderTopRightRadius: '5px',
              backgroundColor: '#f57722',
            }}
          />
        </div>

        <div
          className={` flex justify-between md:justify-evenly p-2 md:p-4 rounded-3xl
  duration-300  `}
        >
          <button
            onClick={() => scrollToView(View.HERO)}
            className="hidden md:block"
          >
            <p className="font-black tracking-wide hover:text-logo-orange transition-colors duration-300 cursor-pointer">
              Home
            </p>
          </button>
          <button
            onClick={() => scrollToView(View.CATEGORY)}
            className="hidden md:block"
          >
            <p className="font-black tracking-wide hover:text-logo-orange transition-colors duration-300 cursor-pointer">
              Categories
            </p>
          </button>
          <div className="relative grow md:grow-0 flex gap-2 justify-start">
            <div className="relative md:absolute w-8 md:w-12 h-8 md:h-12 -top-0 md:-top-[12px] -left-0 md:-left-[24px]">
              <Image
                src="/logo.png"
                alt="TAN cupholder logo"
                width={48}
                height={48}
                className={`rounded-full absolute w-8 md:w-12 h-8 md:h-12 transition-opacity`}
                priority
              />
            </div>
            <button
              onClick={() => scrollToView(View.HERO)}
              className="blocl md:hidden"
            >
              <p className="font-black font-extrabold tracking-wide hover:text-logo-orange transition-colors duration-300 cursor-pointer">
                Think About Nature
              </p>
            </button>
          </div>

          <button
            onClick={() => scrollToView(View.PRODUCT)}
            className="hidden md:block"
          >
            <p className="font-black tracking-wide hover:text-logo-orange transition-colors duration-300 cursor-pointer">
              Collections
            </p>
          </button>
          <button
            onClick={() => scrollToView(View.FAQ)}
            className="hidden md:block"
          >
            <p className="font-black tracking-wide hover:text-logo-orange transition-colors duration-300 cursor-pointer">
              Faq
            </p>
          </button>
          <DropdownMenu scrollToView={scrollToView} />
        </div>
      </div>
    </div>
  );
}
