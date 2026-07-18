import React from 'react'; // Import React core module
import { Users, FilterX, PlusCircle } from 'lucide-react'; // Import icon markers from lucide-react

/**
 * JSDoc comments explaining EmptyState component props:
 * @param {Object} props - The component properties
 * @param {number} props.totalLeads - The overall size of leads database (to check if database is empty)
 * @param {number} props.filteredLeads - The computed leads count after filtering is applied
 * @param {Function} props.onClear - Handler callback reset filters to 'All' and clear query strings
 * @param {Function} props.onAddLead - Handler callback to open creation modal
 * @returns {React.JSX.Element} Friendly empty illustration card matching results states
 */
export default function EmptyState({ totalLeads, filteredLeads, onClear, onAddLead }) {
  // If the total database contains zero leads, display a database setup guide
  const isDatabaseEmpty = totalLeads === 0;

  return (
    // Outer centered layout containing icon badges
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xs animate-in fade-in duration-200">
      
      {/* Dynamic icon indicator matching reasons (empty filters vs empty database) */}
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 dark:bg-gray-900 border border-slate-100 dark:border-gray-700/50 mb-4">
        {isDatabaseEmpty ? (
          <Users className="text-slate-400 dark:text-gray-500" size={24} /> // Database empty icon
        ) : (
          <FilterX className="text-blue-500 dark:text-blue-400" size={24} /> // Filter query empty icon
        )}
      </div>

      {/* Main heading descriptions */}
      <h3 className="text-sm font-bold text-gray-900 dark:text-white">
        {isDatabaseEmpty ? 'Leads Database is Empty' : 'No Leads Found'}
      </h3>
      
      {/* Supporting paragraph text details */}
      <p className="mt-1.5 text-xs text-slate-400 dark:text-gray-500 max-w-xs leading-relaxed">
        {isDatabaseEmpty
          ? 'Get started by creating your first client lead profile in the workspace.'
          : 'No profiles match your current search terms or status filters. Try refining your queries.'}
      </p>

      {/* Action CTA link buttons */}
      <div className="mt-6">
        {isDatabaseEmpty ? (
          // Add Lead CTA button
          <button
            type="button"
            onClick={onAddLead}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs cursor-pointer transition-colors"
          >
            <PlusCircle size={14} />
            <span>Create First Lead</span>
          </button>
        ) : (
          // Clear Filters Link button
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline cursor-pointer"
          >
            Clear search filters & query
          </button>
        )}
      </div>

    </div>
  );
}
