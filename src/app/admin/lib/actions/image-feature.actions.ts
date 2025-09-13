'use server';

import postgres from 'postgres';
import { z } from 'zod';
import { deleteFile, generateSignedUrl } from '@/app/lib/bucket';
import { FeatureImage } from '@/models/featureImage';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const FormSchema = z.object({
  id: z.string().min(1, { message: 'Id is required' }),
  name: z.string().min(1, { message: 'Name is required' }),
  type: z.string().min(1, { message: 'Type is required' })
});

const CreateFeatureImage = FormSchema.omit({
  id: true
});

export type State = {
  errors?: {
    name?: string[];
    type?: string[];
  };
  message?: string | null;
};

export async function fetchFeatureImages({
  query,
  page
}: {
  query: string;
  page: number;
}) {
  console.log('page', page);
  const images = await sql<FeatureImage[]>`
  SELECT id, name, type, created_at
  FROM feature_images 
  WHERE name ILIKE '%' || ${query || ''} || '%'
  LIMIT 10 
  OFFSET ${page > 0 ? (Number(page) - 1) * 10 : 0}`;
  const totalCount = await sql<
    { count: string }[]
  >`SELECT COUNT(*) AS count FROM feature_images`;
  return { images, totalCount: Number(totalCount[0].count) };
}

export async function createFeatureImage(formData: FormData) {
  const validatedFields = CreateFeatureImage.safeParse({
    name: formData.get('name'),
    type: formData.get('type')
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors
    };
  }
  const { name, type } = validatedFields.data;

  let presignedUrl = '';
  try {
    presignedUrl = await generateSignedUrl('feature-images', name, type);
  } catch (error) {
    console.error('S3 Error:', error);
  }

  const date = new Date().toISOString().split('T')[0];
  try {
    await sql`INSERT INTO feature_images (name, type, created_at) VALUES (${name}, ${type}, ${date})`;
  } catch (error) {
    console.error('Database Error:', error);
  }

  return {
    presignedUrl
  };
}

export async function deleteFeatureImage(id: string) {
  if (!id) {
    return {
      errors: { id: ['Id is required'] }
    };
  }

  const featureImage = await sql`SELECT * FROM feature_images WHERE id = ${id}`;

  if (!featureImage) {
    return {
      errors: { id: ['Feature image not found'] }
    };
  }

  try {
    await sql`DELETE FROM feature_images WHERE id = ${id}`;
    await deleteFile(featureImage[0].name, featureImage[0].type);
  } catch (error) {
    console.error('Database Error:', error);
  }

  return {
    message: 'Feature image deleted successfully'
  };
}
