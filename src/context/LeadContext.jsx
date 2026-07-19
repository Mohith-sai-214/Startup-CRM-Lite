import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import leadService from '../services/leadService.js';
import { useAuth } from './AuthContext.jsx';

// Create global Lead Context
export const LeadContext = createContext();

/**
 * LeadProvider component managing Lead database query triggers and UI states.
 * Communicates with backend REST API and provides user-focused notifications on success/failure.
 */
export const LeadProvider = ({ children }) => {
  const { token } = useAuth(); // Consume auth token to check user sessions

  // Core API states
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({
    totalLeads: 0,
    statusBreakdown: { New: 0, Contacted: 0, 'Meeting Scheduled': 0, 'Proposal Sent': 0, Won: 0, Lost: 0 },
    conversionRate: 0,
    sourceBreakdown: { Website: 0, Referral: 0, LinkedIn: 0, 'Cold Call': 0, 'Email Campaign': 0, Other: 0 },
    thisMonthLeads: 0,
    lastMonthLeads: 0,
    growthRate: 0
  });
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    pages: 1
  });

  // UI Context states
  const [selectedLead, setSelectedLead] = useState(null);
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);

  /**
   * READ: Fetch lead list from the database.
   * @param {Object} [params] - Query parameters (status, search, page, etc.).
   */
  const fetchLeads = useCallback(async (params = {}) => {
    setIsLoading(true);
    try {
      const res = await leadService.getLeads(params);
      // res shape: { success: true, message: ..., data: [leads], pagination: { ... } }
      if (res && res.data) {
        setLeads(res.data);
        if (res.pagination) {
          setPagination(res.pagination);
        }
      }
    } catch (error) {
      console.error('Failed to fetch leads:', error);
      const apiMessage = error.response?.data?.message || 'Failed to retrieve leads from server';
      toast.error(apiMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * STATS: Fetch consolidated statistics from the database.
   */
  const fetchStats = useCallback(async () => {
    try {
      const [statsRes, monthlyRes] = await Promise.all([
        leadService.getLeadStats(),
        leadService.getMonthlyStats()
      ]);
      if (statsRes && statsRes.data) {
        setStats(statsRes.data);
      }
      if (monthlyRes && monthlyRes.data) {
        setMonthlyStats(monthlyRes.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  }, []);

  // Automatically load leads on mount or when token updates (user session initialized)
  useEffect(() => {
    if (token) {
      fetchLeads();
      fetchStats();
    } else {
      // Clear data if logged out
      setLeads([]);
      setStats({
        totalLeads: 0,
        statusBreakdown: { New: 0, Contacted: 0, 'Meeting Scheduled': 0, 'Proposal Sent': 0, Won: 0, Lost: 0 },
        conversionRate: 0,
        sourceBreakdown: { Website: 0, Referral: 0, LinkedIn: 0, 'Cold Call': 0, 'Email Campaign': 0, Other: 0 },
        thisMonthLeads: 0,
        lastMonthLeads: 0,
        growthRate: 0
      });
      setMonthlyStats([]);
    }
  }, [token, fetchLeads, fetchStats]);

  /**
   * CREATE: Adds a new lead record to the database.
   * @param {Object} leadData - Lead form data fields.
   */
  const addLead = async (leadData) => {
    setIsLoading(true);
    try {
      const res = await leadService.createLead(leadData);
      if (res && res.data) {
        toast.success(`Successfully added ${res.data.company} to Leads database`);
        // Sync lists and statistics charts in real-time
        await Promise.all([fetchLeads(), fetchStats()]);
        return res.data;
      }
    } catch (error) {
      console.error('Failed to create lead:', error);
      const apiMessage = error.response?.data?.message || 'Failed to create lead';
      toast.error(apiMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * UPDATE: Updates details of an existing lead.
   * @param {string} id - Lead ID to modify.
   * @param {Object} updatedFields - Fields to update.
   */
  const updateLead = async (id, updatedFields) => {
    try {
      const res = await leadService.updateLead(id, updatedFields);
      if (res && res.data) {
        toast.success(`Successfully updated ${res.data.company} details`);
        // Sync lists and statistics charts in real-time
        await Promise.all([fetchLeads(), fetchStats()]);
        return res.data;
      }
    } catch (error) {
      console.error('Failed to update lead:', error);
      const apiMessage = error.response?.data?.message || 'Failed to update lead details';
      toast.error(apiMessage);
    }
  };

  /**
   * DELETE: Removes a lead from the database.
   * @param {string} id - Lead ID to delete.
   */
  const deleteLead = async (id) => {
    try {
      const res = await leadService.deleteLead(id);
      if (res) {
        toast.success(res.message || 'Lead deleted successfully');
        // Sync lists and statistics charts in real-time
        await Promise.all([fetchLeads(), fetchStats()]);
        // Reset detail drawer selection if active lead is deleted
        if (selectedLead && (selectedLead.id === id || selectedLead._id === id)) {
          setSelectedLead(null);
        }
      }
    } catch (error) {
      console.error('Failed to delete lead:', error);
      const apiMessage = error.response?.data?.message || 'Failed to delete lead';
      toast.error(apiMessage);
    }
  };

  /**
   * Local helper helper to lookup loaded lead details by ID.
   * @param {string} id - Lead ID.
   * @returns {Object|undefined} Matched lead object.
   */
  const getLeadById = (id) => {
    return leads.find((lead) => lead.id === id || lead._id === id);
  };

  return (
    <LeadContext.Provider
      value={{
        leads,
        stats,
        monthlyStats,
        isLoading,
        pagination,
        selectedLead,
        setSelectedLead,
        isAddLeadOpen,
        setIsAddLeadOpen,
        fetchLeads,
        fetchStats,
        addLead,
        updateLead,
        deleteLead,
        getLeadById
      }}
    >
      {children}
    </LeadContext.Provider>
  );
};

/**
 * Custom Hook to consume LeadContext.
 */
export const useLeads = () => {
  const context = useContext(LeadContext);
  if (!context) {
    throw new Error('useLeads must be consumed within a LeadProvider wrapper');
  }
  return context;
};
