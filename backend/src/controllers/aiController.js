const geminiService = require('../services/geminiService');
const { successResponse } = require('../utils/responseHelper');

/**
 * Directly analyzes a startup idea and returns a structured MVP plan using Gemini AI
 * @route POST /api/ai/analyze
 */
const analyzeIdea = async (req, res, next) => {
  try {
    const {
      title,
      businessIdea,
      problem,
      targetAudience,
      industry,
      timeline,
      additionalRequirements
    } = req.body;

    // Validate required fields
    const missing = [];
    if (!title) missing.push('title');
    if (!businessIdea) missing.push('businessIdea');
    if (!problem) missing.push('problem');
    if (!targetAudience) missing.push('targetAudience');
    if (!industry) missing.push('industry');
    if (!timeline) missing.push('timeline');

    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        error: {
          message: `Missing required fields for AI analysis: ${missing.join(', ')}`,
          code: 'VALIDATION_ERROR',
          details: missing
        }
      });
    }

    const plan = await geminiService.generateMVPPlan({
      title,
      businessIdea,
      problem,
      targetAudience,
      industry,
      timeline,
      additionalRequirements
    });

    return successResponse(res, plan, 'MVP Plan generated successfully', 200);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  analyzeIdea
};
