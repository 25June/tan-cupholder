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
      name: 'Why TaN?',
      href: 'https://news.predictmobile.com/why-predict',
    },
    {
      name: 'Materials',
      href: 'https://news.predictmobile.com/how-it-works/key-features',
    },
    {
      name: 'Design',
      href: 'https://news.predictmobile.com/how-it-works',
    },
    {
      name: 'New Products',
      href: 'https://news.predictmobile.com/news/',
    },
  ],
  [
    {
      name: 'About Us',
      href: 'https://news.predictmobile.com/about',
    },
    {
      name: 'Questions',
      href: 'https://news.predictmobile.com/faqs/',
    },
    { name: 'Contact Us', href: 'https://news.predictmobile.com/contact' },
    {
      name: 'Policy',
      href: 'https://news.predictmobile.com/privacy-policy',
    },
  ],
];
