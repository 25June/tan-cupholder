import { getImageProps } from 'next/image';

export default function AvatarShape1() {
  const {
    props: { src: imageUrl }
  } = getImageProps({
    alt: 'avatar-1',
    width: 300,
    height: 300,
    quality: 100,
    src: 'https://pub-485637738840450490e408cee2acb72c.r2.dev/feature-images/avatar-1.jpg'
  });
  // Define the path data for the blob shape
  const blobPathData =
    'M25.1,-23.9C31.4,-18.8,34.6,-9.4,34.6,0.1C34.7,9.5,31.7,19.1,25.4,24.8C19.1,30.5,9.5,32.3,0.6,31.7C-8.4,31.2,-16.8,28.2,-21,22.5C-25.1,16.8,-25.1,8.4,-24.8,0.3C-24.5,-7.8,-23.9,-15.5,-19.7,-20.5C-15.5,-25.6,-7.8,-27.8,0.8,-28.7C9.4,-29.5,18.8,-28.9,25.1,-23.9Z'; // Define the desired scale factor (e.g., 0.8 for 80%)
  const scaleFactor = 0.75;
  // Calculate new dimensions and position to keep the image centered
  const newWidth = 100 * scaleFactor;
  const newHeight = 100 * scaleFactor;
  const newX = (100 - newWidth) / 2;
  const newY = (100 - newHeight) / 2;
  return (
    <svg
      id="sw-js-blob-svg"
      viewBox="20 20 70 70"
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
        <clipPath id="blob-clip-avatar-1">
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
          clipPath="url(#blob-clip-avatar-1)"
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
