// src/routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const authenticateToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

// All student routes require authentication
router.use(authenticateToken);

// Get all students (accessible by all authenticated roles)
router.get('/', studentController.getAllStudents);

// Get student by ID (accessible by all authenticated roles)
router.get('/:id', studentController.getStudentById);

// Add new student (only 'admin' and 'teacher' roles)
router.post('/', authorizeRoles('admin', 'teacher'), studentController.addStudent);

// Update student (only 'admin' and 'teacher' roles)
router.put('/:id', authorizeRoles('admin', 'teacher'), studentController.updateStudent);

// Delete student (only 'admin' role)
router.delete('/:id', authorizeRoles('admin'), studentController.deleteStudent);

module.exports = router;