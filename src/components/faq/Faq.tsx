import * as motion from 'motion/react-client';
import { useState } from 'react';
import Image from 'next/image';
import { yuseiMagic } from '@/styles/fonts';

const mockData = [
  {
    id: '1',
    title: 'What is Lorem Ipsum?',
    answer: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
    opened: false,
  },
  {
    id: '2',
    title: 'Why do we use it?',
    answer: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).`,
    opened: false,
  },
  {
    id: '3',
    title: 'Where does it come from?',
    answer: `Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.
The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.`,
    opened: false,
  },
  {
    id: '4',
    title: 'Where can I get some?',
    answer: `There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.`,
    opened: false,
  },
  {
    id: '5',
    title: 'Question 5',
    answer: 'Answer 5',
    opened: false,
  },
];

export const Faq = () => {
  const [data, setData] = useState<any[]>(mockData);
  const onClick = (id: string) => {
    setData((prev) =>
      prev.map((i) => (i.id === id ? { ...i, opened: !i.opened } : i))
    );
  };
  return (
    <div className="relative">
      <div className="relative max-w-6xl mx-auto min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <div className="w-full">
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center font-bold text-1xl text-slate-500 tracking-wide"
          >
            FAQ
          </motion.h3>
          <motion.h4
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className={`text-center font-semibold text-4xl ${yuseiMagic.className}`}
          >
            Question? Look here
          </motion.h4>
          <motion.div
            initial="offscreen"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              offscreen: {
                transition: {
                  staggerChildren: 0.05,
                  delayChildren: 0.1,
                },
              },
              visible: {
                transition: {
                  staggerChildren: 0.1,
                  staggerDirection: 0.15,
                },
              },
            }}
            className="mt-8 space-y-4 transition-all duration-300"
          >
            {data.map((item) => {
              return (
                <motion.div
                  viewport={{ once: true }}
                  variants={{
                    offscreen: {
                      opacity: 0.75,
                      scale: 0.75,
                    },
                    visible: {
                      opacity: 1,
                      scale: 1,
                      transition: {
                        duration: 0.25,
                        ease: [0, 0.71, 0.2, 1.01],
                      },
                    },
                  }}
                  key={item.id}
                  className="relative transition-all duration-300"
                >
                  <motion.button
                    onClick={() => onClick(item.id)}
                    className={`relative z-10 p-4 transition-all duration-300 flex justify-between justify-items-center border-logo-orange-border border-2 rounded-md border-solid w-full text-left ${
                      item.opened
                        ? 'bg-logo-orange text-white'
                        : 'bg-white text-logo-text'
                    }`}
                  >
                    <p
                      className={`transition-all duration-300 ${
                        item.opened ? 'font-bold' : 'font-semibold'
                      }`}
                    >
                      {item.title}
                    </p>
                    <span>{item.opened ? 'Collapse' : 'Expand'}</span>
                  </motion.button>
                  <div
                    className={`bg-white max-h-full overflow-hidden rounded-md relative -top-3 transition-all duration-300 ${
                      item.opened ? '-translate-y-0' : '-translate-y-6'
                    }`}
                  >
                    <div
                      className={`transition-all duration-300 text-logo-text px-4 overflow-hidden ${
                        item.opened ? `pt-6 pb-4 max-h-128` : 'max-h-0'
                      }`}
                    >
                      {item.answer}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
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
};
