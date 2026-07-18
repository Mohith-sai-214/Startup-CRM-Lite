import api from './api.js';

/**
 * Authentication API Service Client.
 * Wraps backend authentication endpoints. All functions unwrap and return standard response payload data.
 */

/**
 * Registers a new user.
 * @param {string} name - User's full name.
 * @param {string} email - User's email.
 * @param {string} password - User's password.
 * @returns {Promise<Object>} Response payload data (user, token).
 */
export const register = async (name, email, password) => {
  const response = await api.post('/api/auth/register', { name, email, password });
  return response.data;
};

/**
 * Logins a user using credentials.
 * @param {string} email - User's email.
 * @param {string} password - User's password.
 * @returns {Promise<Object>} Response payload data (user, token).
 */
export const login = async (email, password) => {
  const response = await api.post('/api/auth/login', { email, password });
  return response.data;
};

/**
 * Logs out a user (stateless - deletes the token locally).
 */
export const logout = () => {
  localStorage.removeItem('crm-token');
};

/**
 * Fetch the authenticated user's profile context.
 * @returns {Promise<Object>} Response user data.
 */
export const getProfile = async () => {
  const response = await api.get('/api/auth/profile');
  return response.data;
};

/**
 * Update authenticated user's name or password.
 * @param {Object} data - Profile fields to modify (name, oldPassword, newPassword).
 * @returns {Promise<Object>} Response updated user data.
 */
export const updateProfile = async (data) => {
  const response = await api.put('/api/auth/profile', data);
  return response.data;
};

export default {
  register,
  login,
  logout,
  getProfile,
  updateProfile
};
