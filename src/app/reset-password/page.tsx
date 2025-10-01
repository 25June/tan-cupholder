import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { verifyUserId } from '@/app/admin/lib/actions/user-credential.actions';
import ResetPasswordForm from '@/components/reset-password-form/ResetPasswordForm';
import Image from 'next/image';

interface ResetPasswordPageProps {
  searchParams: {
    userId?: string;
  };
}

export default async function ResetPasswordPage({
  searchParams
}: ResetPasswordPageProps) {
  const { userId } = searchParams;

  // Check if userId is provided
  if (!userId) {
    notFound();
  }

  // Verify user ID and get user email
  const userData = await verifyUserId(userId);

  // If user not found or invalid, show 404
  if (!userData) {
    notFound();
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
              className="rounded-full max-w-24"
            />
          </div>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <ResetPasswordForm userId={userId} userEmail={userData.email} />
        </Suspense>
      </div>
    </main>
  );
}
