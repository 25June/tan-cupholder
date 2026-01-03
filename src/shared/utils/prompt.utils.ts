'use server';

import { GoogleGenAI } from '@google/genai';

interface Props {
  readonly productTypeName: string;
  readonly productTypeDescription: string;
  readonly colors: string[];
  readonly pattern: string;
  readonly productName: string;
}

const PRODUCT_DESCRIPTION_PROMPT = ({
  productName,
  productTypeName,
  productTypeDescription,
  colors,
  pattern
}: Props) => `
You are a very talented senior content creator, you will help me to write a content to description & advertise the product base on the product type description and name, colors and pattern.
Here is Product Name: ${productName}.
Here is Product Type Name: ${productTypeName}.
Here is Product Type Description: ${productTypeDescription}.
Here are Colors: ${colors.join(', ')}.
Here is Pattern: ${pattern}.
Here is the strategy for the content:
1. Product description: Generate a medium content (3-4 sentences) introducing the product name based on the product type name & description.
The purpose of the product is to hold cups in many different kinds or sizes.
The target buyer: who is fit for this product type, the age range or the youth you care about the environment.
2. Product appearance: Generate a medium content (5-7 sentences) advertising about the product appearance based on the colors and pattern.
The purpose of color and pattern is to make the product more attractive and unique. 
The color I provided is the hex colors, you need to transform them into a fancy, descriptive color name, if you can not find any name for any hex color in the list of colors, by pass it, don't force it. I don't want to see any hex color in the output.
Also the color will map with Zodiac Sign and people related to it. For example: The primary color for the Aries zodiac sign is red so the color will fit for Aries people.
The pattern I provide is the pattern name, you need to convert it to a fancy name, descriptive pattern name. for example: jungle bear => Jungle Bear Pattern.
3. Product promise: Generate a short content (1-2 sentences) summarizing the product appearance and a promise it will be a good gift for the target buyer.
4. Tagline: Generate a short tagline (1-2 sentences - maximum 20 words) for the product.
The purpose of the tagline - a very short sentence, like a quote or a trendy statement—Slogan - is to make the product more attractive and unique. It will be displayed at the top of the product page, below the name and the prices. Make it attractive and unique.

Output the response in the following JSON format, return only valid JSON, with no markdown, no extra text:
{ "productDescription": "string", "productAppearance": "string", "productPromise": "string", "tagline": "string" }
`;

export const productDescription = async ({
  productTypeName,
  productTypeDescription,
  colors,
  pattern,
  productName
}: Props) => {
  const startTime = Date.now();
  const requestId = `gen_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;

  console.log(`[${requestId}] 🚀 Starting product description generation`, {
    productName,
    productTypeName,
    colorsCount: colors.length,
    pattern
  });

  try {
    const genai = new GoogleGenAI({
      apiKey: process.env.GEMINI_KEY
    });

    console.log(`[${requestId}] 📡 Sending request to Gemini API...`, {
      model: process.env.GEMINI_MODEL || 'not specified'
    });

    const response = await genai.models.generateContent({
      model: process.env.GEMINI_MODEL || '',
      contents: PRODUCT_DESCRIPTION_PROMPT({
        productTypeName,
        productTypeDescription,
        colors,
        pattern,
        productName
      }),
      config: {
        responseMimeType: 'application/json'
      }
    });

    const responseTime = Date.now() - startTime;
    console.log(`[${requestId}] ✅ Received response from Gemini API`, {
      responseTime: `${responseTime}ms`,
      hasText: !!response.text,
      textLength: response.text?.length || 0
    });

    console.log({ response: response.text });
    const jsonResponse = JSON.parse(response.text || '{}');
    if (!jsonResponse) {
      throw new Error('Empty JSON response');
    }
    if (
      !jsonResponse.productDescription ||
      !jsonResponse.productAppearance ||
      !jsonResponse.productPromise ||
      !jsonResponse.tagline
    ) {
      console.warn(`[${requestId}] ⚠️ Invalid JSON structure received`, {
        hasDescription: !!jsonResponse.productDescription,
        hasAppearance: !!jsonResponse.productAppearance,
        hasPromise: !!jsonResponse.productPromise,
        hasTagline: !!jsonResponse.tagline
      });
      throw new Error('Invalid JSON response');
    }

    const totalTime = Date.now() - startTime;
    console.log(
      `[${requestId}] 🎉 Successfully generated product description`,
      {
        totalTime: `${totalTime}ms`,
        descriptionLength: jsonResponse.productDescription.length,
        appearanceLength: jsonResponse.productAppearance.length,
        promiseLength: jsonResponse.productPromise.length,
        taglineLength: jsonResponse.tagline.length
      }
    );

    return jsonResponse;
  } catch (error) {
    const errorTime = Date.now() - startTime;
    console.error(`[${requestId}] ❌ Error generating description`, {
      errorTime: `${errorTime}ms`,
      errorType: error instanceof Error ? error.name : 'Unknown',
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

    return {
      error: 'Error generating description',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
