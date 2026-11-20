const StartupProject = require('../models/StartupProject');
const MVPPlan = require('../models/MVPPlan');
const { successResponse } = require('../utils/responseHelper');

/**
 * Retrieves aggregate system analytics and recent activity for the dashboard
 * @route GET /api/dashboard/stats
 */
const getStats = async (req, res, next) => {
  try {
    const [
      totalProjects,
      totalMVPPlans,
      completedProjects,
      recentProjects,
      recentlyUpdated,
      rawProjectsByIndustry,
      rawProjectsByStatus
    ] = await Promise.all([
      StartupProject.countDocuments(),
      MVPPlan.countDocuments(),
      StartupProject.countDocuments({ status: 'completed' }),
      StartupProject.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      StartupProject.find()
        .sort({ updatedAt: -1 })
        .limit(5)
        .lean(),
      StartupProject.aggregate([
        { $group: { _id: '$industry', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      StartupProject.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
    ]);

    const projectsByIndustry = rawProjectsByIndustry.map((item) => ({
      industry: item._id,
      count: item.count
    }));

    const projectsByStatus = rawProjectsByStatus.map((item) => ({
      status: item._id,
      count: item.count
    }));

    // Build a recent activity feed from the most recently updated projects
    const recentActivity = recentlyUpdated.map((p) => ({
      description: `"${p.title}" was ${p.status === 'completed' ? 'MVP plan generated' : p.status === 'analyzing' ? 'being analyzed' : 'updated'}`,
      timestamp: p.updatedAt
    }));

    return successResponse(
      res,
      {
        totalProjects,
        totalMVPPlans,
        // Frontend-friendly aliases
        totalPlans: totalMVPPlans,
        completedPlans: completedProjects,
        avgTimeline: '3-6 months',
        recentProjects,
        recentlyUpdated,
        recentActivity,
        projectsByIndustry,
        projectsByStatus
      },
      'Dashboard stats retrieved successfully',
      200
    );
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getStats
};
