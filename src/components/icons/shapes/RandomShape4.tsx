import { getImageProps } from 'next/image';

export default function RandomShape4() {
  const {
    props: { src: imageUrl }
  } = getImageProps({
    alt: 'IMG_7197_re-shape',
    width: 300,
    height: 300,
    quality: 100,
    src: 'https://pub-485637738840450490e408cee2acb72c.r2.dev/feature-images/IMG_7197_re-shape.png'
  });
  // Define the path data for the blob shape
  const blobPathData =
    'M23.4,-35.4C30.5,-31.8,36.6,-25.6,39.6,-18.3C42.5,-11,42.3,-2.5,40.7,5.5C39,13.5,35.8,20.9,30.3,24.9C24.8,28.9,16.8,29.6,9.7,30.6C2.5,31.7,-3.8,33.2,-9.3,31.6C-14.7,30,-19.2,25.3,-23.9,20.4C-28.6,15.6,-33.5,10.5,-36.7,3.9C-39.8,-2.8,-41.2,-11.1,-37.4,-16.1C-33.6,-21.1,-24.6,-22.6,-17.5,-26.3C-10.4,-29.9,-5.2,-35.6,1.5,-37.9C8.1,-40.2,16.2,-39,23.4,-35.4Z'; // Define the desired scale factor (e.g., 0.8 for 80%)
  const scaleFactor = 0.9;
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
        <clipPath id="blob-clip4">
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
          clipPath="url(#blob-clip4)"
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
