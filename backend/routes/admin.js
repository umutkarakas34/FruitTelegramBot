const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const authenticateAdmin = require('../middleware/authenticateAdmin');

router.post('/login', adminController.login);

router.post('/create-task', authenticateAdmin, adminController.createTask);
router.get('/tasks', authenticateAdmin, adminController.getTasks);
router.get('/tasks/:id', authenticateAdmin, adminController.getTaskById);
router.put('/tasks/:id', authenticateAdmin, adminController.updateTask);
router.delete('/tasks/:id', authenticateAdmin, adminController.deleteTask);

router.post('/create-blog', authenticateAdmin, adminController.createBlog);
router.get('/blogs', authenticateAdmin, adminController.getBlogs);
router.get('/blogs/:id', authenticateAdmin, adminController.getBlogById);
router.put('/blogs/:id', authenticateAdmin, adminController.updateBlog);
router.delete('/blogs/:id', authenticateAdmin, adminController.deleteBlog);

module.exports = router;