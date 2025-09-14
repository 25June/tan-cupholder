'use client';

import { updateContent } from '@/app/lib/public-content.actions';
import { useModesContext } from '@/contexts/EditMode.context';
import Popper from '@/components/popper/Popper';
import { MouseEvent, useRef, useState } from 'react';
import Image, { ImageProps } from 'next/image';

type TextProps = Record<string, string>;

interface Props extends ImageProps {
  imageKey: string;
}

interface FormValuesInterface {
  imageUrl: string;
}

export default function EditableImage({ imageKey, ...props }: Props) {
  const { isEditorMode, getText } = useModesContext();
  const imageUrl = getText(imageKey)?.['vn'] || '';
  if (!isEditorMode) {
    return <Image {...props} />;
  }

  return <EditText imageUrl={imageUrl} textKey={imageKey} />;
}

interface EditTextProps {
  imageUrl: string;
  textKey: string;
}

function EditText({ imageUrl, textKey }: EditTextProps) {
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

  const onSubmit = (values: FormValuesInterface) => {
    console.log(values);
    const value = JSON.stringify({ vn: values.imageUrl });
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
      <span
        className={`editable-text-bg cursor-pointer hover:bg-[#72bcd4]`}
        onClick={handleClick}
        ref={anchorRef}
      >
        {imageUrl}
      </span>
      <Popper open={isOpen} anchorEl={anchorRef.current} onClose={handleClose}>
        <div onClick={handleClickPopper} className="p-4">
          <form onSubmit={(e) => onSubmit(e as any)} className="space-y-4">
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
