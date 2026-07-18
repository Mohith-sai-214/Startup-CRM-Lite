import mongoose from 'mongoose';

// Regular expression to validate standard email formats
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Mongoose Schema for the Lead model.
 * Contains prospect details, status tracking, source attribution, and owner linkage.
 */
export const leadSchema = new mongoose.Schema(
  {
    /**
     * The full name of the lead contact.
     * Must be between 2 and 100 characters.
     */
    name: {
      type: String,
      required: [true, 'Lead name is required'],
      trim: true,
      minlength: [2, 'Lead name must be at least 2 characters long'],
      maxlength: [100, 'Lead name cannot exceed 100 characters']
    },
    /**
     * The name of the company or organization the lead represents.
     */
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true
    },
    /**
     * The email address of the lead.
     * Validated using a regular expression for correct email formats.
     */
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      match: [emailRegex, 'Email must be a valid email address']
    },
    /**
     * Optional phone number for the lead.
     */
    phone: {
      type: String,
      trim: true
    },
    /**
     * The sales pipeline status of the lead.
     * Restrained to frontend exact match categories. Defaults to 'New'.
     */
    status: {
      type: String,
      enum: {
        values: ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'],
        message: 'Status must be one of: New, Contacted, Meeting Scheduled, Proposal Sent, Won, Lost'
      },
      default: 'New'
    },
    /**
     * The channel or campaign through which the lead was acquired.
     * Restrained to frontend exact match categories. Defaults to 'Website'.
     */
    source: {
      type: String,
      enum: {
        values: ['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Other'],
        message: 'Source must be one of: Website, Referral, LinkedIn, Cold Call, Email Campaign, Other'
      },
      default: 'Website'
    },
    /**
     * Optional detailed notes, context, or logs of interaction.
     * Cannot exceed 1000 characters.
     */
    notes: {
      type: String,
      maxlength: [1000, 'Notes cannot exceed 1000 characters']
    },
    /**
     * Estimated valuation or deal value of the lead.
     */
    value: {
      type: Number,
      default: 0
    },
    /**
     * Reference to the User (ObjectId) who created and owns this lead.
     * Required field linking to the User collection.
     */
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Lead owner is required']
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes to speed up queries:
// Compound index on (owner, status) for fast filtered dashboard/pipeline queries
leadSchema.index({ owner: 1, status: 1 });
// Index on email for fast lookups
leadSchema.index({ email: 1 });
// Compound index on (owner, createdAt) for pagination sorting and analytics
leadSchema.index({ owner: 1, createdAt: -1 });
// Compound indexes on name and company for autocomplete search
leadSchema.index({ owner: 1, name: 1 });
leadSchema.index({ owner: 1, company: 1 });
// Compound index on (owner, source) for statistics grouping
leadSchema.index({ owner: 1, source: 1 });

/**
 * Virtual getter to calculate the age of the lead in days.
 * Computes the difference between current date and the createdAt timestamp.
 * @returns {number} The age of the lead in full days.
 */
leadSchema.virtual('age').get(function () {
  if (!this.createdAt) return 0;
  const timeDiff = Date.now() - this.createdAt.getTime();
  return Math.floor(timeDiff / (1000 * 60 * 60 * 24));
});

const Lead = mongoose.model('Lead', leadSchema);
export default Lead;
