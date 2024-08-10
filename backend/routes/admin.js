const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const authenticateAdmin = require('../middleware/authenticateAdmin');
const upload = require('../upload'); // Multer middleware'ini içe aktar


router.post('/login', adminController.login);

router.post('/create-task', authenticateAdmin, upload.array('task_images', 10), adminController.createTask); // Resim yükleme
router.get('/tasks', authenticateAdmin, adminController.getTasks);
router.get('/tasks/:id', authenticateAdmin, adminController.getTaskById);
router.put('/tasks/:id', authenticateAdmin, adminController.updateTask);
router.delete('/tasks/:id', authenticateAdmin, adminController.deleteTask);

router.post('/create-blog', authenticateAdmin, adminController.createBlog);
router.get('/blogs', authenticateAdmin, adminController.getBlogs);
router.get('/blogs/:id', authenticateAdmin, adminController.getBlogById);
router.put('/blogs/:id', authenticateAdmin, adminController.updateBlog);
router.delete('/blogs/:id', authenticateAdmin, adminController.deleteBlog);

// Oyunlar ve kullanıcılar için eklediğimiz metodlar
router.get('/games', authenticateAdmin, adminController.getGames);
router.get('/users', authenticateAdmin, adminController.getUsers);
router.get('/dailycheckins', authenticateAdmin, adminController.getDailyCheckins);
router.get('/farmings', authenticateAdmin, adminController.getFarmings);
router.get('/user-referrals', authenticateAdmin, adminController.getUserReferrals);

module.exports = router;