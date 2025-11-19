'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';

export interface AutoCompleteOption<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

interface AutoCompleteProps<T = string> {
  options: AutoCompleteOption<T>[];
  value?: T | T[] | null;
  onChange?: (value: T | T[] | null) => void;
  placeholder?: string;
  name?: string;
  disabled?: boolean;
  loading?: boolean;
  multiple?: boolean;
  className?: string;
  emptyMessage?: string;
}

export default function AutoComplete<T = string>({
  options,
  value,
  onChange,
  placeholder = 'Type to search...',
  name,
  disabled = false,
  loading = false,
  multiple = false,
  className = '',
  emptyMessage = 'No options found'
}: AutoCompleteProps<T>) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Get selected options from value prop
  const getSelectedOptions = useCallback(() => {
    if (!value) return [];

    const values = Array.isArray(value) ? value : [value];
    return options.filter((opt) => values.includes(opt.value));
  }, [value, options]);

  const selectedOptions = getSelectedOptions();

  // Filter options based on input value
  const filteredOptions = options.filter((option) => {
    // Filter out already selected options in multiple mode
    if (multiple && selectedOptions.some((sel) => sel.value === option.value)) {
      return false;
    }

    // Filter by search term
    if (inputValue) {
      return option.label.toLowerCase().includes(inputValue.toLowerCase());
    }

    return true;
  });

  // Update input value when single value changes
  useEffect(() => {
    if (!multiple && selectedOptions.length > 0) {
      setInputValue(selectedOptions[0].label);
    } else if (!multiple && selectedOptions.length === 0) {
      setInputValue('');
    }
  }, [selectedOptions, multiple]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setFocusedIndex(-1);
        // Reset input value if no selection in single mode
        if (!multiple && selectedOptions.length === 0) {
          setInputValue('');
        }
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open, multiple, selectedOptions]);

  // Scroll focused item into view
  useEffect(() => {
    if (focusedIndex >= 0 && listRef.current) {
      const item = listRef.current.children[focusedIndex] as HTMLElement;
      if (item) {
        item.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [focusedIndex]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setOpen(true);
    setFocusedIndex(-1);
  };

  const handleInputFocus = () => {
    if (!disabled) {
      setOpen(true);
    }
  };

  const handleOptionClick = (option: AutoCompleteOption<T>) => {
    if (option.disabled) return;

    if (multiple) {
      const currentValues = Array.isArray(value) ? value : value ? [value] : [];
      const newValue = [...currentValues, option.value];
      onChange?.(newValue);
      setInputValue('');
      setFocusedIndex(-1);
      // Keep dropdown open in multiple mode
      inputRef.current?.focus();
    } else {
      onChange?.(option.value);
      setInputValue(option.label);
      setOpen(false);
      setFocusedIndex(-1);
    }
  };

  const handleRemoveOption = (optionValue: T, e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();

    if (multiple && Array.isArray(value)) {
      const newValue = value.filter((v) => v !== optionValue);
      onChange?.(newValue);
    } else {
      onChange?.(null);
      setInputValue('');
    }

    inputRef.current?.focus();
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(null);
    setInputValue('');
    setOpen(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setOpen(true);
        setFocusedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;

      case 'ArrowUp':
        e.preventDefault();
        setOpen(true);
        setFocusedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;

      case 'Enter':
        e.preventDefault();
        if (open && focusedIndex >= 0 && filteredOptions[focusedIndex]) {
          handleOptionClick(filteredOptions[focusedIndex]);
        }
        break;

      case 'Escape':
        e.preventDefault();
        setOpen(false);
        setFocusedIndex(-1);
        break;

      case 'Backspace':
        if (multiple && !inputValue && selectedOptions.length > 0) {
          handleRemoveOption(selectedOptions[selectedOptions.length - 1].value);
        }
        break;

      default:
        break;
    }
  };

  const showClearButton = !disabled && selectedOptions.length > 0 && !multiple;

  return (
    <div ref={containerRef} className={`relative w-full`}>
      {/* Input Container with proper wrapping */}
      <div className="relative flex flex-wrap items-start gap-1.5 w-full py-1">
        {/* Selected Tags (Multiple Mode) */}
        {multiple &&
          selectedOptions.map((option) => (
            <span
              key={String(option.value)}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-logo-orange-border/10 text-logo-orange-border rounded-full text-xs font-medium border border-logo-orange-border/20 transition-colors hover:bg-logo-orange-border/15"
            >
              <span>{option.label}</span>
              <button
                type="button"
                onClick={(e) => handleRemoveOption(option.value, e)}
                className="hover:bg-logo-orange-border/25 rounded-full p-0.5 transition-colors inline-flex items-center justify-center"
                tabIndex={-1}
              >
                <XMarkIcon className="w-3 h-3" />
              </button>
            </span>
          ))}

        {/* Hidden input for form submission */}
        {name && (
          <input
            type="hidden"
            name={name}
            value={
              multiple
                ? Array.isArray(value)
                  ? value.join(',')
                  : ''
                : (value as string) || ''
            }
          />
        )}

        {/* Icons - always on the right */}
        <div className="w-full flex items-center justify-end gap-0.5">
          {showClearButton && (
            <button
              type="button"
              onClick={handleClearAll}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              tabIndex={-1}
            >
              <XMarkIcon className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            tabIndex={-1}
          >
            <ChevronDownIcon
              className={`w-4 h-4 text-gray-400 transition-all ${
                open ? 'rotate-180 text-gray-600' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Dropdown */}
      {open && !disabled && (
        <ul
          ref={listRef}
          className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-auto py-1"
          style={{
            boxShadow:
              '0 10px 40px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.08)'
          }}
        >
          {loading ? (
            <li className="px-4 py-2.5 text-sm text-gray-500 text-center">
              <span className="loading loading-spinner loading-sm mr-2"></span>
              Loading...
            </li>
          ) : filteredOptions.length === 0 ? (
            <li className="px-4 py-2.5 text-sm text-gray-500 text-center">
              {emptyMessage}
            </li>
          ) : (
            filteredOptions.map((option, index) => {
              const isSelected = selectedOptions.some(
                (sel) => sel.value === option.value
              );
              const isFocused = index === focusedIndex;

              return (
                <li
                  key={String(option.value)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleOptionClick(option);
                  }}
                  onMouseEnter={() => setFocusedIndex(index)}
                  onMouseLeave={() => setFocusedIndex(-1)}
                  className={`px-4 py-2.5 text-sm cursor-pointer transition-all duration-150 ${
                    isFocused
                      ? 'bg-logo-orange-border text-white'
                      : isSelected
                      ? 'bg-logo-orange-border/10 text-logo-orange-border font-medium'
                      : 'hover:bg-gray-50 text-gray-700'
                  } ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {option.label}
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}
