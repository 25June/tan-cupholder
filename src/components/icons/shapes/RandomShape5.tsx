import { getImageProps } from 'next/image';

export default function RandomShape5() {
  const {
    props: { src: imageUrl }
  } = getImageProps({
    alt: 'IMG_8884_re-shape',
    width: 300,
    height: 300,
    quality: 100,
    src: 'https://pub-485637738840450490e408cee2acb72c.r2.dev/feature-images/IMG_8884_re-shape.png'
  });
  // Define the path data for the blob shape
  const blobPathData =
    'M24.5,-38.2C31.8,-33.3,38,-26.7,37.9,-19.5C37.8,-12.2,31.5,-4.3,28.8,3.1C26.1,10.4,26.9,17.2,24.4,22.4C21.8,27.5,16,30.9,9.5,33.2C3,35.5,-4,36.7,-10.1,34.8C-16.3,32.9,-21.4,28,-26.3,22.6C-31.1,17.3,-35.7,11.5,-35.1,5.9C-34.6,0.3,-29.1,-5.2,-26.3,-12.3C-23.5,-19.4,-23.5,-28,-19.6,-34.5C-15.7,-41,-7.9,-45.3,0.3,-45.8C8.6,-46.4,17.1,-43.2,24.5,-38.2Z'; // Define the desired scale factor (e.g., 0.8 for 80%)
  const scaleFactor = 0.95;
  // Calculate new dimensions and position to keep the image centered
  const newWidth = 100 * scaleFactor;
  const newHeight = 100 * scaleFactor;
  const newX = (100 - newWidth) / 2;
  // const newY = (100 - newHeight) / 2;
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
        <clipPath id="blob-clip5">
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
          y={-7.5} // Updated x and y to center the scaled image
          width={newWidth}
          height={newHeight} // Updated width and height to scale down
          clipPath="url(#blob-clip5)"
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
