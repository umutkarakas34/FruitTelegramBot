const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const authenticateUser = require('../middleware/authenticateUser');

//PROFILE
router.get('/profile', userController.login);
router.get('/get-user-id', userController.getUserId);
router.get('/tasks', userController.getTasks);

//GAME 
router.post('/create-gamelog', userController.createGameLog);
router.post('/add-tokens', userController.addToken);
router.post('/increase-ticket', userController.increaseTicket);


//REFERRALS
router.get('/referrals', userController.getReferrals)
router.post('/claim-ref', userController.claim);
router.get('/get-referral-tokens', userController.getReferralTokens);


//FARMING
router.post('/start-farming', userController.startFarming);
router.post('/claim-farming', userController.claimFarming);
router.post('/farming-status', userController.farmingStatus);


//DAILY CHECKIN
router.post('/checkin', userController.checkIn);
router.post('/checkin-status', userController.checkInStatus);
router.post('/get-checkin', userController.getCheckIn);


//TASK
router.post('/complete-task', userController.completeTask);
router.get('/user-tasks', userController.userTasks);

//STATISTICS
router.get('/statistics', userController.getStatistics);

module.exports = router;
