'use server';

import OpenAI from 'openai';

export const convertFileToBase64 = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64Image = buffer.toString('base64');
  return `data:${file.type};base64,${base64Image}`;
};

export const generateDescription = async (base64Image: string) => {
  try {
    const openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPEN_AI_KEY,
      baseURL: process.env.NEXT_PUBLIC_OPEN_AI_DOMAIN
    });
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      stream: false,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `The image you are given is a cup holder image. Ignore the background, focus on the object and analyze this product image and return a JSON string matching this type:
                      {
                        generalDescription: string; // 2-4 sentences about the style, the purpose of the product, fashion, ...
                        color: string[]; // color of the product
                        detailDescription: string; // 2-3 sentences about eco-friendly material and the convenience, the benefit of it
                      }
  
                      ⚠️ IMPORTANT: Return only valid JSON, with no markdown, no extra text.`
            },
            {
              type: 'image_url',
              image_url: {
                url: base64Image
              }
            }
          ]
        }
      ],
      temperature: 0.5
    });
    return response;
  } catch (error) {
    console.error('Error generating description:', error);
    return null;
  }
};
