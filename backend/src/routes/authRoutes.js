// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register); // Protect this endpoint in production!
router.post('/login', authController.login);

module.exports = router;