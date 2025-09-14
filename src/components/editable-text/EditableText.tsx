'use client';

import { updateContent } from '@/app/lib/public-content.actions';
import { useModesContext } from '@/contexts/EditMode.context';
import Popper from '@/components/popper/Popper';
import { MouseEvent, useRef, useState } from 'react';

type TextProps = Record<string, string>;

interface EditableTextProps {
  textKey: string;
  defaultText?: TextProps;
  render?: (renderProps: TextProps) => React.ReactNode;
}

interface FormValuesInterface {
  vn: string;
  en: string;
}

export default function EditableText({
  textKey,
  defaultText = { vn: '', en: '' }
}: EditableTextProps) {
  const { isEditorMode, language, getText } = useModesContext();
  const text = getText(textKey);
  if (!isEditorMode) {
    return <>{language === 'vn' ? text.vn : text.en}</>;
  }

  return <EditText text={text} textKey={textKey} />;
}

interface EditTextProps {
  text: TextProps;
  textKey: string;
}

function EditText({ text, textKey }: EditTextProps) {
  const [isOpen, setOpen] = useState<boolean>(false);
  const anchorRef = useRef(null);
  const { language } = useModesContext();

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
    const value = JSON.stringify({ vn: values.vn, en: values.en });
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
        className={`editable-text-bg cursor-pointer hover:bg-[#72bcd4] ${
          (language === 'vn' ? text.vn?.length : text.en?.length) <= 0
            ? 'inline-block w-[50px] h-[16px]'
            : ''
        }`}
        onClick={handleClick}
        ref={anchorRef}
      >
        {language === 'vn' ? text.vn : text.en}
      </span>
      <Popper open={isOpen} anchorEl={anchorRef.current} onClose={handleClose}>
        <div onClick={handleClickPopper} className="p-4">
          <form onSubmit={(e) => onSubmit(e as any)} className="space-y-4">
            <input
              type="text"
              name="vn"
              className="input w-full"
              placeholder="Vietnamese"
              defaultValue={text.vn}
            />
            <input
              type="text"
              name="en"
              className="input w-full"
              placeholder="English"
              defaultValue={text.en}
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
