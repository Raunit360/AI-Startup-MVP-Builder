
const mongoose = require('mongoose');

const StartupProject = require('../models/StartupProject');
const MVPPlan = require('../models/MVPPlan');
const geminiService = require('../services/geminiService');
const { successResponse, errorResponse } = require('../utils/responseHelper');

/**
 * Normalize Gemini response to match the MVPPlan MongoDB schema.
 */
const normalizeMVPPlan = (plan) => {
  const targetUsers = Array.isArray(plan.targetUsers)
    ? plan.targetUsers.join(', ')
    : String(plan.targetUsers || '');

  // Normalize technology stack
  const technologyStack = {
    frontend: '',
    backend: '',
    database: '',
    aiTools: '',
    other: ''
  };

  if (Array.isArray(plan.technologyStack)) {
    plan.technologyStack.forEach((item) => {
      const category = String(item.category || '').toLowerCase();
      const technology = item.technology || '';

      if (category.includes('frontend')) {
        technologyStack.frontend = technology;
      } else if (category.includes('backend')) {
        technologyStack.backend = technology;
      } else if (category.includes('database')) {
        technologyStack.database = technology;
      } else if (category.includes('ai')) {
        technologyStack.aiTools = technology;
      } else {
        technologyStack.other +=
          `${technology}${technologyStack.other ? ', ' : ''}`;
      }
    });
  } else if (plan.technologyStack && typeof plan.technologyStack === 'object') {
    Object.assign(technologyStack, plan.technologyStack);
  }

  // Normalize roadmap
  const developmentRoadmap = (plan.developmentRoadmap || []).map(
    (item, index) => ({
      phase: Number(item.phase) || index + 1,
      title: item.title || `Phase ${index + 1}`,
      duration: item.duration || 'Not specified',
      tasks: Array.isArray(item.tasks) ? item.tasks : []
    })
  );

  // Normalize success metrics
  const successMetrics = (plan.successMetrics || []).map((item) => ({
    metric: item.metric || 'Success metric',
    target: item.target || 'Not specified',
    timeline:
      item.timeline || plan.estimatedTimeline || '3-6 months'
  }));

  return {
    problemStatement: plan.problemStatement || '',
    proposedSolution: plan.proposedSolution || '',
    targetUsers,
    valueProposition: plan.valueProposition || '',
    coreFeatures: Array.isArray(plan.coreFeatures)
      ? plan.coreFeatures
      : [],
    optionalFeatures: Array.isArray(plan.optionalFeatures)
      ? plan.optionalFeatures
      : [],
    technologyStack,
    developmentRoadmap,
    risks: Array.isArray(plan.risks) ? plan.risks : [],
    successMetrics,
    estimatedTimeline: plan.estimatedTimeline || '3-6 months',
    rawResponse: plan.rawResponse || ''
  };
};

/**
 * Creates a new startup project
 * @route POST /api/projects
 */
const createProject = async (req, res, next) => {
  try {
    const project = new StartupProject(req.body);
    const savedProject = await project.save();

    return successResponse(
      res,
      savedProject,
      'Startup project created successfully',
      201
    );
  } catch (err) {
    return next(err);
  }
};

/**
 * Retrieves all startup projects
 * @route GET /api/projects
 */
const getProjects = async (req, res, next) => {
  try {
    const { search, industry, status } = req.query;
    const filter = {};

    if (search && typeof search === 'string' && search.trim()) {
      filter.title = { $regex: search.trim(), $options: 'i' };
    }

    if (industry && StartupProject.INDUSTRY_ENUM.includes(industry)) {
      filter.industry = industry;
    }

    if (status && StartupProject.STATUS_ENUM.includes(status)) {
      filter.status = status;
    }

    const projects = await StartupProject.find(filter)
      .sort({ updatedAt: -1 })
      .lean();

    const projectIds = projects.map((project) => project._id);

    const plans = await MVPPlan.find(
      { projectId: { $in: projectIds } },
      { projectId: 1 }
    ).lean();

    const planSet = new Set(
      plans.map((plan) => plan.projectId.toString())
    );

    const enrichedProjects = projects.map((project) => ({
      ...project,
      hasPlan: planSet.has(project._id.toString())
    }));

    return successResponse(
      res,
      enrichedProjects,
      'Projects retrieved successfully',
      200
    );
  } catch (err) {
    return next(err);
  }
};

/**
 * Retrieves a single project
 * @route GET /api/projects/:id
 */
const getProjectById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return errorResponse(res, 'Invalid project ID', 400);
    }

    const project = await StartupProject.findById(id).lean();

    if (!project) {
      return errorResponse(res, `Project with ID '${id}' not found`, 404);
    }

    const mvpPlan = await MVPPlan.findOne({ projectId: id }).lean();

    return successResponse(
      res,
      {
        ...project,
        mvpPlan: mvpPlan || null,
        hasPlan: !!mvpPlan
      },
      'Project retrieved successfully',
      200
    );
  } catch (err) {
    return next(err);
  }
};

/**
 * Updates an existing project
 * @route PUT /api/projects/:id
 */
const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return errorResponse(res, 'Invalid project ID', 400);
    }

    const project = await StartupProject.findById(id);

    if (!project) {
      return errorResponse(res, `Project with ID '${id}' not found`, 404);
    }

    Object.assign(project, req.body);

    const updatedProject = await project.save();

    return successResponse(
      res,
      updatedProject,
      'Project updated successfully',
      200
    );
  } catch (err) {
    return next(err);
  }
};

/**
 * Deletes a project and its associated plan
 * @route DELETE /api/projects/:id
 */
const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return errorResponse(res, 'Invalid project ID', 400);
    }

    const project = await StartupProject.findById(id);

    if (!project) {
      return errorResponse(res, `Project with ID '${id}' not found`, 404);
    }

    await MVPPlan.deleteMany({ projectId: id });
    await StartupProject.findByIdAndDelete(id);

    return successResponse(
      res,
      { id, deleted: true },
      'Project and associated MVP plan successfully deleted',
      200
    );
  } catch (err) {
    return next(err);
  }
};

/**
 * Generates and saves an MVP plan using Gemini
 * @route POST /api/projects/:id/generate-plan
 */
const generatePlan = async (req, res, next) => {
  let project;

  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return errorResponse(res, 'Invalid project ID', 400);
    }

    project = await StartupProject.findById(id);

    if (!project) {
      return errorResponse(res, `Project with ID '${id}' not found`, 404);
    }

    project.status = 'analyzing';
    await project.save();

    console.log(`[Project] Generating MVP plan for: ${project.title}`);

    // Generate the plan using Gemini
    const generatedPlan = await geminiService.generateMVPPlan({
      title: project.title,
      businessIdea: project.businessIdea,
      problem: project.problem,
      targetAudience: project.targetAudience,
      industry: project.industry,
      timeline: project.timeline,
      additionalRequirements: project.additionalRequirements
    });

    // Normalize Gemini output to match Mongoose schema
    const normalizedPlan = normalizeMVPPlan(generatedPlan);

    console.log('[Project] Gemini response normalized successfully.');

    // Save or update MVPPlan in MongoDB
    const mvpPlan = await MVPPlan.findOneAndUpdate(
      { projectId: project._id },
      {
        $set: {
          ...normalizedPlan,
          projectId: project._id,
          generatedAt: new Date()
        }
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true
      }
    );

    // Mark project completed only after plan is saved
    project.status = 'completed';
    await project.save();

    console.log(`[Project] MVP plan saved for project ${id}`);

    return successResponse(
      res,
      {
        project,
        mvpPlan
      },
      'MVP Plan generated and saved successfully',
      201
    );
  } catch (err) {
    console.error('[Project] MVP generation/save error:', err.message);

    // Restore draft status if generation or saving fails
    if (project) {
      try {
        project.status = 'draft';
        await project.save();
      } catch (statusError) {
        console.error(
          '[Project] Could not restore project status:',
          statusError.message
        );
      }
    }

    return next(err);
  }
};

/**
 * Retrieves the saved MVP plan
 * @route GET /api/projects/:id/plan
 */
const getPlan = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return errorResponse(res, 'Invalid project ID', 400);
    }

    const mvpPlan = await MVPPlan.findOne({ projectId: id }).lean();

    if (!mvpPlan) {
      return errorResponse(
        res,
        `No MVP Plan found for project ID '${id}'`,
        404
      );
    }

    return successResponse(
      res,
      mvpPlan,
      'MVP Plan retrieved successfully',
      200
    );
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  generatePlan,
  getPlan
};
