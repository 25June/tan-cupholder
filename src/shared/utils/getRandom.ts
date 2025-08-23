import { Image } from '@/models/image';
import { SHAPE_PATH } from '@/styles/shapePath';
import { getImageUrl } from './getImageUrl';

export function getRandomImageArr(
  demandArrLength: number,
  images: Image[],
  productId: string
) {
  const usedValues = new Set();

  return Array.from({ length: demandArrLength }, () => {
    let imageIndex, shapeIndex;
    do {
      imageIndex = Math.floor(Math.random() * images.length);
      shapeIndex = Math.floor(Math.random() * SHAPE_PATH.length);
    } while (usedValues.has(shapeIndex));
    usedValues.add(shapeIndex); // Store combined index to ensure unique pairs
    return {
      mediaUrl: getImageUrl(productId, images[imageIndex].name),
      shapeIndex
    };
  });
}
