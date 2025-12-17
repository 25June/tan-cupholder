'use client';
import { formatImagePath } from '@/shared/utils/formatImagePath.utils';

export default function RandomShape1() {
  const imageUrl = formatImagePath(
    'https://pub-485637738840450490e408cee2acb72c.r2.dev/feature-images/IMG_7197_re-shape.png',
    600,
    600
  );
  // Define the path data for the blob shape
  const blobPathData =
    'M20.7,-31.6C27.5,-27.8,34.1,-23.2,36.5,-17C39,-10.7,37.2,-2.8,36.4,5.5C35.7,13.8,35.9,22.6,31.9,28.3C27.9,34,19.8,36.7,11.9,37.8C4,38.8,-3.5,38.2,-11.3,36.7C-19.2,35.3,-27.3,33,-31.8,27.6C-36.3,22.3,-37.2,13.9,-36.1,6.6C-35,-0.7,-31.9,-6.9,-28.5,-12.4C-25.1,-17.9,-21.4,-22.7,-16.6,-27.4C-11.8,-32.1,-5.9,-36.7,0.5,-37.5C6.9,-38.3,13.9,-35.4,20.7,-31.6Z';
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
        <clipPath id="blob-clip">
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
          clipPath="url(#blob-clip)"
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
