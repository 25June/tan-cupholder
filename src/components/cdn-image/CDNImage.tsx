'use client';

import Image, { ImageProps } from 'next/image';
import { formatImagePath } from '@/shared/utils/formatImagePath.utils';

interface CDNImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  enableCDN?: boolean;
}

/**
 * CDNImage - Higher Order Component wrapper for Next.js Image
 *
 * Automatically applies CDN formatting to image URLs using formatImagePath utility
 * while preserving all original Next.js Image functionality and optimizations.
 *
 * @param src - The original image URL
 * @param enableCDN - Whether to apply CDN formatting (default: true)
 * @param width - Image width (used for CDN optimization)
 * @param height - Image height (used for CDN optimization)
 * @param ...props - All other Next.js Image props
 */
export default function CDNImage({
  src,
  enableCDN = true,
  width,
  height,
  ...props
}: CDNImageProps) {
  // Apply CDN formatting if enabled and we have valid dimensions
  const processedSrc =
    enableCDN && width && height
      ? formatImagePath(src, width as number, height as number)
      : src;

  return (
    <Image
      {...props}
      src={processedSrc}
      unoptimized
      width={width}
      height={height}
    />
  );
}
