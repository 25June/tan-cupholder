import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { SessionProvider } from 'next-auth/react';
import { geistMono, geistSans, comingSoon, yuseiMagic } from '@/styles/fonts';
import './globals.css';
import { getLocale } from 'next-intl/server';

export const metadata: Metadata = {
  title: 'TaN',
  description: 'Think About Nature',
  applicationName: 'TaN',
  authors: {
    url: 'https://www.linkedin.com/in/phu-nguyen-5a1b35133/',
    name: 'Think About Nature Team'
  },
  openGraph: {
    title: 'TaN',
    description: 'Think About Nature',
    url: 'https://thinkaboutnature.com',
    siteName: 'TaN'
  },
  creator: 'Think About Nature Team',
  keywords: [
    'TaN',
    'Think About Nature',
    'Sustainable Products',
    'Eco-friendly',
    'Nature',
    'Environment',
    'Sustainability',
    'Eco-conscious',
    'Green Living',
    'Eco-friendly Products',
    'Sustainable Living',
    'Eco-friendly Lifestyle',
    'Eco-friendly Shopping',
    'Sustainable Fashion',
    'Eco-friendly Fashion',
    'Sustainable Home',
    'Eco-friendly Home',
    'Sustainable Brands',
    'Eco-friendly Brands',
    'Sustainable Lifestyle',
    'Eco-friendly Lifestyle',
    'Sustainable Choices',
    'Eco-friendly Choices',
    'Cupholder',
    'Eco-friendly Cupholder',
    'Sustainable Cupholder',
    'Eco-friendly Accessories',
    'Sustainable Accessories',
    'Eco-friendly Gifts',
    'Sustainable Gifts',
    'Eco-friendly Living',
    'Sustainable Living Tips',
    'Eco-friendly Living Tips',
    'Eco-friendly Products Online',
    'Sustainable Products Online',
    'bottle holder',
    'eco-friendly bottle holder',
    'sustainable bottle holder',
    'eco-friendly products',
    'sustainable products',
    'eco-friendly shopping',
    'sustainable shopping',
    'eco-friendly lifestyle',
    'sustainable lifestyle',
    'eco-friendly home',
    'holder',
    'keeper'
  ]
};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale} className="scroll-smooth">
      <body
        className={`${comingSoon.variable} ${yuseiMagic.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <NextIntlClientProvider>{children}</NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
