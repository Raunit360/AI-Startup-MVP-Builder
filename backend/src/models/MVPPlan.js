const mongoose = require('mongoose');

const PRIORITY_ENUM = ['High', 'Medium', 'Low'];

const coreFeatureSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    priority: {
      type: String,
      enum: PRIORITY_ENUM,
      default: 'High'
    },
    estimatedTime: {
      type: String,
      trim: true,
      default: ''
    }
  },
  { _id: false }
);

const optionalFeatureSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    priority: {
      type: String,
      enum: PRIORITY_ENUM,
      default: 'Medium'
    }
  },
  { _id: false }
);

const technologyStackSchema = new mongoose.Schema(
  {
    frontend: { type: String, default: '' },
    backend: { type: String, default: '' },
    database: { type: String, default: '' },
    aiTools: { type: String, default: '' },
    other: { type: String, default: '' }
  },
  { _id: false }
);

const roadmapPhaseSchema = new mongoose.Schema(
  {
    phase: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    duration: {
      type: String,
      required: true,
      trim: true
    },
    tasks: {
      type: [String],
      default: []
    }
  },
  { _id: false }
);

const riskSchema = new mongoose.Schema(
  {
    risk: {
      type: String,
      required: true,
      trim: true
    },
    mitigation: {
      type: String,
      required: true,
      trim: true
    },
    severity: {
      type: String,
      enum: PRIORITY_ENUM,
      default: 'Medium'
    }
  },
  { _id: false }
);

const successMetricSchema = new mongoose.Schema(
  {
    metric: {
      type: String,
      required: true,
      trim: true
    },
    target: {
      type: String,
      required: true,
      trim: true
    },
    timeline: {
      type: String,
      required: true,
      trim: true
    }
  },
  { _id: false }
);

const mvpPlanSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StartupProject',
      required: [true, 'Associated project ID is required'],
      unique: true,
      index: true
    },
    problemStatement: {
      type: String,
      trim: true,
      default: ''
    },
    proposedSolution: {
      type: String,
      trim: true,
      default: ''
    },
    targetUsers: {
      type: String,
      trim: true,
      default: ''
    },
    valueProposition: {
      type: String,
      trim: true,
      default: ''
    },
    coreFeatures: {
      type: [coreFeatureSchema],
      default: []
    },
    optionalFeatures: {
      type: [optionalFeatureSchema],
      default: []
    },
    technologyStack: {
      type: technologyStackSchema,
      default: () => ({})
    },
    developmentRoadmap: {
      type: [roadmapPhaseSchema],
      default: []
    },
    risks: {
      type: [riskSchema],
      default: []
    },
    successMetrics: {
      type: [successMetricSchema],
      default: []
    },
    estimatedTimeline: {
      type: String,
      trim: true,
      default: ''
    },
    generatedAt: {
      type: Date,
      default: Date.now
    },
    rawResponse: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

const MVPPlan = mongoose.model('MVPPlan', mvpPlanSchema);

MVPPlan.PRIORITY_ENUM = PRIORITY_ENUM;

module.exports = MVPPlan;
