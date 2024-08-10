const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const authenticateAdmin = require('../middleware/authenticateAdmin');
const upload = require('../upload'); // Multer middleware'ini içe aktar

// Admin login işlemi
router.post('/login', adminController.login);

// Yeni bir görev (task) oluşturma ve resim yükleme
router.post('/create-task', authenticateAdmin, upload.array('task_images', 10), adminController.createTask);

// Tüm görevleri (tasks) listeleme
router.get('/tasks', authenticateAdmin, adminController.getTasks);

// Belirli bir görevi ID ile getirme
router.get('/tasks/:id', authenticateAdmin, adminController.getTaskById);

// Belirli bir görevi ID ile güncelleme
router.put('/tasks/:id', authenticateAdmin, adminController.updateTask);

// Belirli bir görevi ID ile silme
router.delete('/tasks/:id', authenticateAdmin, adminController.deleteTask);

// Yeni bir blog oluşturma
router.post('/create-blog', authenticateAdmin, adminController.createBlog);

// Tüm blogları listeleme
router.get('/blogs', authenticateAdmin, adminController.getBlogs);

// Belirli bir blogu ID ile getirme
router.get('/blogs/:id', authenticateAdmin, adminController.getBlogById);

// Belirli bir blogu ID ile güncelleme
router.put('/blogs/:id', authenticateAdmin, adminController.updateBlog);

// Belirli bir blogu ID ile silme
router.delete('/blogs/:id', authenticateAdmin, adminController.deleteBlog);

// Tüm oyunları (games) listeleme
router.get('/games', authenticateAdmin, adminController.getGames);

// Tüm kullanıcıları (users) listeleme
router.get('/users', authenticateAdmin, adminController.getUsers);

// Tüm günlük girişleri (daily check-ins) listeleme
router.get('/dailycheckins', authenticateAdmin, adminController.getDailyCheckins);

// Tüm farming kayıtlarını listeleme
router.get('/farmings', authenticateAdmin, adminController.getFarmings);

// Kullanıcı referanslarını listeleme
router.get('/user-referrals', authenticateAdmin, adminController.getUserReferrals);

module.exports = router;
