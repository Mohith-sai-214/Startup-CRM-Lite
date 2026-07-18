import React from 'react'; // Import React core module

/**
 * JSDoc comments explaining FilterBar component props:
 * @param {Object} props - The component properties
 * @param {string} props.activeFilter - The active filter status string (e.g. "All" or "Won")
 * @param {Function} props.onFilterChange - Callback handler triggered when clicking on a tab
 * @param {Array<Object>} props.leads - Array of lead objects to dynamically calculate counts
 * @returns {React.JSX.Element} Dynamic horizontal status tab filter list
 */
export default function FilterBar({ activeFilter, onFilterChange, leads = [] }) {
  // Available status selectors mapping
  const filterOptions = ['All', 'New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'];

  /**
   * Helper function to dynamically count lead totals matching target status
   * @param {string} status - Target status string
   * @returns {number} The occurrences count
   */
  const getCount = (status) => {
    if (status === 'All') return leads.length; // Return full array length for "All"
    return leads.filter((lead) => lead.status === status).length; // Filter match count
  };

  return (
    // Horizontal scrollable flexbox wrapper supporting layout wraps on small viewports
    <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-x-auto select-none">
      {filterOptions.map((option) => {
        const isActive = activeFilter === option; // Active route check
        const count = getCount(option); // Fetch quantity counts

        return (
          <button
            key={option}
            type="button"
            onClick={() => onFilterChange(option)} // Fire filter updates callback
            // Dynamic theme styling highlight using conditional tailwind rules
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all duration-150 cursor-pointer shrink-0 ${
              isActive
                ? 'bg-blue-600 text-white shadow-2xs' // Active primary blue fill styling
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800' // Inactive hover highlights
            }`}
          >
            <span>{option}</span>
            {/* Lead quantity count indicator tag */}
            <span className={`ml-1.5 text-[10px] ${isActive ? 'text-blue-100' : 'text-slate-400 dark:text-gray-500'}`}>
              ({count})
            </span>
          </button>
        );
      })}
    </div>
  );
}
