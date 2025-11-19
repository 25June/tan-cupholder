/**
 * AutoComplete Component Usage Examples
 *
 * This component follows Material UI's Autocomplete API pattern
 */

import { useState } from 'react';
import AutoComplete from './AutoComplete';

// Sample options
const countries = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'jp', label: 'Japan' },
  { value: 'cn', label: 'China' }
];

export function SingleSelectExample() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  return (
    <div className="p-4">
      <h3 className="text-lg font-medium mb-2">Single Select</h3>
      <label className="input w-full flex items-center gap-2">
        <AutoComplete
          options={countries}
          value={selectedCountry}
          onChange={(value) => setSelectedCountry(value as string)}
          placeholder="Select a country"
        />
      </label>
      <p className="mt-2 text-sm text-gray-600">
        Selected: {selectedCountry || 'None'}
      </p>
    </div>
  );
}

export function MultiSelectExample() {
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

  return (
    <div className="p-4">
      <h3 className="text-lg font-medium mb-2">Multi Select</h3>
      <label className="input w-full flex items-center gap-2">
        <AutoComplete
          options={countries}
          value={selectedCountries}
          onChange={(value) => {
            setSelectedCountries(
              Array.isArray(value) ? value : value ? [value] : []
            );
          }}
          placeholder="Select countries"
          multiple={true}
        />
      </label>
      <p className="mt-2 text-sm text-gray-600">
        Selected:{' '}
        {selectedCountries.length > 0 ? selectedCountries.join(', ') : 'None'}
      </p>
    </div>
  );
}

export function WithIconExample() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  return (
    <div className="p-4">
      <h3 className="text-lg font-medium mb-2">With Icon (Like your usage)</h3>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Country</legend>
        <label className="input w-full flex items-center gap-2">
          {/* Your icon here */}
          <svg
            className="w-4 h-4 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <AutoComplete
            options={countries}
            value={selectedCountry}
            onChange={(value) => setSelectedCountry(value as string)}
            placeholder="Select a country"
          />
        </label>
      </fieldset>
    </div>
  );
}

export function DisabledExample() {
  return (
    <div className="p-4">
      <h3 className="text-lg font-medium mb-2">Disabled State</h3>
      <label className="input w-full flex items-center gap-2">
        <AutoComplete
          options={countries}
          value="us"
          onChange={() => {}}
          placeholder="Select a country"
          disabled={true}
        />
      </label>
    </div>
  );
}

export function LoadingExample() {
  return (
    <div className="p-4">
      <h3 className="text-lg font-medium mb-2">Loading State</h3>
      <label className="input w-full flex items-center gap-2">
        <AutoComplete
          options={[]}
          value={null}
          onChange={() => {}}
          placeholder="Loading..."
          loading={true}
        />
      </label>
    </div>
  );
}
