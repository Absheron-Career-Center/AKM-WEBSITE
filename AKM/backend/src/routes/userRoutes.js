// routes/userRoutes.js
const express = require('express');
const userController = require('../controllers/userController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/profile', authMiddleware, userController.getProfile); 
router.post('/verify', userController.verify);
router.get('/me', authMiddleware, userController.getCurrentUser); 
router.get('/:id', authMiddleware, userController.getUserById);
router.put('/:id', authMiddleware, userController.updateUser);
module.exports = router;