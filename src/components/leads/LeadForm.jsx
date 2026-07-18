import React, { useState, useEffect } from 'react'; // Import React core hooks

/**
 * JSDoc comments explaining LeadForm component props:
 * @param {Object} props - Component properties
 * @param {Object} [props.initialData] - Optional lead data template to populate inputs in Edit mode
 * @param {Function} props.onSubmit - Handler callback when submitting valid input data
 * @param {Function} props.onCancel - Handler callback to dismiss form layout
 * @returns {React.JSX.Element} Fully verified CRUD form component
 */
export default function LeadForm({ initialData, onSubmit, onCancel }) {
  // Define available options matching CRM configuration requirements
  const statuses = ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'];
  const sources = ['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Other'];

  // Input states tracking inputs values based on the requested shape
  const [formData, setFormData] = useState({
    name: '', // Client/Lead Name
    company: '', // Company Name
    email: '',
    phone: '',
    value: '', // Deal valuation size
    status: 'New',
    source: 'Website',
  });

  // Verification errors state mapping inputs to warning flags
  const [errors, setErrors] = useState({
    name: false,
    company: false,
    email: false,
  });

  // Populate inputs with initialData values if edit mode is active
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        company: initialData.company || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        value: initialData.value || '',
        status: initialData.status || 'New',
        source: initialData.source || 'Website',
      });
    }
  }, [initialData]);

  // Form submission handler validating required inputs
  const handleSubmit = (e) => {
    e.preventDefault(); // Stop standard browser submit events

    // Perform validation rules on mandatory inputs
    const nameErr = !formData.name.trim(); // Client Name is required
    const companyErr = !formData.company.trim(); // Company Name is required
    const emailErr = !formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email); // Email is required and must format match

    // Update validation warnings flag state
    setErrors({
      name: nameErr,
      company: companyErr,
      email: emailErr,
    });

    // Block submission if any validation failures are triggered
    if (nameErr || companyErr || emailErr) {
      return;
    }

    // Call onSubmit callback, parsing deal value number format safely
    onSubmit({
      ...formData,
      value: parseFloat(formData.value) || 0, // Parse input value to number format
    });
  };

  return (
    // Standard form overlay matching layout theme structures
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      
      {/* 1. Name & Company fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Client Name input field */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wide">
            Lead Name *
          </label>
          <input
            type="text"
            placeholder="e.g. John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`mt-1 block w-full px-3 py-2 bg-slate-50 dark:bg-gray-900 border rounded-lg outline-none text-slate-800 dark:text-gray-200 transition-colors ${
              errors.name
                ? 'border-red-500 focus:border-red-500' // Show red warning border if input empty
                : 'border-gray-200 dark:border-gray-700 focus:border-blue-600 dark:focus:border-blue-500'
            }`}
          />
          {errors.name && (
            <span className="text-[10px] text-red-500 mt-1 block">Lead contact name is required</span>
          )}
        </div>

        {/* Company Name input field */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wide">
            Company Name *
          </label>
          <input
            type="text"
            placeholder="e.g. Acme Corp"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className={`mt-1 block w-full px-3 py-2 bg-slate-50 dark:bg-gray-900 border rounded-lg outline-none text-slate-800 dark:text-gray-200 transition-colors ${
              errors.company
                ? 'border-red-500 focus:border-red-500' // Show red warning border if input empty
                : 'border-gray-200 dark:border-gray-700 focus:border-blue-600 dark:focus:border-blue-500'
            }`}
          />
          {errors.company && (
            <span className="text-[10px] text-red-500 mt-1 block">Company name is required</span>
          )}
        </div>
      </div>

      {/* 2. Email & Phone fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Email Address input field */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wide">
            Email Address *
          </label>
          <input
            type="email"
            placeholder="e.g. john@acme.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={`mt-1 block w-full px-3 py-2 bg-slate-50 dark:bg-gray-900 border rounded-lg outline-none text-slate-800 dark:text-gray-200 transition-colors ${
              errors.email
                ? 'border-red-500 focus:border-red-500' // Show red warning border if input empty or invalid
                : 'border-gray-200 dark:border-gray-700 focus:border-blue-600 dark:focus:border-blue-500'
            }`}
          />
          {errors.email && (
            <span className="text-[10px] text-red-500 mt-1 block">A valid email address is required</span>
          )}
        </div>

        {/* Phone Number input field */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wide">
            Phone Number
          </label>
          <input
            type="text"
            placeholder="e.g. 555-0199"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="mt-1 block w-full px-3 py-2 bg-slate-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none text-slate-800 dark:text-gray-200 focus:border-blue-600 dark:focus:border-blue-500"
          />
        </div>
      </div>

      {/* 3. Deal Value, Status & Source fields */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Deal Valuation input field */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wide">
            Deal Value ($)
          </label>
          <input
            type="number"
            placeholder="e.g. 15000"
            value={formData.value}
            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
            className="mt-1 block w-full px-3 py-2 bg-slate-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none text-slate-800 dark:text-gray-200 font-bold focus:border-blue-600 dark:focus:border-blue-500"
          />
        </div>

        {/* Status Dropdown selector */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wide">
            Lead Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="mt-1 block w-full px-2.5 py-2 bg-slate-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none text-slate-700 dark:text-gray-300"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Source Dropdown selector */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wide">
            Lead Source
          </label>
          <select
            value={formData.source}
            onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            className="mt-1 block w-full px-2.5 py-2 bg-slate-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none text-slate-700 dark:text-gray-300"
          >
            {sources.map((src) => (
              <option key={src} value={src}>{src}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 4. Action buttons footer wrapper */}
      <div className="flex justify-end gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
        {/* Cancel CTA button */}
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors cursor-pointer"
        >
          Cancel
        </button>

        {/* Submit Form CTA button */}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-750 text-white rounded-lg font-bold shadow-xs transition-colors cursor-pointer"
        >
          {initialData ? 'Save Lead changes' : 'Add Lead Profile'}
        </button>
      </div>

    </form>
  );
}
