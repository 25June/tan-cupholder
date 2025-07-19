'use server';

import { AuthError } from 'next-auth';
import { signIn } from '@/auth';
import { redirect } from 'next/navigation';
// ...

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    const data = await signIn('credentials', formData);
    console.log({ data });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
