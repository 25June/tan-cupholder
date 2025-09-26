import EditableImage from '../editable-image/EditableImage';
import { editableKey } from '@/constants/editableKey';

export default function EditableSlider({ imageArr }: { imageArr: string[] }) {
  return (
    <div className="flex gap-2 h-[200px]">
      <EditableImage
        key={imageArr[0]}
        imageKey={editableKey.HERO_SECTION_IMAGE_1}
        src={imageArr[0]}
        width={200}
        height={200}
        alt={imageArr[0]}
      />
      <EditableImage
        key={imageArr[1]}
        imageKey={editableKey.HERO_SECTION_IMAGE_2}
        src={imageArr[1]}
        width={200}
        height={200}
        alt={imageArr[1]}
      />
      <EditableImage
        key={imageArr[2]}
        imageKey={editableKey.HERO_SECTION_IMAGE_3}
        src={imageArr[2]}
        width={200}
        height={200}
        alt={imageArr[2]}
      />
      <EditableImage
        key={imageArr[3]}
        imageKey={editableKey.HERO_SECTION_IMAGE_4}
        src={imageArr[3]}
        width={200}
        height={200}
        alt={imageArr[3]}
      />
    </div>
  );
}
