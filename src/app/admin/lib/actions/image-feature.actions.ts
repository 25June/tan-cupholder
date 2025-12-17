'use server';

import { z } from 'zod';
import { deleteFile, generateSignedUrl } from '@/app/lib/bucket';
import { FeatureImage } from '@/models/featureImage';

import { sql } from '@/lib/db';

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

  const date = new Date().toISOString();
  try {
    await sql`INSERT INTO feature_images (name, type, created_at) VALUES (${name}, ${type}, ${date})`;
  } catch (error) {
    console.error('Database Error:', error);
  }

  return {
    presignedUrl
  };
}

export async function deleteFeatureImages(ids: string[]) {
  if (!ids) {
    return {
      errors: { id: ['Id is required'] }
    };
  }

  const featureImages = await sql<
    FeatureImage[]
  >`SELECT * FROM feature_images WHERE id = ANY(${ids})`;

  if (!featureImages.length) {
    return {
      errors: { id: ['Feature image not found'] }
    };
  }

  try {
    await Promise.all(
      ids.map((id) => sql`DELETE FROM feature_images WHERE id = ${id}`)
    );

    const removeImagePromises = featureImages.map((image) =>
      deleteFile(image.name, image.type)
    );
    await Promise.all(removeImagePromises);
  } catch (error) {
    console.error('Database Error:', error);
  }

  return {
    message: 'Feature image deleted successfully'
  };
}
