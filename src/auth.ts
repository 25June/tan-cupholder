import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import postgres from 'postgres';
import { z } from 'zod';
import { authConfig } from './auth.config';
import { UserCredentials } from './models/user';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function getUserCredentials(
  email: string
): Promise<UserCredentials | undefined> {
  try {
    const userCredentials = await sql<
      UserCredentials[]
    >`SELECT * FROM user_credentials WHERE email=${email}`;
    return userCredentials[0];
  } catch (error) {
    console.error('Failed to fetch user credentials:', error);
    throw new Error('Failed to fetch user credentials.');
  }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;

          const user = await getUserCredentials(email);
          if (!user) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) return user;
        }

        console.log('Invalid credentials');
        return null;
      }
    })
  ]
});

export const { GET, POST } = handlers;
