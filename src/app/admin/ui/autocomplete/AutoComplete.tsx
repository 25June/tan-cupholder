import React, { useEffect } from 'react';
import { useMultipleSelection, useCombobox } from 'downshift';
import clsx from 'clsx';

export interface AutoCompleteOption<T = string> {
  value: T;
  label: string;
}

interface AutoCompleteProps<T = string> {
  options: AutoCompleteOption<T>[];
  value?: T[];
  onChange: (value: T[]) => void;
  placeholder?: string;
}

export default function AutoComplete<T = string>({
  options,
  value,
  onChange,
  placeholder
}: AutoCompleteProps<T>) {
  function getFilteredOptions(
    selectedItems: AutoCompleteOption<T>[],
    inputValue: string
  ) {
    const lowerCasedInputValue = inputValue.toLowerCase();

    return options.filter(function filterOption(option: AutoCompleteOption<T>) {
      return (
        !selectedItems.includes(option) &&
        (option.label.toLowerCase().includes(lowerCasedInputValue) ||
          String(option.value).toLowerCase().includes(lowerCasedInputValue))
      );
    });
  }

  function MultipleComboBox() {
    const [inputValue, setInputValue] = React.useState('');
    const [selectedItems, setSelectedItems] = React.useState<
      AutoCompleteOption<T>[]
    >([]);
    const items = React.useMemo(
      () => getFilteredOptions(selectedItems, inputValue),
      [selectedItems, inputValue]
    );

    useEffect(() => {
      if (value && options.length > 0) {
        setSelectedItems(
          options.filter((option) => value.includes(option.value))
        );
      }
    }, [value, options]);
    const { getSelectedItemProps, getDropdownProps, removeSelectedItem } =
      useMultipleSelection({
        selectedItems,
        onStateChange({ selectedItems: newSelectedItems, type }) {
          switch (type) {
            case useMultipleSelection.stateChangeTypes
              .SelectedItemKeyDownBackspace:
            case useMultipleSelection.stateChangeTypes
              .SelectedItemKeyDownDelete:
            case useMultipleSelection.stateChangeTypes.DropdownKeyDownBackspace:
            case useMultipleSelection.stateChangeTypes
              .FunctionRemoveSelectedItem:
              const updatedItems = newSelectedItems || [];
              setSelectedItems(updatedItems);
              onChange(updatedItems.map((item) => item.value));
              break;
            default:
              break;
          }
        }
      });
    const {
      isOpen,
      getToggleButtonProps,
      getMenuProps,
      getInputProps,
      highlightedIndex,
      getItemProps,
      selectedItem
    } = useCombobox({
      items,
      itemToString(item) {
        return item ? item.label : '';
      },
      defaultHighlightedIndex: 0, // after selection, highlight the first item.
      selectedItem: null,
      inputValue,
      stateReducer(state, actionAndChanges) {
        const { changes, type } = actionAndChanges;

        switch (type) {
          case useCombobox.stateChangeTypes.InputKeyDownEnter:
          case useCombobox.stateChangeTypes.ItemClick:
            return {
              ...changes,
              isOpen: true, // keep the menu open after selection.
              highlightedIndex: 0 // with the first option highlighted.
            };
          default:
            return changes;
        }
      },
      onStateChange({
        inputValue: newInputValue,
        type,
        selectedItem: newSelectedItem
      }) {
        switch (type) {
          case useCombobox.stateChangeTypes.InputKeyDownEnter:
          case useCombobox.stateChangeTypes.ItemClick:
          case useCombobox.stateChangeTypes.InputBlur:
            if (newSelectedItem) {
              const newItems = [...selectedItems, newSelectedItem];
              setSelectedItems(newItems);
              onChange(newItems.map((item) => item.value));
              setInputValue('');
            }
            break;

          case useCombobox.stateChangeTypes.InputChange:
            setInputValue(newInputValue || '');

            break;
          default:
            break;
        }
      }
    });

    return (
      <div className="w-full relative">
        <div
          tabIndex={0}
          className={clsx(
            'bg-white w-full flex gap-2 items-center p-1.5 border rounded-sm transition-colors outline-none',
            'border-gray-300', // default border
            'hover:border-gray-400', // border color on hover
            'focus:border-logo-orange focus:outline-logo-orange focus:outline-2 focus:outline-offset-[-2px]',
            'min-h-10' // match the height of other inputs (e.g., input, select ~48px = h-12)
          )}
        >
          <div className="gap-2 grow flex-wrap flex">
            {selectedItems.map((selectedItemForRender, index) => {
              return (
                <span
                  className="bg-gray-100 rounded-md px-1 focus:bg-red-400"
                  key={`selected-item-${index}`}
                  {...getSelectedItemProps({
                    selectedItem: selectedItemForRender,
                    index
                  })}
                >
                  {selectedItemForRender.label}
                  <span
                    className="px-1 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSelectedItem(selectedItemForRender);
                    }}
                  >
                    &#10005;
                  </span>
                </span>
              );
            })}
            <input
              className="grow outline-none"
              placeholder={placeholder}
              {...getInputProps(getDropdownProps({ preventKeyAction: isOpen }))}
            />
          </div>

          <div className="flex justify-end">
            <button
              aria-label="toggle menu"
              className="px-2 shrink-0"
              type="button"
              {...getToggleButtonProps()}
            >
              &#8595;
            </button>
          </div>
        </div>
        <ul
          className={`absolute w-full bg-white mt-1 shadow-md max-h-80 overflow-scroll p-0 z-10 ${
            !(isOpen && items.length) && 'hidden'
          }`}
          {...getMenuProps()}
        >
          {isOpen &&
            items.map((item, index) => (
              <li
                className={clsx(
                  highlightedIndex === index && 'bg-blue-300',
                  selectedItem === item && 'font-bold',
                  'py-2 px-3 shadow-sm flex flex-col'
                )}
                key={`${item.value}${index}`}
                {...getItemProps({ item, index })}
              >
                <span>{item.label}</span>
              </li>
            ))}
        </ul>
      </div>
    );
  }
  return <MultipleComboBox />;
}
