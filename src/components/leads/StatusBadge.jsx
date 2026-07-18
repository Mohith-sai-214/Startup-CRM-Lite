import React from 'react'; // Import React core module

/**
 * JSDoc comments explaining StatusBadge component props:
 * @param {Object} props - Component properties
 * @param {string} props.status - The lead's current status string
 * @returns {React.JSX.Element} Pill-shaped colored badge component representing status
 */
export default function StatusBadge({ status }) {
  // Define a mapping of statuses to specific Tailwind style configurations (background, border, text colors)
  const colors = {
    'New': 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-gray-800/40 dark:text-gray-300 dark:border-gray-700/60',
    'Contacted': 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/50',
    'Meeting Scheduled': 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/50',
    'Proposal Sent': 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50',
    'Won': 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/50',
    'Lost': 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/50',
  };

  // Fallback styling if status string doesn't match any pre-configured options
  const defaultColor = 'bg-slate-50 text-slate-600 border-slate-250 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700';
  
  // Resolve active style string based on mapping or fallback
  const resolvedClass = colors[status] || defaultColor;

  return (
    // Pill-shaped container styled with subtle borders and bold text
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide border ${resolvedClass}`}>
      {status}
    </span>
  );
}
