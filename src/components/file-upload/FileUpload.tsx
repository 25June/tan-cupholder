import { useCallback, useEffect, useState } from 'react';
import s3Service from '@/app/lib/bucket';

interface Props {
  image: File;
  presignedUrl: string;
}
export default function FileUpload({ image, presignedUrl }: Props) {
  const [progress, setProgress] = useState<number>(0);

  const onUpload = useCallback((presignedUrl: string, image: File) => {
    console.log('onUpload', image);
    if (!image) {
      console.error('No file selected');
      return;
    }

    if (!presignedUrl) {
      console.error('No presigned url');
      return;
    }
    return s3Service.uploadFile(image, presignedUrl, (progress: number) =>
      setProgress(progress)
    );
  }, []);

  useEffect(() => {
    if (image && presignedUrl) {
      onUpload(presignedUrl, image);
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
