import React, { useState, useEffect } from 'react'; // Import React core hooks
import { useLeads } from '../context/LeadContext'; // Import Leads context hook
import { Plus, List, LayoutGrid, X, MessageSquare } from 'lucide-react'; // Import icons from lucide-react
import { toast } from 'react-hot-toast'; // Import react-hot-toast notifier

// Import custom sub-components
import LeadForm from '../components/leads/LeadForm';
import LeadCard from '../components/leads/LeadCard';
import LeadTable from '../components/leads/LeadTable';

// Import newly designed layout controls
import SearchBar from '../components/common/SearchBar';
import FilterBar from '../components/common/FilterBar';
import EmptyState from '../components/common/EmptyState';

/**
 * JSDoc comments explaining Leads page component:
 * @returns {React.JSX.Element} Fully functional CRM Leads Pipeline management panel
 */
export default function Leads() {
  // Consume leads database states and triggers from LeadContext
  const {
    leads,
    selectedLead,
    setSelectedLead,
    isAddLeadOpen,
    setIsAddLeadOpen,
    fetchLeads,
    addLead,
    updateLead,
    deleteLead,
  } = useLeads();

  // Local page state hooks
  const [viewMode, setViewMode] = useState('table'); // View switcher toggle: 'table' | 'card'
  const [searchTerm, setSearchTerm] = useState(''); // Text query controlled user inputs
  const [searchQuery, setSearchQuery] = useState(''); // Debounced query used for filtering
  const [activeFilter, setActiveFilter] = useState('All'); // Selected status filter tag
  const [editingLead, setEditingLead] = useState(null); // Reference of lead object currently being edited
  const [isFormModalOpen, setIsFormModalOpen] = useState(false); // Modal toggler control for LeadForm overlays
  const [noteInput, setNoteInput] = useState(''); // Text comment inputs inside details drawer

  // CRM static selections
  const statuses = ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'];

  // 300ms Debouncing timer to sync user keystrokes with filtering query strings
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchTerm); // Set debounced value
    }, 300); // 300ms delay threshold
    return () => clearTimeout(timer); // Clear timeout triggers on subsequent state changes
  }, [searchTerm]);

  // Trigger server-side database reload on filter/search query changes
  useEffect(() => {
    fetchLeads({
      search: searchQuery,
      status: activeFilter
    });
  }, [searchQuery, activeFilter]);

  // Handler callback to reset searches and statuses
  const handleClearFilters = () => {
    setSearchTerm(''); // Clear text field
    setSearchQuery(''); // Reset query string
    setActiveFilter('All'); // Set status back to All
    toast.success('Reset search filters successfully'); // Toast notification feedback
  };

  // Handle lead deletion CRUD trigger
  const handleDeleteLead = (id) => {
    // Retrieve target lead metadata to fetch the company name for notifications
    const targetLead = leads.find((l) => l.id === id);
    const companyName = targetLead ? targetLead.company : 'Lead';

    // Remove targeted lead from database
    deleteLead(id);

    // Trigger red warning toast verifying deletion success
    toast.error(`Deleted ${companyName} from database`, {
      duration: 3000,
      position: 'bottom-right',
      style: {
        background: '#FEF2F2',
        color: '#991B1B',
        fontSize: '12px',
        border: '1px solid #FCA5A5',
      },
    });
  };

  // Open creation modal overlay
  const handleOpenCreateModal = () => {
    setEditingLead(null); // Clear editing reference
    setIsFormModalOpen(true); // Open modal overlay
  };

  // Open edit modal overlay populated with active lead details
  const handleOpenEditModal = (lead) => {
    setEditingLead(lead); // Set editing lead target
    setIsFormModalOpen(true); // Open modal overlay
  };

  // Handle Form onSubmit callback mapping to Create or Update CRUD procedures
  const handleFormSubmit = (formData) => {
    if (editingLead) {
      // UPDATE lead CRUD procedures
      updateLead(editingLead.id, formData);

      // Trigger green toast notice verifying update success
      toast.success(`Updated ${formData.company} details successfully`, {
        duration: 3000,
        position: 'bottom-right',
        style: {
          background: '#ECFDF5',
          color: '#065F46',
          fontSize: '12px',
          border: '1px solid #6EE7B7',
        },
      });
    } else {
      // CREATE lead CRUD procedures
      addLead(formData);

      // Trigger green toast notice verifying creation success
      toast.success(`Added ${formData.company} to Leads database`, {
        duration: 3000,
        position: 'bottom-right',
        style: {
          background: '#ECFDF5',
          color: '#065F46',
          fontSize: '12px',
          border: '1px solid #6EE7B7',
        },
      });
    }

    setIsFormModalOpen(false); // Close form modal
    setIsAddLeadOpen(false); // Close overlay triggers
    setEditingLead(null); // Reset editing lead reference
  };

  // Add Comment/Note logs to selected lead
  const handleAddComment = (e) => {
    e.preventDefault(); // Block standard submit events
    if (!noteInput.trim()) return; // Discard empty entries

    const newComment = {
      id: `note-${Date.now()}`, // Dynamic ID
      author: 'Sarah K.',
      text: noteInput.trim(),
      date: new Date().toISOString().split('T')[0], // Calendar stamp
    };

    // Calculate updated comments array
    const updatedNotes = [...(selectedLead.notes || []), newComment];
    updateLead(selectedLead.id, { notes: updatedNotes }); // Trigger context update

    setNoteInput(''); // Reset comment input box
  };

  // The leads array is already dynamically filtered on the server-side database
  const filteredLeads = leads;

  return (
    // Responsive outer grid container with slide and entry animations
    <div className="relative space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
      
      {/* 1. Header Search & Filtering control panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
        
        {/* Left segment: Controlled SearchBar & FilterBar tabs */}
        <div className="flex flex-col xl:flex-row xl:items-center gap-4 flex-1">
          {/* Search box input widget */}
          <div className="w-full sm:w-72">
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
          </div>

          {/* Dynamic horizontal scroll tabs with counters */}
          <FilterBar
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            leads={leads}
          />
        </div>

        {/* Right segment containing view selectors & Add CTA button */}
        <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
          
          {/* View modes toggle wrapper */}
          <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg p-0.5 bg-slate-100 dark:bg-gray-900">
            {/* Table layout button */}
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-gray-700 text-slate-800 dark:text-white shadow-sm'
                  : 'text-slate-400 dark:text-gray-500 hover:text-slate-700 dark:hover:text-gray-300'
              }`}
              title="Table View"
            >
              <List size={14} />
            </button>

            {/* Card layout button */}
            <button
              onClick={() => setViewMode('card')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === 'card'
                  ? 'bg-white dark:bg-gray-700 text-slate-800 dark:text-white shadow-sm'
                  : 'text-slate-400 dark:text-gray-500 hover:text-slate-700 dark:hover:text-gray-300'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid size={14} />
            </button>
          </div>

          {/* Quick lead CTA */}
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus size={14} />
            <span>Add Lead</span>
          </button>
        </div>

      </div>

      {/* 2. Main View Grid Rendering: Table / Cards vs Empty States */}
      {filteredLeads.length > 0 ? (
        <>
          {viewMode === 'table' ? (
            // TABLE VIEW (primarily visible on tablet & desktop layouts)
            <div className="hidden md:block">
              <LeadTable
                leads={filteredLeads}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteLead}
                onRowClick={setSelectedLead}
              />
            </div>
          ) : null}

          {/* Card Grid View (Active if viewMode card is selected OR always shown on mobile) */}
          <div className={`${viewMode === 'card' ? 'block' : 'block md:hidden'}`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-200">
              {filteredLeads.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onEdit={handleOpenEditModal}
                  onDelete={handleDeleteLead}
                />
              ))}
            </div>
          </div>
        </>
      ) : (
        // Renders friendly EmptyState illustrations when searches/filters return empty results
        <EmptyState
          totalLeads={leads.length}
          filteredLeads={filteredLeads.length}
          onClear={handleClearFilters}
          onAddLead={handleOpenCreateModal}
        />
      )}

      {/* 3. Notion-style details slider drawer block */}
      {selectedLead && (
        <>
          {/* Drawer Backdrop overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/20 dark:bg-black/40 backdrop-blur-3xs"
            onClick={() => setSelectedLead(null)}
          />
          
          <div className="fixed top-0 bottom-0 right-0 z-50 w-full max-w-md bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 shadow-2xl flex flex-col animate-in slide-in-from-right duration-250">
            {/* Drawer Header panel */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-gray-500">Lead Profile</span>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-gray-800 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable drawer body */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 text-xs">
              {/* Header Client Name title */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                  {selectedLead.name}
                </h3>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                  Company: <span className="font-semibold">{selectedLead.company}</span>
                </p>
                <p className="text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">
                  Enrolled: {selectedLead.createdAt}
                </p>
              </div>

              {/* Status Picker Selector */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-gray-800/30 p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 dark:text-gray-500 uppercase tracking-wide">Status</label>
                  <select
                    value={selectedLead.status}
                    onChange={(e) => {
                      const updatedStatus = e.target.value;
                      updateLead(selectedLead.id, { status: updatedStatus }); // Trigger context update
                      toast.success(`Updated status to ${updatedStatus}`);
                    }}
                    className="mt-1 block w-full px-2 py-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md outline-none text-xs text-slate-800 dark:text-gray-200"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 dark:text-gray-500 uppercase tracking-wide">Deal Value</label>
                  <input
                    type="number"
                    value={selectedLead.value}
                    onChange={(e) => {
                      const updatedValue = parseFloat(e.target.value) || 0;
                      updateLead(selectedLead.id, { value: updatedValue }); // Trigger context update
                    }}
                    className="mt-1 block w-full px-2 py-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md outline-none text-xs text-slate-800 dark:text-gray-200 font-bold text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              {/* Lead details list */}
              <div className="space-y-3.5">
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-gray-700/50">
                  <span className="text-slate-400 dark:text-gray-400">Company Name</span>
                  <span className="font-semibold text-slate-900 dark:text-gray-200">{selectedLead.company}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-gray-700/50">
                  <span className="text-slate-400 dark:text-gray-400">Email Address</span>
                  <a href={`mailto:${selectedLead.email}`} className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">{selectedLead.email}</a>
                </div>
                {selectedLead.phone && (
                  <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-gray-700/50">
                    <span className="text-slate-400 dark:text-gray-400">Phone Number</span>
                    <span className="font-semibold text-slate-900 dark:text-gray-200">{selectedLead.phone}</span>
                  </div>
                )}
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-gray-700/50">
                  <span className="text-slate-400 dark:text-gray-400">Lead Source</span>
                  <span className="font-medium text-slate-800 dark:text-gray-300">{selectedLead.source}</span>
                </div>
              </div>

              {/* Notion comments list logs */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-gray-500">Comments & Notes</h4>
                  <MessageSquare size={13} className="text-slate-400 dark:text-gray-500" />
                </div>

                <form onSubmit={handleAddComment} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none text-[11px] text-slate-800 dark:text-gray-200 placeholder-slate-400 dark:placeholder-gray-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-slate-100 dark:bg-gray-800 hover:bg-slate-200 text-slate-700 dark:text-white font-semibold rounded-lg text-[10px] border border-slate-200 dark:border-gray-700 transition-colors shrink-0 cursor-pointer"
                  >
                    Add
                  </button>
                </form>

                <div className="space-y-2 mt-2 pt-2 border-t border-slate-100 dark:border-gray-700/40 max-h-[220px] overflow-y-auto pr-1">
                  {selectedLead.notes && selectedLead.notes.length > 0 ? (
                    selectedLead.notes.map((note) => (
                      <div key={note.id} className="p-2.5 bg-slate-50 dark:bg-gray-800/40 border border-slate-200/50 dark:border-gray-700 rounded-lg text-[11px]">
                        <div className="flex justify-between font-semibold text-slate-700 dark:text-gray-300">
                          <span>{note.author}</span>
                          <span className="text-[9px] text-slate-400 dark:text-gray-500 font-normal">{note.date}</span>
                        </div>
                        <p className="text-slate-600 dark:text-gray-400 mt-1 leading-relaxed whitespace-pre-wrap">
                          {note.text}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-slate-400 dark:text-gray-500">
                      No logs or comments created yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 4. CRUD Modals overlay hosting LeadForm */}
      {(isFormModalOpen || isAddLeadOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Modal Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/40 dark:bg-black/60 backdrop-blur-xs"
            onClick={() => {
              setIsFormModalOpen(false);
              setIsAddLeadOpen(false); // Close parent triggers too
              setEditingLead(null);
            }}
          />
          
          {/* Modal Layout panel */}
          <div className="relative w-full max-w-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-6 animate-in fade-in zoom-in-95 duration-150 text-xs">
            {/* Title headers */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700 mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {editingLead ? 'Modify CRM Lead Profile' : 'Create New CRM Lead'}
              </h3>
              <button
                onClick={() => {
                  setIsFormModalOpen(false);
                  setIsAddLeadOpen(false);
                  setEditingLead(null);
                }}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Render sub-component Form */}
            <LeadForm
              initialData={editingLead} // Populate if in editing mode
              onSubmit={handleFormSubmit} // CRUD trigger
              onCancel={() => {
                setIsFormModalOpen(false);
                setIsAddLeadOpen(false);
                setEditingLead(null);
              }}
            />
          </div>
        </div>
      )}

    </div>
  );
}
