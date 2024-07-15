const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const authenticateAdmin = require('../middleware/authenticateAdmin');

router.post('/login', adminController.login);
router.post('/create-task', authenticateAdmin, adminController.createTask);

module.exports = router;