'use client';

import { useState } from 'react';
import { PRODUCT_COLORS } from '@/models/productColor';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface PrimaryColorPickerProps {
  defaultColor?: string;
  onChange?: (color: string) => void;
}

const ColorFilter = ({
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
    console.log(newColors);
    onChange?.(JSON.stringify(newColors));
  };

  const handleClearColors = () => {
    setSelectedColors([]);
    onChange?.('[]');
  };

  return (
    <div>
      <button
        className={`btn btn-soft ${
          selectedColors.length > 0 ? 'btn-primary' : 'btn-default'
        } btn-sm md:btn-md w-full relative transition-all duration-300`}
        popoverTarget="popover-filter-color-search"
        style={
          {
            anchorName: '--anchor-filter-color-search'
          } /* as React.CSSProperties */
        }
      >
        Colors
        {selectedColors.length > 0 && (
          <span className="text-sm text-white bg-logo-orange-border rounded-full px-2 py-1">
            {selectedColors.length}
          </span>
        )}
        <ChevronDownIcon className="w-4 h-4" />
      </button>

      <ul
        className="dropdown dropdown-end menu w-52 rounded-box bg-base-100 shadow-sm"
        popover="auto"
        id="popover-filter-color-search"
        style={
          {
            positionAnchor: '--anchor-filter-color-search'
          } /* as React.CSSProperties */
        }
      >
        <div className="flex flex-wrap gap-3">
          {PRODUCT_COLORS.map((color) => {
            const isSelected = selectedColors.includes(color.hex);

            return (
              <li key={color.hex}>
                <button
                  type="button"
                  onClick={() => handleColorSelect(color.hex)}
                  className={`w-4 h-4 rounded-full border-2 transition-all hover:scale-110 ${
                    isSelected
                      ? 'border-logo-orange-border ring-2 ring-logo-orange-border ring-offset-2'
                      : 'border-gray-200'
                  }`}
                  style={{
                    backgroundColor: color.hex
                  }}
                  title={`${color.name} (${color.hex})`}
                ></button>
              </li>
            );
          })}
          {selectedColors.length > 0 && (
            <button
              type="button"
              className="w-full text-center rounded-full transition-all hover:scale-110 text-sm text-logo-orange-border"
              onClick={handleClearColors}
            >
              Clear
            </button>
          )}
        </div>
      </ul>
    </div>
  );
};

export default ColorFilter;
