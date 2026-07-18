import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

/**
 * JSDoc comments explaining DarkModeToggle component:
 * @returns {React.JSX.Element} A premium animated theme switch toggle component
 */
export default function DarkModeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="flex items-center gap-2 px-1.5 py-1 text-xs text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer focus:outline-none group"
      aria-label="Toggle Dark Mode"
      title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {/* Switch Track */}
      <div className="relative w-10 h-5 bg-gray-200 dark:bg-gray-700 rounded-full transition-colors duration-200 ease-in-out">
        {/* Sliding Thumb Circle */}
        <div
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white flex items-center justify-center shadow-xs transition-transform duration-200 ease-in-out ${
            isDarkMode ? 'translate-x-5' : 'translate-x-0'
          }`}
        >
          {isDarkMode ? (
            <Moon size={10} className="text-blue-600 dark:text-blue-400" />
          ) : (
            <Sun size={10} className="text-amber-500" />
          )}
        </div>
      </div>
      {/* Mode Label */}
      <span className="font-semibold text-[11px] select-none hidden md:inline">
        {isDarkMode ? 'Dark' : 'Light'}
      </span>
    </button>
  );
}
