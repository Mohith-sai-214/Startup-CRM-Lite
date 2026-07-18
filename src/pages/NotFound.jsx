import React from 'react'; // Import React library to create the component
import { Link } from 'react-router-dom'; // Import Link component from react-router-dom for SPA navigation
import { HelpCircle, ArrowLeft } from 'lucide-react'; // Import icons from lucide-react

export default function NotFound() {
  return (
    // Outer flexbox container centered vertically and horizontally with standard light/dark modes
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      {/* Visual illustration wrapper */}
      <div className="relative mb-6">
        {/* Glow effect matching Stripe/Linear look */}
        <div className="absolute -inset-1 rounded-full bg-blue-600/20 blur-xl dark:bg-blue-500/10" />
        
        {/* Inner circle container holding the icon */}
        <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <HelpCircle size={40} className="text-blue-600 dark:text-blue-400" />
        </div>
      </div>

      {/* 404 Status Code Badge */}
      <span className="px-2.5 py-1 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-full dark:text-blue-400 dark:bg-blue-950/20 dark:border-blue-900/50">
        Error 404
      </span>

      {/* Error headings */}
      <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
        Page Not Found
      </h2>
      <p className="mt-2 text-xs text-slate-500 dark:text-gray-400 max-w-sm">
        The route you are looking for does not exist or has been moved to a different directory.
      </p>

      {/* Actions container to route back */}
      <div className="mt-8">
        <Link
          to="/" // Path to Dashboard route
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
