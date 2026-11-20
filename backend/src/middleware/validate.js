const Joi = require('joi');
const StartupProject = require('../models/StartupProject');

const createProjectSchema = Joi.object({
  title: Joi.string().trim().max(200).required().messages({
    'string.base': 'Project title must be a string',
    'string.empty': 'Project title is required',
    'string.max': 'Project title cannot exceed 200 characters',
    'any.required': 'Project title is required'
  }),
  businessIdea: Joi.string().trim().max(2000).required().messages({
    'string.base': 'Business idea must be a string',
    'string.empty': 'Business idea is required',
    'string.max': 'Business idea cannot exceed 2000 characters',
    'any.required': 'Business idea is required'
  }),
  problem: Joi.string().trim().max(1000).required().messages({
    'string.base': 'Problem statement must be a string',
    'string.empty': 'Problem statement is required',
    'string.max': 'Problem statement cannot exceed 1000 characters',
    'any.required': 'Problem statement is required'
  }),
  targetAudience: Joi.string().trim().max(500).required().messages({
    'string.base': 'Target audience must be a string',
    'string.empty': 'Target audience is required',
    'string.max': 'Target audience cannot exceed 500 characters',
    'any.required': 'Target audience is required'
  }),
  industry: Joi.string()
    .valid(...StartupProject.INDUSTRY_ENUM)
    .required()
    .messages({
      'any.only': `Industry must be one of: ${StartupProject.INDUSTRY_ENUM.join(', ')}`,
      'any.required': 'Industry is required'
    }),
  timeline: Joi.string()
    .valid(...StartupProject.TIMELINE_ENUM)
    .required()
    .messages({
      'any.only': `Timeline must be one of: ${StartupProject.TIMELINE_ENUM.join(', ')}`,
      'any.required': 'Timeline is required'
    }),
  additionalRequirements: Joi.string().trim().max(1000).allow('', null).optional().messages({
    'string.max': 'Additional requirements cannot exceed 1000 characters'
  }),
  status: Joi.string()
    .valid(...StartupProject.STATUS_ENUM)
    .optional()
    .messages({
      'any.only': `Status must be one of: ${StartupProject.STATUS_ENUM.join(', ')}`
    })
});

const updateProjectSchema = Joi.object({
  title: Joi.string().trim().max(200).optional(),
  businessIdea: Joi.string().trim().max(2000).optional(),
  problem: Joi.string().trim().max(1000).optional(),
  targetAudience: Joi.string().trim().max(500).optional(),
  industry: Joi.string().valid(...StartupProject.INDUSTRY_ENUM).optional(),
  timeline: Joi.string().valid(...StartupProject.TIMELINE_ENUM).optional(),
  additionalRequirements: Joi.string().trim().max(1000).allow('', null).optional(),
  status: Joi.string().valid(...StartupProject.STATUS_ENUM).optional()
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

const analyzeIdeaSchema = Joi.object({
  title: Joi.string().trim().max(200).required().messages({
    'string.empty': 'Title is required',
    'any.required': 'Title is required'
  }),
  businessIdea: Joi.string().trim().max(2000).required().messages({
    'string.empty': 'Business idea is required',
    'any.required': 'Business idea is required'
  }),
  problem: Joi.string().trim().max(1000).required().messages({
    'string.empty': 'Problem description is required',
    'any.required': 'Problem description is required'
  }),
  targetAudience: Joi.string().trim().max(500).required().messages({
    'string.empty': 'Target audience is required',
    'any.required': 'Target audience is required'
  }),
  industry: Joi.string().valid(...StartupProject.INDUSTRY_ENUM).required().messages({
    'any.only': `Industry must be one of: ${StartupProject.INDUSTRY_ENUM.join(', ')}`,
    'any.required': 'Industry is required'
  }),
  timeline: Joi.string().valid(...StartupProject.TIMELINE_ENUM).required().messages({
    'any.only': `Timeline must be one of: ${StartupProject.TIMELINE_ENUM.join(', ')}`,
    'any.required': 'Timeline is required'
  }),
  additionalRequirements: Joi.string().trim().max(1000).allow('', null).optional()
});

/**
 * Middleware factory for validating incoming requests using Joi
 * @param {Joi.ObjectSchema} schema - Joi schema definition
 * @param {'body' | 'query' | 'params'} [property='body'] - Request property to validate
 */
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const details = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message.replace(/['"]/g, '')
      }));

      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed for request data',
          code: 'VALIDATION_ERROR',
          details
        }
      });
    }

    // Replace request property with validated/sanitized value
    req[property] = value;
    next();
  };
};

module.exports = {
  validate,
  createProjectSchema,
  updateProjectSchema,
  analyzeIdeaSchema
};
