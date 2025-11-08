import { useState } from 'react';
import { onGenerateDescription } from '@/app/admin/lib/actions/ai-generate.actions';

export const useGenerateProductDescription = () => {
  const [description, setDescription] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const generateDescription = async (imageUrl: string | File) => {
    setLoading(true);
    const result = await onGenerateDescription(imageUrl);
    setDescription(result);
    setLoading(false);
  };
  console.log({ description, loading });
  return { description, loading, generateDescription };
};
