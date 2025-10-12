'use client';

export const formatImagePath = (
  imageUrl: string,
  width: number = 800,
  height: number = 800
) => {
  const quality = width > height ? width : height;
  const token = process.env.NEXT_PUBLIC_PIX_BOOST_TOKEN;
  const endpoint = process.env.NEXT_PUBLIC_PIX_BOOST_ENDPOINT;
  return `${endpoint}/${imageUrl}/resize?size=${quality}&auth=${token}`;
};
