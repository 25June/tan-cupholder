'use server';

import {
  generateDescription,
  convertFileToBase64
} from '@/shared/utils/prompt.utils';
import z from 'zod';

const GenerateDescriptionSchema = z.object({
  image: z.instanceof(File)
});

export async function onGenerateDescription(formData: FormData) {
  const validatedFields = GenerateDescriptionSchema.safeParse({
    image: formData.get('image')
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }
  try {
    const { image } = validatedFields.data;

    // transform image to base64
    const base64Image = await convertFileToBase64(image);
    console.log({ base64Image, fileSize: image.size / 1024 / 1024 });
    const result = (await generateDescription(base64Image)) as any;
    console.log({ result });
    return result;
  } catch (error) {
    console.error('Error generating description:', error);
    return { error: 'Error generating description' };
  }
}
