'use client';

import { useState } from 'react';
import { onGenerateDescription } from '@/app/admin/lib/actions/ai-generate.actions';

export const useGenerateProductDescription = () => {
  const [description, setDescription] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const generateDescription = async (imageUrl: File) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('image', imageUrl);
    const result = await onGenerateDescription(formData);

    console.log(result);
    // setDescription(result || null);
    setLoading(false);
  };
  console.log({ description, loading });
  return { description, loading, generateDescription };
};
