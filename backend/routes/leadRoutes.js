import express from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  getLeads,
  createLead,
  getLeadById,
  updateLead,
  updateLeadStatus,
  deleteLead,
  getLeadStats,
  getMonthlyStats,
  searchLeads
} from '../controllers/leadController.js';

const router = express.Router();

// Apply authentication shield globally across all lead endpoints
router.use(protect);

// 1. Validation rules definition for Lead Creation
const createLeadRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Lead name is required')
    .isLength({ min: 2 })
    .withMessage('Lead name must be at least 2 characters long'),
  body('company')
    .trim()
    .notEmpty()
    .withMessage('Company name is required'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Email must be a valid email address'),
  body('phone')
    .optional()
    .trim(),
  body('status')
    .optional()
    .isIn(['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'])
    .withMessage('Status must be one of: New, Contacted, Meeting Scheduled, Proposal Sent, Won, Lost'),
  body('source')
    .optional()
    .isIn(['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Other'])
    .withMessage('Source must be one of: Website, Referral, LinkedIn, Cold Call, Email Campaign, Other'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters')
];

// 2. Validation rules definition for Lead Profile Updates
const updateLeadRules = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Lead name must be at least 2 characters long'),
  body('company')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Company name cannot be empty'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Email must be a valid email address'),
  body('phone')
    .optional()
    .trim(),
  body('status')
    .optional()
    .isIn(['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'])
    .withMessage('Status must be one of: New, Contacted, Meeting Scheduled, Proposal Sent, Won, Lost'),
  body('source')
    .optional()
    .isIn(['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Other'])
    .withMessage('Source must be one of: Website, Referral, LinkedIn, Cold Call, Email Campaign, Other'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters')
];

// 3. Validation rules definition for Pipeline Status Patching
const patchStatusRules = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'])
    .withMessage('Status must be one of: New, Contacted, Meeting Scheduled, Proposal Sent, Won, Lost')
];

// --- Wire up all 8 endpoints ---

// A. Collection CRUD & Aggregated Queries (registered before parameterized routes)
router.get('/', getLeads);
router.post('/', validate(createLeadRules), createLead);
router.get('/stats', getLeadStats);
router.get('/stats/summary', getLeadStats);
router.get('/analytics', getMonthlyStats);
router.get('/stats/monthly', getMonthlyStats);
router.get('/search', searchLeads);

// B. Member CRUD operations
router.get('/:id', getLeadById);
router.put('/:id', validate(updateLeadRules), updateLead);
router.patch('/:id/status', validate(patchStatusRules), updateLeadStatus);
router.delete('/:id', deleteLead);

export default router;
