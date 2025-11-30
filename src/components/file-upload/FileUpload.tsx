import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState
} from 'react';
import { uploadMedia } from '@/shared/utils/uploadMedia';
import { throttle } from '@/shared/utils/debounce';

interface Props {
  image: File;
  presignedUrl: string;
  setImageUploadCompleted: Dispatch<SetStateAction<Record<string, boolean>>>;
}
export default function FileUpload({
  image,
  presignedUrl,
  setImageUploadCompleted
}: Props) {
  const [progress, setProgress] = useState<number>(0);

  const onUpload = useCallback((presignedUrl: string, image: File) => {
    if (!image) {
      console.error('No file selected');
      return;
    }

    if (!presignedUrl) {
      console.error('No presigned url');
      return;
    }
    return uploadMedia(
      image,
      presignedUrl,
      throttle((progress: number) => setProgress(progress), 200)
    );
  }, []);

  useEffect(() => {
    if (image && presignedUrl) {
      onUpload(presignedUrl, image)?.then(() => {
        setImageUploadCompleted((prev) => ({ ...prev, [image.name]: true }));
      });
    }
  }, [image, presignedUrl, onUpload]);

  return (
    <div
      className={`w-full h-full bg-gray-200 rounded-md max-h-56 relative p-2`}
    >
      <img
        src={URL.createObjectURL(image)}
        alt="Product Image"
        className="object-contain w-full h-full"
      />
      {progress > 0 && (
        <progress
          className="progress progress-primary w-full transition-all duration-100 absolute bottom-0 left-0"
          value={progress}
          max="100"
        ></progress>
      )}
    </div>
  );
}
