import React, { useState, useEffect, useRef } from 'react';
import { Search, Users, LayoutDashboard, BarChart3, Sun, Moon, Plus } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

/**
 * JSDoc comments explaining CommandBar component:
 * @param {Object} props - Component properties
 * @param {boolean} props.isOpen - Controller to toggle display of command bar overlay
 * @param {Function} props.onClose - Trigger callback when dismiss overlay
 * @param {Array} props.leads - Array of raw leads data for query matches
 * @param {Function} props.setActivePage - Router setter callback to navigate to other views
 * @param {Function} props.onAddLead - Modal launcher trigger for adding new leads
 * @param {Function} props.onSelectLead - Select callback to view lead details drawer
 * @returns {React.JSX.Element|null} Command bar overlay input drawer or null if closed
 */
export default function CommandBar({
  isOpen,
  onClose,
  leads,
  setActivePage,
  onAddLead,
  onSelectLead,
}) {
  const { isDarkMode, toggleTheme } = useTheme();
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
    }
  }, [isOpen]);

  // Handle Cmd+K / Ctrl+K and Escape keys
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Navigation shortcuts list configuration
  const navigationShortcuts = [
    { id: 'go-dashboard', label: 'Go to Dashboard', icon: LayoutDashboard, action: () => { setActivePage('dashboard'); onClose(); } },
    { id: 'go-leads', label: 'Go to Leads Pipeline', icon: Users, action: () => { setActivePage('leads'); onClose(); } },
    { id: 'go-analytics', label: 'Go to Analytics & Forecasting', icon: BarChart3, action: () => { setActivePage('analytics'); onClose(); } },
  ];

  // Action shortcuts configurations
  const actionShortcuts = [
    { id: 'action-add-lead', label: 'Create New Lead', icon: Plus, action: () => { onAddLead(); onClose(); } },
    { id: 'action-toggle-theme', label: `Toggle ${isDarkMode ? 'Light' : 'Dark'} Mode`, icon: isDarkMode ? Sun : Moon, action: () => { toggleTheme(); onClose(); } },
  ];

  const filteredNavs = navigationShortcuts.filter(item =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  const filteredActions = actionShortcuts.filter(item =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  const filteredLeads = query.trim()
    ? leads.filter(lead =>
        lead.name.toLowerCase().includes(query.toLowerCase()) ||
        (lead.company && lead.company.toLowerCase().includes(query.toLowerCase())) ||
        lead.email.toLowerCase().includes(query.toLowerCase())
      )
    : leads.slice(0, 3); // show 3 recent leads when empty query

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 transition-colors duration-200">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-950/40 dark:bg-black/60 backdrop-blur-xs" onClick={onClose} />

      {/* Panel Box container */}
      <div className="relative w-full max-w-lg overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        {/* Search Input bar */}
        <div className="flex items-center gap-3 px-4 border-b border-gray-200 dark:border-gray-700">
          <Search className="text-gray-400 dark:text-gray-500 shrink-0" size={18} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search leads..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-12 text-sm bg-transparent border-0 outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          />
          <kbd className="px-1.5 py-0.5 text-[10px] font-medium bg-slate-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-md text-gray-400 dark:text-gray-500">
            ESC
          </kbd>
        </div>

        {/* Results scrollable container */}
        <div className="max-h-[320px] overflow-y-auto p-2 space-y-4 text-xs">
          
          {/* Navigation Section */}
          {filteredNavs.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                Navigation
              </div>
              <div className="mt-1 space-y-0.5">
                {filteredNavs.map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={item.action}
                      className="flex items-center justify-between w-full px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-700/60 hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors duration-150"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon size={14} className="text-gray-400 dark:text-gray-500" />
                        <span>{item.label}</span>
                      </div>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500">Enter</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions Section */}
          {filteredActions.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                Actions
              </div>
              <div className="mt-1 space-y-0.5">
                {filteredActions.map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={item.action}
                      className="flex items-center justify-between w-full px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-700/60 hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors duration-150"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon size={14} className="text-gray-400 dark:text-gray-500" />
                        <span>{item.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Leads Query Section */}
          <div>
            <div className="px-3 py-1 text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              {query ? 'Matching Leads' : 'Recent Leads'}
            </div>
            {filteredLeads.length > 0 ? (
              <div className="mt-1 space-y-0.5">
                {filteredLeads.map(lead => (
                  <button
                    key={lead.id}
                    onClick={() => {
                      onSelectLead(lead);
                      onClose();
                    }}
                    className="flex items-center justify-between w-full px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-700/60 hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors duration-150"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold text-white ${lead.owner?.color || 'bg-blue-500'}`}>
                        {lead.name.substring(0, 1)}
                      </div>
                      <div className="flex flex-col items-start">
                        <span>{lead.name}</span>
                        <span className="text-[10px] text-gray-400 dark:text-gray-500">{lead.company} • {lead.email}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 dark:text-gray-400">${(lead.value || 0).toLocaleString()}</span>
                      <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-semibold tracking-wide ${
                        lead.status === 'Won' ? 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400' :
                        lead.status === 'Lost' ? 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400' :
                        'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400'
                      }`}>
                        {lead.status}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-3 py-4 text-xs text-center text-gray-400 dark:text-gray-500">
                No leads found matching "{query}"
              </div>
            )}
          </div>
        </div>

        {/* Footer shortcuts helper */}
        <div className="px-4 py-3 bg-slate-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 text-[10px] text-gray-400 dark:text-gray-500 flex items-center justify-between">
          <div className="flex gap-3">
            <span>↑↓ Navigation</span>
            <span>↵ Select</span>
          </div>
          <span>Startup CRM Command Center</span>
        </div>
      </div>
    </div>
  );
}
