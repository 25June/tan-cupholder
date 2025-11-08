'use server';

import OpenAI from 'openai';

export const generateDescription = async (imageUrl: string | File) => {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.OPENAI_BASE_URL
    });
    let imageUrlString = imageUrl;
    if (imageUrl instanceof File) {
      // convert file to base64
      const reader = new FileReader();
      reader.onload = (event) => {
        imageUrlString = `data:image/jpeg;base64,${
          event.target?.result as string
        }`;
      };
      reader.readAsDataURL(imageUrl);
      console.log(imageUrlString);
    }
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze this product image and return a JSON string matching this type:
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
                url: `data:image/jpeg;base64,${imageUrlString}`
              }
            }
          ]
        }
      ],
      temperature: 0.5
    });
    return JSON.parse(response.choices[0].message.content || '{}');
  } catch (error) {
    console.error('Error generating description:', error);
    return null;
  }
};
