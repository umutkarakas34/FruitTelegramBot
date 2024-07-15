const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const authenticateAdmin = require('../middleware/authenticateAdmin');

router.get('/profile', userController.login);
router.get('/tasks', userController.getTasks);

module.exports = router;