import { auth } from '@/auth';
import LoginForm from '@/components/login-form/LoginForm';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export default async function LoginPage() {
  const session = await auth();
  if (session?.expires && new Date(session?.expires) > new Date()) {
    redirect('/admin/dashboard');
  }
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-logo-orange-border p-3 md:h-36">
          <div className="w-full h-full text-white flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="TAN cupholder logo"
              width={200}
              height={200}
              className={`rounded-full max-w-24`}
            />
          </div>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
