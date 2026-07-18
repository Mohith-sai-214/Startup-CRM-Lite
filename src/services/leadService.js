import api from './api.js';

/**
 * Lead Management API Service Client.
 * Wraps leads CRUD, pipeline status updates, and stats/analytics dashboard queries.
 */

/**
 * Retrieves paginated, sorted, and filtered leads.
 * @param {Object} [params] - Query params (status, search, page, limit, sortBy, sortOrder).
 * @returns {Promise<Object>} Paginated leads payload.
 */
export const getLeads = async (params = {}) => {
  const response = await api.get('/api/leads', { params });
  return response.data;
};

/**
 * Creates a new lead record.
 * @param {Object} leadData - Lead fields.
 * @returns {Promise<Object>} The created lead payload.
 */
export const createLead = async (leadData) => {
  const response = await api.post('/api/leads', leadData);
  return response.data;
};

/**
 * Updates details of an existing lead.
 * @param {string} id - Lead ID.
 * @param {Object} leadData - Updated fields.
 * @returns {Promise<Object>} The updated lead payload.
 */
export const updateLead = async (id, leadData) => {
  const response = await api.put(`/api/leads/${id}`, leadData);
  return response.data;
};

/**
 * Updates the pipeline status of a lead.
 * @param {string} id - Lead ID.
 * @param {string} status - New pipeline status value.
 * @returns {Promise<Object>} The updated lead payload.
 */
export const updateLeadStatus = async (id, status) => {
  const response = await api.patch(`/api/leads/${id}/status`, { status });
  return response.data;
};

/**
 * Deletes a lead record from the database.
 * @param {string} id - Lead ID.
 * @returns {Promise<Object>} Success message payload.
 */
export const deleteLead = async (id) => {
  const response = await api.delete(`/api/leads/${id}`);
  return response.data;
};

/**
 * Retrieves aggregate summary metrics of leads.
 * @returns {Promise<Object>} Statistics card counts and metrics.
 */
export const getLeadStats = async () => {
  const response = await api.get('/api/leads/stats/summary');
  return response.data;
};

/**
 * Retrieves 6-month chronological lead history for bar charts.
 * @returns {Promise<Array>} List of month records with lead and won counts.
 */
export const getMonthlyStats = async () => {
  const response = await api.get('/api/leads/stats/monthly');
  return response.data;
};

export default {
  getLeads,
  createLead,
  updateLead,
  updateLeadStatus,
  deleteLead,
  getLeadStats,
  getMonthlyStats
};
