import React from 'react'; // Import React core module
import { Search, X } from 'lucide-react'; // Import Lucide search and clear icons

/**
 * JSDoc comments explaining SearchBar component props:
 * @param {Object} props - The component properties
 * @param {string} props.value - The controlled text query value from parent state
 * @param {Function} props.onChange - Handler callback triggered on input text updates
 * @returns {React.JSX.Element} The controlled search bar input component
 */
export default function SearchBar({ value, onChange }) {
  return (
    // Relative wrapper container for icons overlays
    <div className="relative w-full">
      {/* Magnifying search glass icon overlays absolute left */}
      <Search
        className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500 pointer-events-none"
        size={16}
      />
      
      {/* Controlled Search text input */}
      <input
        type="text"
        value={value} // Controlled state value
        onChange={(e) => onChange(e.target.value)} // Trigger callback updates
        aria-label="Search leads by name, company, or email" // Accessibility labeling
        placeholder="Search by name, company, or email..." // Description placeholder
        className="w-full pl-9 pr-9 py-2 text-xs bg-slate-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-600 dark:focus:border-blue-500 transition-colors"
      />

      {/* Clear 'X' button overlays absolute right when text query exists */}
      {value && (
        <button
          type="button"
          onClick={() => onChange('')} // Clear search state
          className="absolute right-3 top-2 p-0.5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 rounded-md cursor-pointer transition-colors"
          title="Clear search"
          aria-label="Clear search input" // Accessibility action labels
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
