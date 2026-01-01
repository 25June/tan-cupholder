'use client';

import { useState } from 'react';
import { onGenerateDescription } from '@/app/admin/lib/actions/ai-generate.actions';

export const useGenerateProductDescription = () => {
  const [description, setDescription] = useState<{
    productDescription: string;
    productAppearance: string;
    productPromise: string;
  } | null>(null);
  const [thinking, setThinking] = useState<boolean>(false);

  const generateDescription = async (formData: FormData) => {
    setThinking(true);
    const result = await onGenerateDescription(formData);
    setDescription(result || null);
    setThinking(false);
    return result;
  };
  console.log({ description, thinking });
  return { description, thinking, generateDescription: generateDescription };
};
