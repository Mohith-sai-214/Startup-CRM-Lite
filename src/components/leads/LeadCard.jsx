import React from 'react'; // Import React core library
import { Mail, Phone, Edit, Trash2, DollarSign, Globe } from 'lucide-react'; // Import icons from lucide-react
import StatusBadge from './StatusBadge'; // Import StatusBadge component to display colored badges

/**
 * JSDoc comments explaining LeadCard component props:
 * @param {Object} props - Component properties
 * @param {Object} props.lead - The lead object containing profile details
 * @param {Function} props.onEdit - Callback handler when the pencil edit icon is clicked
 * @param {Function} props.onDelete - Callback handler when the trash delete icon is clicked
 * @returns {React.JSX.Element} The single card panel widget representing a Lead
 */
export default function LeadCard({ lead, onEdit, onDelete }) {
  return (
    // Card shell with premium border highlights in dark mode
    <div className="p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-gray-600 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between h-48 text-xs relative group">
      
      {/* 1. Top Section: Client details and Action overlays */}
      <div>
        <div className="flex items-start justify-between gap-2">
          {/* Company and Client names details */}
          <div className="min-w-0">
            <h4 className="font-bold text-slate-900 dark:text-white truncate text-[13px]">
              {lead.name}
            </h4>
            <p className="text-[10px] text-slate-400 dark:text-gray-500 truncate mt-0.5">
              {lead.company}
            </p>
          </div>

          {/* Status Badge indicator */}
          <div className="shrink-0">
            <StatusBadge status={lead.status} />
          </div>
        </div>

        {/* 2. Middle Section: Contact logs (Email & Phone) */}
        <div className="mt-4 space-y-1.5 text-slate-500 dark:text-gray-400">
          {/* Email row details */}
          <div className="flex items-center gap-2 truncate">
            <Mail size={12} className="text-slate-400 dark:text-gray-500 shrink-0" />
            <a href={`mailto:${lead.email}`} className="hover:underline hover:text-blue-600 dark:hover:text-blue-400 truncate">
              {lead.email}
            </a>
          </div>

          {/* Phone row details */}
          {lead.phone && (
            <div className="flex items-center gap-2">
              <Phone size={12} className="text-slate-400 dark:text-gray-500 shrink-0" />
              <span>{lead.phone}</span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Bottom Section: Deal value and Action buttons row */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-gray-700/40 flex items-center justify-between">
        
        {/* Deal Value label display */}
        <div className="flex items-center gap-0.5 text-slate-700 dark:text-gray-300 font-bold">
          <DollarSign size={12} className="text-slate-400 dark:text-gray-500" />
          <span>{(lead.value || 0).toLocaleString()}</span>
        </div>

        {/* Action CTAs (Pencil Edit and Trash Delete) */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Edit button */}
          <button
            onClick={() => onEdit(lead)} // Invoke onEdit callback passing active lead
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:text-blue-400 dark:hover:bg-gray-700 rounded-md cursor-pointer transition-colors"
            title="Edit Lead"
          >
            <Edit size={13} />
          </button>
          
          {/* Delete button */}
          <button
            onClick={() => onDelete(lead.id)} // Invoke onDelete callback passing lead ID
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-100 dark:hover:text-red-400 dark:hover:bg-gray-700 rounded-md cursor-pointer transition-colors"
            title="Delete Lead"
          >
            <Trash2 size={13} />
          </button>
        </div>

      </div>

    </div>
  );
}
