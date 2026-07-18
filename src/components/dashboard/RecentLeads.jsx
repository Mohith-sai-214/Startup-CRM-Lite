import React from 'react'; // Import React library
import StatusBadge from '../leads/StatusBadge'; // Import StatusBadge component

/**
 * JSDoc comments explaining RecentLeads component props:
 * @param {Object} props - Component properties
 * @param {Array<Object>} props.leads - Array of CRM lead objects
 * @returns {React.JSX.Element} The tabular widget containing the 5 most recent lead profiles
 */
export default function RecentLeads({ leads = [] }) {
  // Sort leads by creation date descending and slice the top 5 elements
  const recentLeads = [...leads]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Chronological sort (newest first)
    .slice(0, 5); // Slice top 5 leads

  return (
    // Card container matching dashboard grids
    <div className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden flex flex-col">
      
      {/* Header labels */}
      <div className="mb-4">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Recent Lead Enrolments</h3>
        <p className="text-[11px] text-gray-500 dark:text-gray-400">The last 5 lead profiles added to the database</p>
      </div>

      {/* Responsive table viewport wrapper */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          {/* Table head headers */}
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 font-semibold">
              <th className="py-2.5 px-3">Lead Name</th>
              <th className="py-2.5 px-3">Company</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3">Date Added</th>
            </tr>
          </thead>
          
          {/* Table body entries list */}
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/40">
            {recentLeads.length > 0 ? (
              recentLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                  {/* Lead person contact name */}
                  <td className="py-3 px-3 font-semibold text-gray-900 dark:text-gray-200 truncate max-w-[120px]">
                    {lead.name}
                  </td>
                  
                  {/* Company name */}
                  <td className="py-3 px-3 text-gray-500 dark:text-gray-400 truncate max-w-[140px]">
                    {lead.company}
                  </td>
                  
                  {/* Status badge element with color segmentation */}
                  <td className="py-3 px-3">
                    <StatusBadge status={lead.status} />
                  </td>

                  {/* Creation Date added */}
                  <td className="py-3 px-3 text-gray-400 dark:text-gray-500 font-medium">
                    {lead.createdAt}
                  </td>
                </tr>
              ))
            ) : (
              // Fallback block when no leads exist in state
              <tr>
                <td colSpan="4" className="py-6 text-center text-gray-400 dark:text-gray-500">
                  No recent leads enrolled yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
