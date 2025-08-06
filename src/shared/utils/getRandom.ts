import { SHAPE_PATH } from '@/styles/shapePath';

export function getRandomImageArr(
  demandArrLength: number,
  imageLength: number
) {
  const usedValues = new Set();

  return Array.from({ length: demandArrLength }, () => {
    let imageIndex, shapeIndex;
    do {
      imageIndex = Math.floor(Math.random() * imageLength);
      shapeIndex = Math.floor(Math.random() * SHAPE_PATH.length);
    } while (usedValues.has(`${imageIndex}-${shapeIndex}`));
    usedValues.add(`${imageIndex}-${shapeIndex}`); // Store combined index to ensure unique pairs
    return {
      imageIndex,
      shapeIndex
    };
  });
}
