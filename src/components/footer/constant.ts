import { Variants } from 'framer-motion';

export const durationLeft: Variants = {
  offscreen: {
    opacity: 0,
    y: -20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0, 0.71, 0.2, 1.01],
    },
  },
};

export const durationRight: Variants = {
  offscreen: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0, 0.71, 0.2, 1.01],
    },
  },
};

export const socialMedias = [
  {
    image: '/linked.svg',
    link: 'https://www.linkedin.com/company/predict-mobile',
  },
  { image: '/twitter.svg', link: 'https://twitter.com/predictmobile' },
  {
    image: '/facebook.svg',
    link: 'https://www.facebook.com/predictmobile',
  },
  {
    image: '/youtube.svg',
    link: 'https://www.youtube.com/channel/UCxQGjFBoYBtfj3gNZhZEwww?view_as=subscriber',
  },
];
export const menus = [
  [
    {
      name: 'Tại sao TaN?',
      href: 'https://news.predictmobile.com/why-predict',
    },
    {
      name: 'Loại Vải',
      href: 'https://news.predictmobile.com/how-it-works/key-features',
    },
    {
      name: 'Thiết Kế',
      href: 'https://news.predictmobile.com/how-it-works',
    },
    {
      name: 'Sản Phẩm Mới',
      href: 'https://news.predictmobile.com/news/',
    },
  ],
  [
    {
      name: 'Về Chúng Tôi',
      href: 'https://news.predictmobile.com/about',
    },
    {
      name: 'Câu Hỏi',
      href: 'https://news.predictmobile.com/faqs/',
    },
    { name: 'Liên Hệ', href: 'https://news.predictmobile.com/contact' },
    {
      name: 'Chính Sách',
      href: 'https://news.predictmobile.com/privacy-policy',
    },
  ],
];
