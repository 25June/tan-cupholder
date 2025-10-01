'use server';

import { z } from 'zod';
import postgres from 'postgres';
import bcrypt from 'bcrypt';
import { UserInfo } from '@/models/user';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// Password validation schema
const PasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .regex(/[A-Z]/, {
        message: 'Password must contain at least 1 uppercase letter'
      })
      .regex(/[a-z]/, {
        message: 'Password must contain at least 1 lowercase letter'
      })
      .regex(/[0-9]/, { message: 'Password must contain at least 1 number' })
      .regex(/[^A-Za-z0-9]/, {
        message: 'Password must contain at least 1 special character'
      }),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  });

export type PasswordResetState = {
  errors?: {
    password?: string[];
    confirmPassword?: string[];
  };
  message?: string | null;
  success?: boolean;
};

// Verify user ID and return user email
export async function verifyUserId(
  userId: string
): Promise<{ email: string; user: UserInfo } | null> {
  try {
    const user = await sql`
      SELECT 
        id,
        first_name as "firstName",
        last_name as "lastName",
        full_name as "fullName", 
        email,
        avatar_url as "avatarURL",
        role,
        status,
        email_verified as "emailVerified",
        email_verified_at as "emailVerifiedAt",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM user_info 
      WHERE id = ${userId} AND status = 'ACTIVE'
    `;

    if (user.length === 0) {
      return null;
    }

    return {
      email: user[0].email,
      user: user[0] as unknown as UserInfo
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to verify user ID.');
  }
}

// Reset user password
export async function resetUserPassword(
  prevState: PasswordResetState,
  formData: FormData
): Promise<PasswordResetState> {
  const userId = formData.get('userId') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  // Validate password
  const validatedFields = PasswordSchema.safeParse({
    password,
    confirmPassword
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Password validation failed'
    };
  }

  try {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);
    const date = new Date().toISOString();

    // Update password in user_credentials table
    await sql`
      UPDATE user_credentials 
      SET password = ${hashedPassword}, updated_at = ${date}
      WHERE user_id = ${userId}
    `;

    return {
      success: true,
      message: 'Password reset successfully'
    };
  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Failed to reset password. Please try again.'
    };
  }
}
