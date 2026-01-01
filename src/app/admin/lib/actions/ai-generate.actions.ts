'use server';

import { productDescription } from '@/shared/utils/prompt.utils';
import z from 'zod';

const GenerateDescriptionSchema = z.object({
  name: z.string(),
  productTypeName: z.string(),
  productTypeDescription: z.string(),
  colors: z.string(),
  pattern: z.string()
});

// This function generate description from a product which
// has product name
// has product type description and name,
// has array of color
// has pattern

export async function onGenerateDescription(formData: FormData) {
  const validatedFields = GenerateDescriptionSchema.safeParse({
    name: formData.get('name'),
    productTypeName: formData.get('productTypeName'),
    productTypeDescription: formData.get('productTypeDescription'),
    colors: formData.get('colors'),
    pattern: formData.get('pattern')
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }
  try {
    const { name, productTypeName, productTypeDescription, colors, pattern } =
      validatedFields.data;

    return await productDescription({
      productName: name,
      productTypeName,
      productTypeDescription,
      colors: JSON.parse(colors || '[]') as string[],
      pattern
    });
  } catch (error) {
    console.error('Error generating description:', error);
    return { error: 'Error generating description' };
  }
}
