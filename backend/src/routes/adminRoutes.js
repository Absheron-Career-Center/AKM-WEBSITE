const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.post('/login', AdminController.adminLogin);

router.get('/users', authMiddleware, adminMiddleware, AdminController.getAllUserSubmissions);

module.exports = router;