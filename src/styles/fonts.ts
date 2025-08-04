import { Geist, Geist_Mono, Coming_Soon, Yusei_Magic } from 'next/font/google';

export const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

export const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const comingSoon = Coming_Soon({
  variable: '--font-coming-soon',
  weight: '400',
  subsets: ['latin']
});

export const yuseiMagic = Yusei_Magic({
  variable: '--font-yusei-magic',
  subsets: ['latin'],
  weight: '400'
});
