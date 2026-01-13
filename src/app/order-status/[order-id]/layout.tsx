import { PropsWithChildren } from 'react';

import StaticMenuBar from '@/components/menu-bar/StaticMenuBar';
import Footer from '@/components/footer/Footer';

export default function OrderStatusLayout({
  children
}: Readonly<PropsWithChildren>) {
  return (
    <div className="relative min-h-screen">
      <StaticMenuBar triggerCartCount={1} />
      <main className="relative z-1">{children}</main>
      <Footer />
    </div>
  );
}
