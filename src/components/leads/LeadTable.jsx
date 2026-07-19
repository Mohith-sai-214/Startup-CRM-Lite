import React from 'react'; // Import React core module
import { Edit, Trash2 } from 'lucide-react'; // Import Lucide icons
import StatusBadge from './StatusBadge'; // Import StatusBadge component for colored pill badges

/**
 * JSDoc comments explaining LeadTable component props:
 * @param {Object} props - Component properties
 * @param {Array<Object>} props.leads - Array of lead objects to display
 * @param {Function} props.onEdit - Handler callback when the edit button is clicked on a row
 * @param {Function} props.onDelete - Handler callback when the delete button is clicked on a row
 * @param {Function} props.onRowClick - Handler callback when clicking a lead row to show its side drawer
 * @returns {React.JSX.Element} The tabular display of all CRM leads
 */
export default function LeadTable({ leads = [], onEdit, onDelete, onRowClick }) {
  return (
    // Table shell with rounded headers and shadows
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
      
      {/* Scrollable container for mobile tables layout compatibility */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs text-slate-600 dark:text-gray-400">
          
          {/* Table headers definitions */}
          <thead className="bg-slate-50 dark:bg-gray-850 border-b border-gray-200 dark:border-gray-700 font-semibold text-slate-700 dark:text-gray-300">
            <tr>
              <th className="py-3 px-4">Lead Name</th>
              <th className="py-3 px-4">Company</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Email Address</th>
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4">Source</th>
              <th className="py-3 px-4 text-right">Deal Value</th>
              <th className="py-3 px-4">Date Added</th>
              <th className="py-3 px-4 w-24 text-right">Actions</th>
            </tr>
          </thead>

          {/* Table body entries list */}
          <tbody className="divide-y divide-slate-150 dark:divide-gray-700">
            {leads.map((lead) => (
              <tr
                key={lead.id}
                onClick={() => onRowClick(lead)} // Click handler opening right drawer slider
                className="hover:bg-slate-50/70 dark:hover:bg-gray-750/50 transition-colors group cursor-pointer"
              >
                {/* 1. Client Contact Name */}
                <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                  {lead.name}
                </td>

                {/* 2. Company corporate identity */}
                <td className="py-3 px-4 text-slate-500 dark:text-gray-400">
                  {lead.company}
                </td>

                {/* 3. Status colorized badge */}
                <td className="py-3 px-4">
                  <StatusBadge status={lead.status} />
                </td>

                {/* 4. Contact Email Address */}
                <td className="py-3 px-4">
                  <a
                    href={`mailto:${lead.email}`}
                    onClick={(e) => e.stopPropagation()} // Prevent drawer launch when click mailto link
                    className="hover:underline hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    {lead.email}
                  </a>
                </td>

                {/* 5. Contact phone details */}
                <td className="py-3 px-4 text-slate-500 dark:text-gray-400">
                  {lead.phone || '—'}
                </td>

                {/* 6. Lead marketing channel source */}
                <td className="py-3 px-4 font-medium">
                  {lead.source}
                </td>

                {/* 7. Deal Value sizes */}
                <td className="py-3 px-4 text-right font-bold text-slate-800 dark:text-gray-300">
                  ${(lead.value || 0).toLocaleString()}
                </td>

                {/* 8. Creation Date Added */}
                <td className="py-3 px-4 text-[10px] text-slate-400 dark:text-gray-500 font-medium">
                  {lead.createdAt}
                </td>

                {/* 9. Actions overlays */}
                <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Pencil Edit button */}
                    <button
                      onClick={() => onEdit(lead)} // Open modal prepopulated with active lead data
                      className="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-md cursor-pointer transition-colors"
                      title="Edit Lead"
                    >
                      <Edit size={13} />
                    </button>
                    
                    {/* Trash Delete button */}
                    <button
                      onClick={() => onDelete(lead.id)} // Trigger leads list deletion
                      className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-md cursor-pointer transition-colors"
                      title="Delete Lead"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {/* Empty database indicators */}
            {leads.length === 0 && (
              <tr>
                <td colSpan="9" className="py-8 text-center text-slate-400 dark:text-gray-500">
                  No leads enrolled matching current criteria.
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

    </div>
  );
}
