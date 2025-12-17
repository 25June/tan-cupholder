'use server';

import { z } from 'zod';

import { Content } from '@/models/content';
import { cookies } from 'next/headers';
import { validateAuth } from '@/shared/utils/auth.utils';
import { NextResponse } from 'next/server';

import { sql } from '@/lib/db';

const ContentSchema = z.object({
  key: z.string(),
  value: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  created_by: z.string(),
  updated_by: z.string()
});

export async function getAllContent() {
  const value = await sql<Content[]>`SELECT * FROM content`;
  return value;
}

const AddContentSchema = ContentSchema.omit({
  created_at: true,
  updated_at: true,
  updated_by: true
});

const UpdateContentSchema = ContentSchema.omit({
  created_at: true,
  created_by: true,
  updated_at: true
});

async function verifyToken() {
  const token = (await cookies()).get('authToken')?.value;

  if (!token) {
    throw new Error('Authentication token not found.');
  }
}

async function addContent(payload: Content) {
  const validatedFields = AddContentSchema.safeParse({
    key: payload.key,
    value: payload.value,
    created_by: payload.updated_by
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors
    };
  }

  const { key, value, created_by } = validatedFields.data;
  const date = new Date().toISOString();

  await sql`INSERT INTO content (key, value, created_at, updated_at, created_by, updated_by) VALUES (${key}, ${value}, ${date}, ${date}, ${created_by}, ${created_by})`;

  return {
    message: 'Content added successfully'
  };
}

export async function updateContent(payload: Content) {
  const authResult = await validateAuth();
  if (!authResult.isValid) {
    console.log('Authentication failed', authResult.error);
    return { error: authResult.error };
  }

  const existingContent =
    await sql`SELECT * FROM content WHERE key = ${payload.key}`;
  if (existingContent.length === 0) {
    console.log('Content not found, creating new content');
    return await addContent(payload);
  }

  const validatedFields = UpdateContentSchema.safeParse({
    key: payload.key,
    value: payload.value,
    updated_by: payload.updated_by
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors
    };
  }

  const { key, value, updated_by } = validatedFields.data;
  const date = new Date().toISOString();

  await sql`UPDATE content SET value = ${value}, updated_by = ${updated_by}, updated_at = ${date} WHERE key = ${key}`;

  return {
    message: 'Content updated successfully'
  };
}
