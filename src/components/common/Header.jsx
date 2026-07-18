import React from 'react';
import { Menu, Search, Plus } from 'lucide-react';
import DarkModeToggle from './DarkModeToggle';

export default function Header({ onMenuClick, onSearchClick, onAddLeadClick, activePage }) {
  const getPageTitle = () => {
    switch (activePage) {
      case 'dashboard':
        return 'Dashboard';
      case 'leads':
        return 'Leads Pipeline';
      case 'analytics':
        return 'Analytics & Forecasting';
      default:
        return 'CRM';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-8 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md transition-colors duration-200">
      {/* Left side: Hamburger (mobile) + Page Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-gray-400 dark:hover:bg-gray-900 lg:hidden cursor-pointer"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          {getPageTitle()}
        </h1>
      </div>

      {/* Right side: Search trigger, Add Lead, Theme, Profile */}
      <div className="flex items-center gap-3">
        {/* Command Search Trigger */}
        <button
          onClick={onSearchClick}
          className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-400 dark:text-gray-500 bg-slate-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-slate-300 dark:hover:border-gray-600 transition-colors cursor-pointer"
        >
          <Search size={14} />
          <span>Search...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-slate-400 dark:text-gray-500">
            ⌘K
          </kbd>
        </button>

        {/* Global Quick Add Button */}
        <button
          onClick={onAddLeadClick}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs hover:shadow-sm transition-all cursor-pointer"
        >
          <Plus size={14} />
          <span className="hidden sm:inline">Add Lead</span>
        </button>

        {/* Theme Toggle switch */}
        <DarkModeToggle />
      </div>
    </header>
  );
}
