'use client';

import ColorThief from 'colorthief';
import { useCallback, useState, useEffect } from 'react';
import { BeakerIcon } from '@heroicons/react/24/outline';

interface ColorDetecterProps {
  imageId: string;
}

const ColorDetecter = ({ imageId }: ColorDetecterProps) => {
  const [color, setColor] = useState<Array<[number, number, number]> | null>(
    null
  );

  const removeColor = useCallback((index: number) => {
    setColor((prevColors) => {
      if (!prevColors) return null;
      const newColors = prevColors.filter((_, i) => i !== index);
      return newColors.length > 0 ? newColors : null;
    });
  }, []);

  const detectColor = useCallback((id: string) => {
    if (!id) return;

    const colorThief = new ColorThief();
    const img = document.querySelector(`#${id}`) as HTMLImageElement;
    if (!img) return;

    if (img.complete) {
      const colors = colorThief.getPalette(img);
      setColor(colors);
    } else {
      img?.addEventListener('load', () => {
        const colors = colorThief.getPalette(img);
        setColor(colors);
      });
    }
  }, []);

  useEffect(() => {
    if (imageId) {
      detectColor(imageId);
    }
  }, [imageId, detectColor]);

  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend w-full relative">
        Color Palette
        {color && color.length > 0 ? `(${color?.length} colors)` : ''}
        <div className="absolute top-0 right-0">
          <button
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
            {color.map((rgb, index) => {
              const hexColor = rgb
                .map((c) => c.toString(16).padStart(2, '0'))
                .join('');
              return (
                <div
                  key={`${hexColor}-${index}`}
                  className="flex flex-col items-center gap-2 group"
                >
                  <button
                    type="button"
                    onClick={() => removeColor(index)}
                    className="w-12 h-12 rounded-full shadow-md border-2 border-gray-200 transition-all hover:scale-110 relative"
                    style={{
                      backgroundColor: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
                    }}
                    title={`rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]}) - Click to remove`}
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
                  <span className="text-xs text-gray-500 font-mono">
                    #{hexColor}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-sm text-gray-500">No colors detected</div>
      )}
    </fieldset>
  );
};

export default ColorDetecter;
