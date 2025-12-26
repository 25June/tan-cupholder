'use client';

import ColorThief from 'colorthief';
import { useCallback, useState, useEffect } from 'react';
import { BeakerIcon } from '@heroicons/react/24/outline';
import Spinner from '../spinner/Spinner';

interface ColorDetecterProps {
  imageId: string;
  onChange?: (colors: string) => void;
  defaultColors?: string;
}

const ColorDetecter = ({
  imageId,
  onChange,
  defaultColors
}: ColorDetecterProps) => {
  const [color, setColor] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const removeColor = useCallback((index: number) => {
    setColor((prevColors) => {
      const newColors = prevColors.filter((_, i) => i !== index);
      return newColors.length > 0 ? newColors : [];
    });
  }, []);

  const detectColor = useCallback((id: string) => {
    if (!id) return;

    setLoading(true);
    const colorThief = new ColorThief();
    const img = document.querySelector(`#${id}`) as HTMLImageElement;
    if (!img) return;

    if (img.complete) {
      const colors = colorThief.getPalette(img);
      setColor(convertRgbToHex(colors));
      setLoading(false);
    } else {
      const onSetColor = () => {
        const colors = colorThief.getPalette(img);
        setColor(convertRgbToHex(colors));
        img.removeEventListener('load', onSetColor);
        setLoading(false);
      };
      img?.addEventListener('load', onSetColor);
    }
  }, []);

  const convertRgbToHex = (
    rgb: Array<[number, number, number]>
  ): Array<string> => {
    return rgb.map(
      (c) => `#${c.map((c) => c.toString(16).padStart(2, '0')).join('')}`
    );
  };

  useEffect(() => {
    if (imageId && !defaultColors) {
      console.log('detecting color');
      detectColor(imageId);
    }
    if (defaultColors) {
      setColor(JSON.parse(defaultColors));
    }
  }, [imageId, detectColor, defaultColors]);

  useEffect(() => {
    if (color && onChange) {
      onChange(JSON.stringify(color));
    } else if (!color && onChange) {
      onChange('');
    }
  }, [color, onChange]);

  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend w-full relative">
        Color Palette
        {color && color.length > 0 ? `(${color?.length} colors)` : ''}
        <div className="absolute top-0 right-0">
          <button
            type="button"
            onClick={() => detectColor(imageId)}
            className="p-1 bg-logo-orange-pale-companion rounded-full"
          >
            <BeakerIcon className="w-4 h-4 stroke-logo-orange-border" />
          </button>
        </div>
      </legend>

      {color && color.length > 0 ? (
        <div className="space-y-2 p-2">
          <div className="flex flex-wrap gap-3">
            {color.map((hex, index) => {
              return (
                <div
                  key={`${hex}-${index}`}
                  className="flex flex-col items-center gap-2 group"
                >
                  <button
                    type="button"
                    onClick={() => removeColor(index)}
                    className="w-6 h-6 rounded-full shadow-md border-2 border-gray-200 transition-all hover:scale-110 relative"
                    style={{
                      backgroundColor: hex
                    }}
                    title={`${hex} - Click to remove`}
                  >
                    <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </div>
                  </button>
                  <span className="text-xs text-gray-500 font-mono">{hex}</span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <>
          {loading ? (
            <Spinner />
          ) : (
            <div className="text-sm text-gray-500">No colors detected</div>
          )}
        </>
      )}
    </fieldset>
  );
};

export default ColorDetecter;
