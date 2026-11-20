const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { validate, analyzeIdeaSchema } = require('../middleware/validate');

// Rate limiter: maximum 10 AI generation requests per 15-minute window
const aiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    error: {
      message: 'Too many AI analysis requests from this IP. Please try again after 15 minutes.',
      code: 'RATE_LIMIT_EXCEEDED'
    }
  }
});

// Route for immediate AI analysis of an idea
router.post('/analyze', aiRateLimiter, validate(analyzeIdeaSchema), aiController.analyzeIdea);

module.exports = router;
