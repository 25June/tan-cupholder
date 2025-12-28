'use client';

import { useState } from 'react';
import { PRODUCT_COLORS } from '@/models/productColor';

interface PrimaryColorPickerProps {
  defaultColor?: string;
  onChange?: (color: string) => void;
}

const PrimaryColorPicker = ({
  defaultColor = '',
  onChange
}: PrimaryColorPickerProps) => {
  const [selectedColors, setSelectedColors] = useState<string[]>(
    JSON.parse(defaultColor || '[]') as string[]
  ); // JSON array of color hex values

  const handleColorSelect = (hexColor: string) => {
    if (selectedColors.includes(hexColor)) {
      const newColors = selectedColors.filter((color) => color !== hexColor);
      setSelectedColors(newColors);
      onChange?.(JSON.stringify(newColors));
      return;
    }
    const newColors = [...selectedColors, hexColor];
    setSelectedColors(newColors);
    onChange?.(JSON.stringify(newColors));
  };

  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend w-full relative">
        Searchable Colors
      </legend>

      <div className="space-y-2 p-2">
        <div className="flex flex-wrap gap-3">
          {PRODUCT_COLORS.map((color) => {
            const isSelected = selectedColors.includes(color.hex);
            return (
              <div
                key={color.hex}
                className="flex flex-col items-center gap-2 group"
              >
                <button
                  type="button"
                  onClick={() => handleColorSelect(color.hex)}
                  className={`w-6 h-6 rounded-full shadow-md border-2 transition-all hover:scale-110 ${
                    isSelected
                      ? 'border-logo-orange-border ring-2 ring-logo-orange-border ring-offset-2'
                      : 'border-gray-200'
                  }`}
                  style={{
                    backgroundColor: color.hex
                  }}
                  title={`${color.name} (${color.hex})`}
                >
                  {isSelected && (
                    <div className="flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white drop-shadow-lg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </fieldset>
  );
};

export default PrimaryColorPicker;
