import React from 'react'; // Import React library
import { NavLink } from 'react-router-dom'; // Import NavLink from react-router-dom to support path routing matches
import { LayoutDashboard, Users, BarChart3, LogOut } from 'lucide-react'; // Import icons from lucide-react
import { useAuth } from '../../context/AuthContext.jsx'; // Import AuthContext hook

export default function Sidebar({ isOpen, setIsOpen }) {
  // Navigation menu items containing path destinations, display names, and icons
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { id: 'leads', name: 'Leads', path: '/leads', icon: Users },
    { id: 'analytics', name: 'Analytics', path: '/analytics', icon: BarChart3 },
  ];

  const { user, logout } = useAuth(); // Consume current authenticated user profile and logout method

  // Calculate user initials dynamically
  const getUserInitials = () => {
    if (!user || !user.name) return 'U';
    return user.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <>
      {/* Mobile background overlay when sidebar drawer is open */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          onClick={() => setIsOpen(false)} // Close sidebar on clicking backdrop
        />
      )}

      {/* Sidebar navigation shell */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors duration-200 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Workspace Brand Header section */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            {/* Triangular symbol brand logo */}
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-lg shadow-sm">
              ▲
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm text-gray-900 dark:text-white leading-tight">
                Startup Lite CRM
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
                Workspace
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic navigation links using NavLink for routing path highlights */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon; // Extract component icon references
            return (
              <NavLink
                key={item.id}
                to={item.path} // Map route path destination
                onClick={() => setIsOpen(false)} // Collapse mobile sidebar drawer on navigation
                // Active status checked via a callback returning tailwind strings dynamically
                className={({ isActive }) =>
                  `flex items-center w-full gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 group cursor-pointer ${
                    isActive
                      ? 'bg-gray-100 dark:bg-gray-900 text-blue-600 dark:text-blue-400 font-semibold' // Highlight styling for active match
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900/50 hover:text-gray-900 dark:hover:text-white' // Hover styling for inactive routes
                  }`
                }
              >
                {/* Dynamically style icons using active-state className functions */}
                {({ isActive }) => (
                  <>
                    <Icon
                      size={18}
                      className={`transition-colors ${
                        isActive
                          ? 'text-blue-600 dark:text-blue-400' // Active color indicator
                          : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400' // Inactive color indicator
                      }`}
                    />
                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Account/Workspace Settings Footer block */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
            {/* Profile Avatar initials */}
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold text-sm">
              {getUserInitials()}
            </div>
            {/* Profile details truncate to handle length boundaries */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                {user ? user.name : 'Loading user...'}
              </p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                {user ? user.email : ''}
              </p>
            </div>
            <button
              onClick={logout}
              title="Sign out"
              className="text-gray-400 hover:text-red-650 dark:text-gray-500 dark:hover:text-red-400 hover:text-red-600 cursor-pointer transition-colors"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
