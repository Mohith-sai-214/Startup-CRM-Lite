import Lead from '../models/Lead.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse.js';

/**
 * Controller class managing the lifecycle of Leads inside the CRM.
 * Implements strict tenant-isolation by filtering operations by req.user._id.
 */

/**
 * Retrieves a list of leads belonging to the user, with pagination, sorting, search, and status filters.
 * 
 * @route   GET /api/leads
 * @access  Private
 * @param {Object} req - Express request object.
 * @param {Object} req.query - Request query parameters.
 * @param {number} [req.query.page=1] - Current page number.
 * @param {number} [req.query.limit=20] - Number of items per page.
 * @param {string} [req.query.sortBy='createdAt'] - Document field sorting criteria.
 * @param {string} [req.query.sortOrder='desc'] - Sort order direction ('asc' | 'desc').
 * @param {string} [req.query.status] - Filter by lead status.
 * @param {string} [req.query.source] - Filter by acquisition source.
 * @param {string} [req.query.search] - Regex keyword lookup on name, company, or email.
 * @param {string} [req.query.dateFrom] - Start date cutoff.
 * @param {string} [req.query.dateTo] - End date cutoff.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware callback.
 * @returns {Promise<Object>} Paginated leads array list response.
 */
export const getLeads = async (req, res, next) => {
  const {
    page = 1,
    limit = 20,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    status,
    search,
    source,
    dateFrom,
    dateTo
  } = req.query;

  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[leadController] getLeads called by user ${req.user._id}`);
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    // 1. Build the dynamic filter (always isolate by owner)
    const filter = { owner: req.user._id };

    if (status && status !== 'All') {
      filter.status = status;
    }

    if (source && source !== 'All') {
      filter.source = source;
    }

    // Apply regex search with case-insensitive option
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by createdAt date range if specified
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo);
    }

    // Determine sorting criteria
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute queries in parallel
    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limitNum),
      Lead.countDocuments(filter)
    ]);

    return paginatedResponse(res, leads, total, pageNum, limitNum);
  } catch (error) {
    next(error);
  }
};

/**
 * Creates a new lead assigned to the current user.
 * 
 * @route   POST /api/leads
 * @access  Private
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware callback.
 * @returns {Promise<Object>} Success response containing the created lead document.
 */
export const createLead = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[leadController] createLead called by user ${req.user._id}`);
    }

    // Avoid manual hijacking of owner field by forcing req.user._id
    const leadData = {
      ...req.body,
      owner: req.user._id
    };

    const newLead = await Lead.create(leadData);

    return successResponse(res, newLead, 'Lead created successfully', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves a single lead by its identifier. Enforces owner verification.
 * 
 * @route   GET /api/leads/:id
 * @access  Private
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware callback.
 * @returns {Promise<Object>} Success response containing the matched lead document.
 */
export const getLeadById = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[leadController] getLeadById (ID: ${req.params.id}) called by user ${req.user._id}`);
    }

    const lead = await Lead.findOne({ _id: req.params.id, owner: req.user._id });
    if (!lead) {
      return errorResponse(res, 'Lead not found', 404);
    }

    return successResponse(res, lead, 'Lead retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Updates an existing lead's profile details. Enforces owner verification and blocks manual owner hijacking.
 * 
 * @route   PUT /api/leads/:id
 * @access  Private
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware callback.
 * @returns {Promise<Object>} Success response containing the updated lead document.
 */
export const updateLead = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[leadController] updateLead (ID: ${req.params.id}) called by user ${req.user._id}`);
    }

    // Do not allow changing the lead owner
    const updateData = { ...req.body };
    delete updateData.owner;

    const updatedLead = await Lead.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedLead) {
      return errorResponse(res, 'Lead not found', 404);
    }

    return successResponse(res, updatedLead, 'Lead updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Updates a lead's pipeline status only. Enforces owner verification.
 * 
 * @route   PATCH /api/leads/:id/status
 * @access  Private
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware callback.
 * @returns {Promise<Object>} Success response containing the updated lead document.
 */
export const updateLeadStatus = async (req, res, next) => {
  const { status } = req.body;

  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[leadController] updateLeadStatus (ID: ${req.params.id}) called by user ${req.user._id}`);
    }

    const updatedLead = await Lead.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedLead) {
      return errorResponse(res, 'Lead not found', 404);
    }

    return successResponse(res, updatedLead, 'Lead status updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Deletes a lead record from the database. Enforces owner verification.
 * 
 * @route   DELETE /api/leads/:id
 * @access  Private
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware callback.
 * @returns {Promise<Object>} Success message response.
 */
export const deleteLead = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[leadController] deleteLead (ID: ${req.params.id}) called by user ${req.user._id}`);
    }

    const lead = await Lead.findOne({ _id: req.params.id, owner: req.user._id });
    if (!lead) {
      return errorResponse(res, 'Lead not found', 404);
    }

    await lead.deleteOne();

    return successResponse(res, null, 'Lead deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Aggregates summary statistics about leads using a SINGLE database aggregation query.
 * Gathers status counts, source allocations, current/prior month counts, growth metrics, and conversion rates.
 * 
 * @route   GET /api/leads/stats/summary
 * @access  Private
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware callback.
 * @returns {Promise<Object>} Statistics aggregate details response.
 */
export const getLeadStats = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[leadController] getLeadStats called by user ${req.user._id}`);
    }

    const now = new Date();
    // Start of the current month
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    // Start of the previous month
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Single query aggregation utilizing $facet to group multiple metrics pipelines
    const statsResult = await Lead.aggregate([
      { $match: { owner: req.user._id } },
      {
        $facet: {
          total: [
            { $count: 'count' }
          ],
          byStatus: [
            { $group: { _id: '$status', count: { $sum: 1 } } }
          ],
          bySource: [
            { $group: { _id: '$source', count: { $sum: 1 } } }
          ],
          thisMonth: [
            {
              $match: {
                createdAt: { $gte: startOfThisMonth }
              }
            },
            { $count: 'count' }
          ],
          lastMonth: [
            {
              $match: {
                createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth }
              }
            },
            { $count: 'count' }
          ]
        }
      }
    ]);

    const result = statsResult[0];

    const totalLeads = result.total[0]?.count || 0;
    const thisMonthLeads = result.thisMonth[0]?.count || 0;
    const lastMonthLeads = result.lastMonth[0]?.count || 0;

    // Setup Status counts breakdown object
    const statusBreakdown = {
      New: 0,
      Contacted: 0,
      'Meeting Scheduled': 0,
      'Proposal Sent': 0,
      Won: 0,
      Lost: 0
    };
    result.byStatus.forEach((item) => {
      if (item._id && statusBreakdown[item._id] !== undefined) {
        statusBreakdown[item._id] = item.count;
      }
    });

    // Setup Source counts breakdown object
    const sourceBreakdown = {
      Website: 0,
      Referral: 0,
      LinkedIn: 0,
      'Cold Call': 0,
      'Email Campaign': 0,
      Other: 0
    };
    result.bySource.forEach((item) => {
      if (item._id && sourceBreakdown[item._id] !== undefined) {
        sourceBreakdown[item._id] = item.count;
      }
    });

    // Conversion rate: (Won / Total) * 100, rounded to 1 decimal place. Prevent division-by-zero.
    const wonCount = statusBreakdown.Won || 0;
    const conversionRate =
      totalLeads > 0 ? parseFloat(((wonCount / totalLeads) * 100).toFixed(1)) : 0.0;

    // Growth rate calculation. Handle division by zero.
    let growthRate = 0.0;
    if (lastMonthLeads > 0) {
      growthRate = parseFloat(
        (((thisMonthLeads - lastMonthLeads) / lastMonthLeads) * 100).toFixed(1)
      );
    } else if (thisMonthLeads > 0) {
      growthRate = 100.0; // Assume 100% growth if starting from 0
    }

    const statsObject = {
      totalLeads,
      statusBreakdown,
      conversionRate,
      sourceBreakdown,
      thisMonthLeads,
      lastMonthLeads,
      growthRate
    };

    return successResponse(res, statsObject, 'Lead statistics aggregated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Aggregates monthly lead metrics over the past 6 months.
 * Formats keys as 'Month Year' (e.g. 'Jan 2026') and handles months with 0 leads.
 * 
 * @route   GET /api/leads/stats/monthly
 * @access  Private
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware callback.
 * @returns {Promise<Object>} List of monthly stats chronologically sorted.
 */
export const getMonthlyStats = async (req, res, next) => {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[leadController] getMonthlyStats called by user ${req.user._id}`);
    }

    const today = new Date();
    // Cutoff date is the 1st of the month 5 months ago
    const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 5, 1);

    // Group leads by year and month
    const results = await Lead.aggregate([
      {
        $match: {
          owner: req.user._id,
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          total: { $sum: 1 },
          won: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Won'] }, 1, 0]
            }
          },
          lost: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Lost'] }, 1, 0]
            }
          }
        }
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1
        }
      }
    ]);

    // Build default chronological structure for the past 6 months
    const chronologicalMonths = [];
    for (let i = 5; i >= 0; i--) {
      const targetDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const mName = monthNames[targetDate.getMonth()];
      const yName = targetDate.getFullYear();
      chronologicalMonths.push({
        month: `${mName} ${yName}`,
        year: yName,
        monthNum: targetDate.getMonth() + 1,
        total: 0,
        won: 0,
        lost: 0,
        conversionRate: 0.0
      });
    }

    // Fill data matching the records
    results.forEach((row) => {
      const target = chronologicalMonths.find(
        (m) => m.monthNum === row._id.month && m.year === row._id.year
      );
      if (target) {
        target.total = row.total;
        target.won = row.won;
        target.lost = row.lost;
        target.conversionRate =
          row.total > 0 ? parseFloat(((row.won / row.total) * 100).toFixed(1)) : 0.0;
      }
    });

    // Remove internal parsing keys
    const sanitizedMonthlyStats = chronologicalMonths.map(
      ({ month, total, won, lost, conversionRate }) => ({
        month,
        total,
        won,
        lost,
        conversionRate
      })
    );

    return successResponse(res, sanitizedMonthlyStats, 'Monthly statistics calculated');
  } catch (error) {
    next(error);
  }
};

/**
 * Autocomplete quick search query. Returns minimal lead details.
 * 
 * @route   GET /api/leads/search
 * @access  Private
 * @param {Object} req - Express request object.
 * @param {Object} req.query - Request query parameters.
 * @param {string} req.query.q - Text query.
 * @param {number} [req.query.limit=5] - Return limit cap.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware callback.
 * @returns {Promise<Object>} Array of matching minimal lead profiles.
 */
export const searchLeads = async (req, res, next) => {
  const { q, limit = 5 } = req.query;

  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[leadController] searchLeads called with query "${q}" by user ${req.user._id}`);
    }

    if (!q) {
      return successResponse(res, [], 'Search query empty');
    }

    const limitNum = Math.min(parseInt(limit, 10) || 5, 20);
    const searchRegex = new RegExp(q, 'i');

    const leads = await Lead.find({
      owner: req.user._id,
      $or: [
        { name: searchRegex },
        { company: searchRegex },
        { email: searchRegex }
      ]
    })
      .select('_id name company email status')
      .limit(limitNum);

    return successResponse(res, leads, 'Search autocomplete completed');
  } catch (error) {
    next(error);
  }
};
