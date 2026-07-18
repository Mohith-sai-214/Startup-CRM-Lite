import React from 'react'; // Import React library
import { PlusCircle, Database, FileSpreadsheet } from 'lucide-react'; // Import action icon symbols from lucide-react

/**
 * JSDoc comments explaining QuickActions component props:
 * @param {Object} props - Component properties
 * @param {Function} props.onAddLead - Handler callback to trigger the lead creation modal
 * @param {Function} props.onViewLeads - Handler callback to switch route views to leads pipeline
 * @param {Function} props.onExportData - Handler callback to export active database sheets
 * @returns {React.JSX.Element} The Quick Actions section component holding key workspace CTAs
 */
export default function QuickActions({ onAddLead, onViewLeads, onExportData }) {
  return (
    // Outer card container styled with flex boundaries
    <div className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
      
      {/* Header labels */}
      <div className="mb-4">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Quick Workspace Actions</h3>
        <p className="text-[11px] text-gray-500 dark:text-gray-400">Perform standard CRM updates immediately</p>
      </div>

      {/* Grid container holding three call-to-actions buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Primary Action: Add Lead Modal Trigger */}
        <button
          onClick={onAddLead} // Click callback maps to layout modal toggles
          className="flex items-center justify-center gap-2 p-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] rounded-lg shadow-2xs hover:shadow-sm transition-all cursor-pointer"
        >
          <PlusCircle size={15} />
          <span>Add New Lead</span>
        </button>

        {/* Secondary Action: View Leads Pipeline Redirect */}
        <button
          onClick={onViewLeads} // Click callback maps to router redirects
          className="flex items-center justify-center gap-2 p-3 text-xs font-bold text-gray-700 bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:text-gray-900 active:scale-[0.98] rounded-lg transition-all dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white cursor-pointer"
        >
          <Database size={15} />
          <span>View All Leads</span>
        </button>

        {/* Tertiary Action: Export Sheet Data */}
        <button
          onClick={onExportData} // Click callback maps to file spreadsheet export handlers
          className="flex items-center justify-center gap-2 p-3 text-xs font-bold text-gray-700 bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:text-gray-900 active:scale-[0.98] rounded-lg transition-all dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white cursor-pointer"
        >
          <FileSpreadsheet size={15} />
          <span>Export Data</span>
        </button>

      </div>

    </div>
  );
}
