export const getImageUrl = (id: string, key: string) => {
  return `${process.env.NEXT_PUBLIC_CLOUDFLARE_PUBLIC_URL}${id}/${key}`;
};
