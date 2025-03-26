import type { Metadata } from 'next';
import { geistMono, geistSans, comingSoon, yuseiMagic } from '@/styles/fonts';
import './globals.css';

export const metadata: Metadata = {
  title: 'TaN',
  description: 'Think About Nature',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${comingSoon.variable} ${yuseiMagic.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
