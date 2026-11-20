const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { validate, createProjectSchema, updateProjectSchema } = require('../middleware/validate');

// Project collection routes
router.get('/', projectController.getProjects);
router.post('/', validate(createProjectSchema), projectController.createProject);

// Single project operations
router.get('/:id', projectController.getProjectById);
router.put('/:id', validate(updateProjectSchema), projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

// AI MVP plan generation & retrieval for specific project
router.post('/:id/generate-plan', projectController.generatePlan);
router.get('/:id/plan', projectController.getPlan);

module.exports = router;
