const mongoose = require('mongoose');

const INDUSTRY_ENUM = [
  'Technology',
  'Healthcare',
  'Education',
  'Finance',
  'E-commerce',
  'Entertainment',
  'Food & Beverage',
  'Travel',
  'Real Estate',
  'Other'
];

const TIMELINE_ENUM = [
  '1-3 months',
  '3-6 months',
  '6-12 months',
  '12+ months'
];

const STATUS_ENUM = ['draft', 'analyzing', 'completed'];

const startupProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [200, 'Project title cannot exceed 200 characters']
    },
    businessIdea: {
      type: String,
      required: [true, 'Business idea description is required'],
      trim: true,
      maxlength: [2000, 'Business idea cannot exceed 2000 characters']
    },
    problem: {
      type: String,
      required: [true, 'Problem statement is required'],
      trim: true,
      maxlength: [1000, 'Problem statement cannot exceed 1000 characters']
    },
    targetAudience: {
      type: String,
      required: [true, 'Target audience is required'],
      trim: true,
      maxlength: [500, 'Target audience cannot exceed 500 characters']
    },
    industry: {
      type: String,
      required: [true, 'Industry is required'],
      enum: {
        values: INDUSTRY_ENUM,
        message: '{VALUE} is not a supported industry'
      }
    },
    timeline: {
      type: String,
      required: [true, 'Timeline is required'],
      enum: {
        values: TIMELINE_ENUM,
        message: '{VALUE} is not a valid timeline'
      }
    },
    additionalRequirements: {
      type: String,
      trim: true,
      maxlength: [1000, 'Additional requirements cannot exceed 1000 characters'],
      default: ''
    },
    status: {
      type: String,
      enum: {
        values: STATUS_ENUM,
        message: '{VALUE} is not a valid project status'
      },
      default: 'draft'
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual relationship to MVPPlan
startupProjectSchema.virtual('mvpPlan', {
  ref: 'MVPPlan',
  localField: '_id',
  foreignField: 'projectId',
  justOne: true
});

const StartupProject = mongoose.model('StartupProject', startupProjectSchema);

StartupProject.INDUSTRY_ENUM = INDUSTRY_ENUM;
StartupProject.TIMELINE_ENUM = TIMELINE_ENUM;
StartupProject.STATUS_ENUM = STATUS_ENUM;

module.exports = StartupProject;
