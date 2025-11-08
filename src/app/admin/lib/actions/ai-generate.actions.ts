'use server';

import { generateDescription } from '@/shared/utils/prompt.utils';

export const onGenerateDescription = async (imageUrl: string | File) => {
  const result = await generateDescription(imageUrl);
  return result;
};
