import React from 'react'; // Import React core module
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'; // Import trend indicators from lucide-react

/**
 * JSDoc comments explaining StatsCard component props:
 * @param {Object} props - The component properties
 * @param {string} props.title - The label header of the metric (e.g. "Total Leads")
 * @param {string|number} props.value - The numerical value of the metric (e.g. "1,248" or "$145K")
 * @param {React.ComponentType} props.icon - The Lucide icon component reference
 * @param {string|number} props.change - The month-over-month performance percentage change (e.g. "+12.4%")
 * @param {string} props.color - Custom Tailwind color class names for text/background elements
 * @returns {React.JSX.Element} The rendered stats metric card component
 */
export default function StatsCard({ title, value, icon: Icon, change, color }) {
  // Convert change to a string to check if it represents a positive trend or negative trend
  const changeStr = String(change); // Cast change value to a standard string
  const isPositive = changeStr.startsWith('+') || parseFloat(changeStr) > 0; // Check if trend goes upwards
  const isZero = changeStr.startsWith('0') || parseFloat(changeStr) === 0; // Check if trend is zero / unchanged

  return (
    // Responsive outer card container with premium border highlight in dark mode
    <div className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
      
      {/* Top section containing Title and colorized Icon container */}
      <div className="flex items-center justify-between">
        {/* Metric title */}
        <span className="text-xs font-semibold text-slate-400 dark:text-gray-500">{title}</span>
        
        {/* Icon container container using dynamic color props */}
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon size={16} /> {/* Renders the dynamic Lucide icon element */}
        </div>
      </div>

      {/* Bottom section showing numerical values and trend indicator badges */}
      <div className="mt-4 flex items-baseline gap-2">
        {/* Metric value display */}
        <span className="text-2xl font-bold text-slate-950 dark:text-white tracking-tight">
          {value}
        </span>

        {/* Dynamic badge showing MoM changes */}
        <span
          className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
            isZero
              ? 'text-slate-700 bg-slate-100 dark:text-gray-400 dark:bg-gray-700/40' // Styled grey badge for unchanged states
              : isPositive
              ? 'text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-950/20' // Styled green badge for positive indicators
              : 'text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-950/20' // Styled red badge for negative indicators
          }`}
        >
          {/* Renders up arrow for positive, down arrow for negative, no arrow if flat */}
          {!isZero && (isPositive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />)}
          {changeStr}
        </span>
        <span className="text-[10px] text-slate-400 dark:text-gray-500 ml-0.5">vs last month</span>
      </div>
    </div>
  );
}
