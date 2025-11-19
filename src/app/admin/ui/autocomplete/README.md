# AutoComplete Component

A fully functional autocomplete component that follows Material UI's Autocomplete API pattern, styled with Tailwind CSS and DaisyUI.

## Features

✅ Single and multi-select modes  
✅ Controlled component (value prop)  
✅ Keyboard navigation (Arrow keys, Enter, Escape, Backspace)  
✅ Search/filter functionality  
✅ Click outside to close  
✅ Loading state  
✅ Disabled state  
✅ Empty state customization  
✅ Tag chips for multi-select  
✅ Clear button  
✅ TypeScript support with generics  

## Basic Usage

### Single Select

```tsx
import AutoComplete from '@/app/admin/ui/autocomplete/AutoComplete';
import { useState } from 'react';

function MyComponent() {
  const [value, setValue] = useState<string | null>(null);

  return (
    <label className="input w-full flex items-center gap-2">
      <AutoComplete
        options={[
          { value: '1', label: 'Option 1' },
          { value: '2', label: 'Option 2' },
          { value: '3', label: 'Option 3' },
        ]}
        value={value}
        onChange={(newValue) => setValue(newValue as string)}
        placeholder="Select an option"
      />
    </label>
  );
}
```

### Multi Select

```tsx
import AutoComplete from '@/app/admin/ui/autocomplete/AutoComplete';
import { useState } from 'react';

function MyComponent() {
  const [values, setValues] = useState<string[]>([]);

  return (
    <label className="input w-full flex items-center gap-2">
      <AutoComplete
        options={[
          { value: '1', label: 'Option 1' },
          { value: '2', label: 'Option 2' },
          { value: '3', label: 'Option 3' },
        ]}
        value={values}
        onChange={(newValue) => {
          setValues(
            Array.isArray(newValue) ? newValue : newValue ? [newValue] : []
          );
        }}
        placeholder="Select options"
        multiple={true}
      />
    </label>
  );
}
```

### With Icon (Your Current Usage Pattern)

```tsx
import AutoComplete from '@/app/admin/ui/autocomplete/AutoComplete';
import { TagIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

function MyComponent() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend">Tags</legend>
      {/* Important: Use items-start and min-h for proper wrapping */}
      <label className="input w-full flex items-start gap-2 min-h-[3rem]">
        <TagIcon className="w-4 h-4 flex-shrink-0 mt-2" />
        <AutoComplete
          options={productTags.map((tag) => ({
            value: tag.id,
            label: tag.name
          }))}
          value={selectedTags}
          onChange={(value) => {
            setSelectedTags((value as string[]) || []);
          }}
          placeholder="Select tags"
          multiple={true}
        />
      </label>
    </fieldset>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `AutoCompleteOption<T>[]` | **required** | Array of options to display |
| `value` | `T \| T[] \| null` | `null` | Current value(s) - single value for single-select, array for multi-select |
| `onChange` | `(value: T \| T[] \| null) => void` | - | Callback when value changes |
| `placeholder` | `string` | `'Type to search...'` | Placeholder text |
| `name` | `string` | - | Input name attribute |
| `disabled` | `boolean` | `false` | Disable the component |
| `loading` | `boolean` | `false` | Show loading state |
| `multiple` | `boolean` | `false` | Enable multi-select mode |
| `className` | `string` | `''` | Additional CSS classes |
| `emptyMessage` | `string` | `'No options found'` | Message when no options match |

## AutoCompleteOption Interface

```typescript
interface AutoCompleteOption<T = string> {
  value: T;        // The actual value
  label: string;   // Display text
  disabled?: boolean;  // Optional: disable this option
}
```

## Keyboard Navigation

- **Arrow Down/Up**: Navigate through options
- **Enter**: Select the focused option
- **Escape**: Close dropdown
- **Backspace**: (Multi-select only) Remove the last selected tag when input is empty

## Styling

The component is designed to work within DaisyUI's `input` class wrapper:

```tsx
{/* Single select */}
<label className="input w-full flex items-center gap-2">
  <Icon /> {/* Optional icon */}
  <AutoComplete {...props} />
</label>

{/* Multi-select - use items-start for proper wrapping */}
<label className="input w-full flex items-start gap-2 min-h-[3rem]">
  <Icon className="flex-shrink-0 mt-2" /> {/* Optional icon */}
  <AutoComplete {...props} multiple={true} />
</label>
```

**Important for Multi-Select:**
- Use `items-start` instead of `items-center` to allow tags to wrap properly
- Add `min-h-[3rem]` to set a minimum height
- Position icons with `mt-2` to align with the first row of tags
- The container will automatically expand vertically as more tags are added

The dropdown uses Tailwind CSS and appears below the input with proper z-index handling.

## API Comparison with Material UI

This component follows Material UI's Autocomplete API:

| Material UI | This Component | Notes |
|-------------|----------------|-------|
| `options` | `options` | ✅ Same |
| `value` | `value` | ✅ Same |
| `onChange` | `onChange` | ✅ Same signature |
| `multiple` | `multiple` | ✅ Same |
| `loading` | `loading` | ✅ Same |
| `disabled` | `disabled` | ✅ Same |
| `placeholder` | `placeholder` | ✅ Same |
| `getOptionLabel` | - | Use `label` in option object |
| `renderInput` | - | Wrap with `<label className="input">` |

## Tips

1. **Always use controlled component pattern**: Pass `value` and `onChange` props
2. **Handle null values**: `onChange` can return `null` when cleared
3. **Multi-select type handling**: In multi-select mode, `onChange` always returns an array or null
4. **Icon positioning**: Use `flex-shrink-0 mt-2` on icons in multi-select for proper alignment
5. **Wrapping behavior**: Use `items-start` on the wrapper label for multi-select to allow proper tag wrapping
6. **Container expansion**: The component automatically expands vertically to accommodate multiple rows of tags

## Examples

See `AutoComplete.example.tsx` for complete working examples.

