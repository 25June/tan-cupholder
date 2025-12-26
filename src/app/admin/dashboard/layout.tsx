'use client';

import SideNav from '@/app/admin/ui/dashboard/sidenav';
import { lusitana } from '@/app/admin/ui/fonts';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`flex h-screen flex-col md:flex-row md:overflow-hidden font-[Inter] admin-layout ${lusitana.variable}`}
    >
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="grow p-4 md:overflow-y-auto md:p-6">{children}</div>
    </div>
  );
}
