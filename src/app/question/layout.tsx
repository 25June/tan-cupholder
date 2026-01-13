import { PropsWithChildren } from 'react';

import StaticMenuBar from '@/components/menu-bar/StaticMenuBar';
import Footer from '@/components/footer/Footer';

export default function QuestionLayout({
  children
}: Readonly<PropsWithChildren>) {
  return (
    <div className="relative min-h-screen">
      <StaticMenuBar />
      <main className="relative z-1 max-w-4xl p-4 mx-auto">{children}</main>
      <Footer />
    </div>
  );
}
