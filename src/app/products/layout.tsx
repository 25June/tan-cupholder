import { PropsWithChildren } from 'react';

import StaticMenuBar from '@/components/menu-bar/StaticMenuBar';
import Footer from '@/components/footer/Footer';

export default function ProductsLayout({
  children
}: Readonly<PropsWithChildren>) {
  return (
    <div className="relative h-full min-h-screen">
      <StaticMenuBar />
      <main className="relative z-1 h-full">{children}</main>
      <Footer />
    </div>
  );
}
