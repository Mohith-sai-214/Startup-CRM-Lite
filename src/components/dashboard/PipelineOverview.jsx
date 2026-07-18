import React from 'react'; // Import React library

/**
 * JSDoc comments explaining PipelineOverview component props:
 * @param {Object} props - Component properties
 * @param {Array<Object>} props.leads - Array of CRM lead objects to segment
 * @returns {React.JSX.Element} The segmented horizontal pipeline overview bar component
 */
export default function PipelineOverview({ leads = [] }) {
  // Define standard statuses matching CRM workflow configurations
  const statuses = ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'];

  // Map each status to specific Tailwind color rules for horizontal bars and legends
  const statusColors = {
    'New': { bg: 'bg-slate-400', dot: 'bg-slate-400', text: 'text-slate-550 dark:text-gray-400' },
    'Contacted': { bg: 'bg-blue-500', dot: 'bg-blue-500', text: 'text-blue-600 dark:text-blue-400' },
    'Meeting Scheduled': { bg: 'bg-purple-500', dot: 'bg-purple-500', text: 'text-purple-600 dark:text-purple-400' },
    'Proposal Sent': { bg: 'bg-amber-500', dot: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400' },
    'Won': { bg: 'bg-green-500', dot: 'bg-green-500', text: 'text-green-600 dark:text-green-400' },
    'Lost': { bg: 'bg-red-500', dot: 'bg-red-500', text: 'text-red-600 dark:text-red-400' },
  };

  // Compute occurrences of leads in each status
  const statusCounts = statuses.reduce((acc, status) => {
    acc[status] = leads.filter((lead) => lead.status === status).length; // Filter by status matches
    return acc;
  }, {});

  const totalLeads = leads.length; // Total length reference for percentage divisions

  return (
    // Outer card container styled with responsive layouts
    <div className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
      
      {/* Header labels explaining the widget */}
      <div className="mb-4">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Pipeline Funnel Distribution</h3>
        <p className="text-[11px] text-gray-500 dark:text-gray-400">
          Proportion of leads active across standard CRM statuses
        </p>
      </div>

      {/* Main Segmented Progress Bar */}
      <div className="w-full h-3.5 bg-gray-100 dark:bg-gray-700 rounded-full flex overflow-hidden shrink-0">
        {totalLeads > 0 ? (
          statuses.map((status) => {
            const count = statusCounts[status]; // Retrieve count
            const pct = (count / totalLeads) * 100; // Calculate proportion percentage
            if (count === 0) return null; // Omit empty segments

            return (
              <div
                key={status}
                style={{ width: `${pct}%` }} // Dynamic width matching proportions
                className={`h-full ${statusColors[status].bg} hover:brightness-95 transition-all`} // Theme-segmented background
                title={`${status}: ${count} leads (${pct.toFixed(0)}%)`} // Hover accessibility label
              />
            );
          })
        ) : (
          // Fallback blank progress bar if leads list is empty
          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-[9px] text-gray-400 dark:text-gray-500">No leads in pipeline database</span>
          </div>
        )}
      </div>

      {/* Grid Legend showing percentage stats and details */}
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
        {statuses.map((status) => {
          const count = statusCounts[status]; // Count reference
          const pct = totalLeads > 0 ? ((count / totalLeads) * 100).toFixed(0) : 0; // Calculate percentage
          
          return (
            <div key={status} className="flex flex-col">
              {/* Dot indicator matching status color */}
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${statusColors[status].dot} shrink-0`} />
                <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400">{status}</span>
              </div>
              
              {/* Quantities and percentage descriptions */}
              <div className="mt-1 flex items-baseline gap-1.5 pl-3.5">
                <span className="text-xs font-bold text-gray-900 dark:text-white">{count}</span>
                <span className="text-[9px] text-gray-400 dark:text-gray-500 font-normal">({pct}%)</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
