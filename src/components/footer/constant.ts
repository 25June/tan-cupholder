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
    link: 'https://www.linkedin.com/company/tan',
  },
  { image: '/twitter.svg', link: 'https://twitter.com/tan' },
  {
    image: '/facebook.svg',
    link: 'https://www.facebook.com/tan',
  },
  {
    image: '/youtube.svg',
    link: 'https://www.youtube.com/channel/UCxQGjFBoYBtfj3gNZhZEwww?view_as=subscriber',
  },
];
export const menus = (t: any) => [
  [
    {
      name: t('whyTan'),
      href: 'https://news.tan.com/why-tan',
    },
    {
      name: t('materials'),
      href: 'https://news.tan.com/how-it-works/key-features',
    },
    {
      name: t('design'),
      href: 'https://news.tan.com/how-it-works',
    },
    {
      name: t('newProducts'),
      href: 'https://news.tan.com/news/',
    },
  ],
  [
    {
      name: t('aboutUs'),
      href: 'https://news.tan.com/about',
    },
    {
      name: t('questions'),
      href: 'https://news.tan.com/faqs/',
    },
    { name: t('contactUs'), href: 'https://news.tan.com/contact' },
    {
      name: t('privacyPolicy'),
      href: 'https://news.tan.com/privacy-policy',
    },
  ],
];
