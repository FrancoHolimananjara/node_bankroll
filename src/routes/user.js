const userRoutes = require('express').Router();
const { profile } = require('../controllers/user');
const { authMiddleware } = require('../middleware/auth');

userRoutes.get('/profile', authMiddleware,profile);


module.exports = userRoutes;