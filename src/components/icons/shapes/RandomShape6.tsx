export default function RandomShape1() {
  const imageUrl = '/shapes/IMG_8884_re-shape.png'; // Replace with your image URL
  // Define the path data for the blob shape
  const blobPathData =
    'M27.1,-18.2C35.1,-11.6,41.4,-0.4,39.6,9.7C37.8,19.7,27.9,28.5,16.6,33.5C5.3,38.6,-7.3,40,-15.4,34.9C-23.4,29.9,-26.9,18.4,-29.7,6.6C-32.5,-5.1,-34.5,-17.2,-29.5,-23C-24.4,-28.9,-12.2,-28.6,-1.3,-27.5C9.6,-26.5,19.2,-24.7,27.1,-18.2Z'; // Define the desired scale factor (e.g., 0.8 for 80%)
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
        <clipPath id="blob-clip6">
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
          clipPath="url(#blob-clip6)"
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
