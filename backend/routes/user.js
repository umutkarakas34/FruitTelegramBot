const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const authenticateUser = require('../middleware/authenticateUser');

router.get('/profile', userController.login);
router.get('/get-user-id', userController.getUserId);
router.get('/tasks', userController.getTasks);
router.post('/create-gamelog', userController.createGameLog);
router.post('/increase-ticket', userController.increaseTicket);
router.get('/referrals', userController.getReferrals)
router.post('/claim-ref', userController.claim);
router.post('/add-tokens', userController.addToken);

router.post('/start-farming', userController.startFarming);
router.post('/claim-farming', userController.claimFarming);
router.post('/farming-status', userController.farmingStatus);

router.post('/checkin', userController.checkIn);
router.post('/checkin-status', userController.checkInStatus);
router.post('/get-checkin', userController.getCheckIn);

router.post('/complete-task', userController.completeTask);
router.get('/user-tasks', userController.userTasks);
router.get('/statistics', userController.getStatistics);


module.exports = router;
