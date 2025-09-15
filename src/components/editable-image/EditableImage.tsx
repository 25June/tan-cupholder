'use client';

import { updateContent } from '@/app/lib/public-content.actions';
import { useModesContext } from '@/contexts/EditMode.context';
import Popper from '@/components/popper/Popper';
import { MouseEvent, useRef, useState } from 'react';
import Image, { ImageProps } from 'next/image';
interface Props extends ImageProps {
  imageKey: string;
}

export default function EditableImage({ imageKey, ...props }: Props) {
  const { isEditorMode, getText } = useModesContext();
  const imageUrl = getText(imageKey)?.['vn'] || '/cup.png';

  if (!isEditorMode) {
    return <Image {...props} src={imageUrl} />;
  }

  return <EditImage imageUrl={imageUrl} textKey={imageKey} {...props} />;
}

interface EditImageProps extends ImageProps {
  imageUrl: string;
  textKey: string;
}

function EditImage({ imageUrl, textKey, ...props }: EditImageProps) {
  const [isOpen, setOpen] = useState<boolean>(false);
  const anchorRef = useRef(null);

  const handleClick = (e: MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleClickPopper = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };

  const onSubmit = (values: FormData) => {
    console.log(values);
    const value = JSON.stringify({ vn: values.get('imageUrl') });
    updateContent({ key: textKey, value, updated_by: 'admin' })
      .then(() => {
        console.log('update success');
        setOpen(false);
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  return (
    <>
      <div
        className={`editable-text-bg cursor-pointer hover:bg-[#72bcd4] w-full h-full`}
        onClick={handleClick}
        ref={anchorRef}
      >
        <Image
          {...props}
          src={imageUrl}
          className={`${props.className} opacity-50`}
        />
      </div>
      <Popper open={isOpen} anchorEl={anchorRef.current} onClose={handleClose}>
        <div onClick={handleClickPopper} className="p-4">
          <form action={onSubmit} className="space-y-4">
            <input
              type="text"
              name="imageUrl"
              className="input w-full"
              placeholder="Vietnamese"
              defaultValue={imageUrl}
            />
            <div className="flex justify-end mt-2">
              <button className="btn btn-primary" type="submit">
                Save
              </button>
            </div>
          </form>
        </div>
      </Popper>
    </>
  );
}
