'use server';

import { z } from 'zod';
import postgres from 'postgres';
import { generateSignedUrl } from '@/app/lib/bucket';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { UserInfo } from '@/models/user';
import { sendEmail } from './email.actions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const UserSchema = z.object({
  id: z.string().min(1, { message: 'Id is required' }),
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  fullName: z.string(),
  avatarURL: z.string(),
  role: z.string().min(1, { message: 'Role is required' }),
  status: z.string().min(1, { message: 'Status is required' }),
  emailVerified: z.boolean(),
  emailVerifiedAt: z.string().optional().nullable(),
  createdAt: z.string(),
  updatedAt: z.string()
});

const UpdateAvatar = z.object({
  userId: z.string().min(1, { message: 'User ID is required' }),
  imageName: z.string().min(1, { message: 'Image name is required' }),
  imageType: z.string().min(1, { message: 'Image type is required' })
});

const CreateUser = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  emailVerified: true,
  emailVerifiedAt: true
});
const UpdateUser = UserSchema.omit({ createdAt: true, updatedAt: true });
const DeleteUser = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
export type State = {
  errors?: {
    firstName?: string[];
    lastName?: string[];
    email?: string[];
    role?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function createUser(prevState: State, formData: FormData) {
  const validatedFields = CreateUser.safeParse({
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    fullName: formData.get('fullName'),
    avatarURL: formData.get('avatarURL') || '',
    role: formData.get('role'),
    status: formData.get('status'),
    email: formData.get('email')
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create User.'
    };
  }

  const {
    firstName,
    lastName,
    fullName,
    avatarURL,
    role,
    status,

    email
  } = validatedFields.data;
  const date = new Date().toISOString();
  const emailVerified = false;
  const emailVerifiedAt = null;
  const password = 'Abc@12345';

  let id = '';
  try {
    const result = await sql`
      INSERT INTO user_info (first_name, last_name, full_name, avatar_url, role, status, email_verified, email_verified_at, email, created_at, updated_at)
      VALUES (${firstName}, ${lastName}, ${fullName}, ${avatarURL}, ${role}, ${status}, ${emailVerified}, ${emailVerifiedAt}, ${email}, ${date}, ${date})
      RETURNING id
    `;
    id = result[0].id;
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to Create User.' };
  }
  console.log(id);
  const resetLink = `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password?userId=${id}`;

  console.log('Create User Credentials');
  try {
    // create user credentials
    await sql`
        INSERT INTO user_credentials (user_id, password, email, provider, created_at, updated_at)
        VALUES (${id}, ${password}, ${email}, ${'credentials'}, ${date}, ${date})
      `;
    // Send email reset password, this mean that user will self setup password
    await sendEmail(email, 'account-created', {
      userId: id,
      userName: fullName,
      resetLink: resetLink
    });
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to Create User Credentials.' };
  }

  return {
    id
  };
}

export async function updateUser(prevState: State, formData: FormData) {
  const validatedFields = UpdateUser.safeParse({
    id: formData.get('id'),
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    fullName: formData.get('fullName'),
    avatarURL: formData.get('avatarURL') || '',
    role: formData.get('role'),
    status: formData.get('status')
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update User.'
    };
  }

  const { id, firstName, lastName, fullName, avatarURL, role, status } =
    validatedFields.data;
  const date = new Date().toISOString();

  try {
    await sql`
      UPDATE user_info
      SET first_name = ${firstName}, last_name = ${lastName}, full_name = ${fullName}, avatar_url = ${avatarURL}, role = ${role}, status = ${status}, updated_at = ${date}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update User.' };
  }

  return {
    id
  };
}

export async function uploadAvatar(formData: FormData) {
  const validatedFields = UpdateAvatar.safeParse({
    userId: formData.get('userId'),
    imageName: formData.get('imageName'),
    imageType: formData.get('imageType')
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Avatar.'
    };
  }

  const { userId, imageName, imageType } = validatedFields.data;

  let presignedUrl = '';
  try {
    presignedUrl = await generateSignedUrl(
      'avatars',
      `${userId}-${imageName.split(' ').join('-')}`,
      imageType
    );
  } catch (error) {
    console.error('S3 Error:', error);
  }

  return {
    presignedUrl
  };
}

export async function deleteUser(id: string) {
  try {
    await sql`UPDATE user_info SET status = 'INACTIVE' WHERE id = ${id}`;
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to Delete User.' };
  }
  return {
    message: 'User deleted successfully'
  };
}

export async function fetchUsers({
  query,
  page
}: {
  query: string;
  page: string;
}) {
  const offset = (Number(page) - 1) * 10;

  try {
    const users = await sql`
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
      WHERE status = 'ACTIVE'
        AND (first_name ILIKE ${`%${query}%`} OR last_name ILIKE ${`%${query}%`} OR email ILIKE ${`%${query}%`})
      ORDER BY created_at DESC
      LIMIT 10 OFFSET ${offset}
    `;

    return users as unknown as UserInfo[];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch users.');
  }
}

export async function fetchUserById(id: string) {
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
      WHERE id = ${id}
    `;

    return user[0] as unknown as UserInfo;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch user.');
  }
}

export async function fetchTotalUsers() {
  try {
    const data = await sql<{ count: string }[]>`
      SELECT COUNT(*) AS count
      FROM user_info
      WHERE status = 'ACTIVE'
    `;

    return Number(data[0].count);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total users.');
  }
}
