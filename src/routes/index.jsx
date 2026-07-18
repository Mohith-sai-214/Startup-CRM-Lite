import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Outlet, useLocation, Navigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import CommandBar from '../components/common/CommandBar';
import { useLeads } from '../context/LeadContext';
import { useAuth } from '../context/AuthContext.jsx';
import { Toaster } from 'react-hot-toast';

// Public view bundles
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';

// Lazy-loaded page bundles
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Leads = lazy(() => import('../pages/Leads'));
const Analytics = lazy(() => import('../pages/Analytics'));
const NotFound = lazy(() => import('../pages/NotFound'));

// Fallback spinner component when loading dynamic route chunks
function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin dark:border-zinc-800 dark:border-t-blue-500" />
      <span className="text-xs font-semibold text-slate-400 dark:text-zinc-500">Loading view...</span>
    </div>
  );
}

/**
 * Route protection wrapper component.
 * Verifies session credentials. Redirects unauthenticated users to `/login`.
 */
function ProtectedRoute() {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin dark:border-zinc-800 dark:border-t-blue-500" />
        <span className="mt-4 text-xs font-semibold text-slate-400 dark:text-zinc-500">Initializing session...</span>
      </div>
    );
  }

  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

// Layout wrapper component hosting navigation shells
function AppLayout() {
  const {
    leads,
    selectedLead,
    setSelectedLead,
    isAddLeadOpen,
    setIsAddLeadOpen
  } = useLeads();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const location = useLocation();

  const getActivePageId = () => {
    const path = location.pathname;
    if (path === '/') return 'dashboard';
    if (path.startsWith('/leads')) return 'leads';
    if (path.startsWith('/analytics')) return 'analytics';
    return '';
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-900 dark:text-white transition-colors duration-200">
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <div className="lg:ml-64 flex flex-col min-h-screen">
        <Header
          onMenuClick={() => setIsSidebarOpen(true)}
          onSearchClick={() => setIsSearchOpen(true)}
          onAddLeadClick={() => setIsAddLeadOpen(true)}
          activePage={getActivePageId()}
        />

        <main className="flex-1 p-4 md:p-8 max-w-[1400px] w-full mx-auto">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>

      <CommandBar
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        leads={leads}
        setActivePage={() => {}}
        onAddLead={() => setIsAddLeadOpen(true)}
        onSelectLead={setSelectedLead}
      />

      <Toaster />
    </div>
  );
}

// Application Route declarations
export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Authentication routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes wrapped in AppLayout */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="leads" element={<Leads />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
  );
}
