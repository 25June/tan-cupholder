'use client';
import { getImageProps } from 'next/image';
import { formatImagePath } from '@/shared/utils/formatImagePath.utils';

export default function RandomShape3() {
  const {
    props: { src: imageUrl }
  } = getImageProps({
    alt: 'IMG_7197_re-shape',
    width: 300,
    height: 300,
    quality: 100,
    src: `${formatImagePath(
      'https://pub-485637738840450490e408cee2acb72c.r2.dev/feature-images/IMG_7197_re-shape.png',
      600,
      600
    )}`
  });
  // Define the path data for the blob shape
  const blobPathData =
    'M17.5,-27.9C21.5,-24.8,22.5,-17.7,26.4,-11.4C30.3,-5,37.1,0.6,36.5,5.4C36,10.1,28.2,13.9,23,20C17.8,26.2,15.2,34.7,9.6,39.5C3.9,44.3,-4.9,45.4,-10.7,41.4C-16.5,37.4,-19.4,28.3,-21.5,21.2C-23.5,14.1,-24.8,8.9,-28,2.6C-31.1,-3.8,-36.1,-11.3,-35.7,-18.1C-35.4,-24.9,-29.6,-31,-22.8,-32.8C-15.9,-34.5,-8,-31.9,-0.6,-31C6.8,-30.2,13.6,-31,17.5,-27.9Z';
  // Define the desired scale factor (e.g., 0.8 for 80%)
  const scaleFactor = 1;
  // Calculate new dimensions and position to keep the image centered
  const newWidth = 100 * scaleFactor;
  const newHeight = 100 * scaleFactor;
  const newX = (100 - newWidth) / 2;
  const newY = (100 - newHeight) / 2;
  return (
    <svg
      id="sw-js-blob-svg"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Define a linear gradient for the stroke color of the blob outline */}
        <linearGradient id="sw-gradient" x1="0" x2="1" y1="1" y2="0">
          <stop id="stop1" stopColor="rgba(248, 117, 55, 1)" offset="0%"></stop>
          <stop
            id="stop2"
            stopColor="rgba(251, 168, 31, 1)"
            offset="100%"
          ></stop>
        </linearGradient>

        {/*
          Define a clipPath using the blob shape.
          This clipPath will be applied to the image to ensure it only appears
          within the boundaries of the blob.
        */}
        <clipPath id="blob-clip3">
          {/* The path inside the clipPath uses the same data as the blob outline */}
          <path d={blobPathData} transform="translate(50 50)" />
        </clipPath>
      </defs>

      {/*
        Image element:
        - href: The URL of the image to be displayed.
        - x, y: Position of the top-left corner of the image (0,0 covers the viewBox).
        - width, height: Dimensions of the image (100,100 covers the viewBox).
        - clipPath: References the defined clipPath to clip the image to the blob shape.
        - preserveAspectRatio: Ensures the image covers the clipped area without distortion.
        - The image is only rendered if imageUrl is available.
      */}
      {imageUrl && (
        <image
          href={imageUrl}
          x={newX}
          y={newY} // Updated x and y to center the scaled image
          width={newWidth}
          height={newHeight} // Updated width and height to scale down
          clipPath="url(#blob-clip3)"
          preserveAspectRatio="xMidYMid slice"
        />
      )}

      {/*
        Path for the stroke (outline) of the blob:
        - fill="none" ensures the outline itself does not fill its interior, allowing the clipped image to show.
        - d attribute contains the path data for the shape.
        - transform moves the shape to the center of the 100x100 viewBox.
        - strokeWidth sets the thickness of the outline.
        - stroke="url(#sw-gradient)" applies the defined linear gradient as the stroke color.
        - style object applies a CSS transition for smooth changes (currently no dynamic changes are implemented).
      */}
      <path
        fill="none"
        d={blobPathData}
        transform="translate(50 50)"
        strokeWidth="1"
        style={{ transition: '0.3s' }}
        stroke="url(#sw-gradient)"
      ></path>
    </svg>
  );
}
