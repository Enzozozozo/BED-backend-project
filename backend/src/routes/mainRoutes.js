const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../../src/middlewares/jwtMiddleware');
const bcryptMiddleware = require('../../src/middlewares/bcryptMiddleware');
const challengeController = require('../controllers/challengeController');
const userController = require('../../src/controllers/userController');
const inventoryController = require('../../src/controllers/inventoryController');
const upgradeController = require('../../src/controllers/upgradeController');
const reviewcontroller = require('../controllers/reviewController');

router.post("/auth/login", userController.login, bcryptMiddleware.comparePassword, jwtMiddleware.generateToken, jwtMiddleware.sendToken); 
router.post("/auth/register", userController.checkUsernameOrEmailExist, bcryptMiddleware.hashPassword, userController.register, jwtMiddleware.generateToken, jwtMiddleware.sendToken);  


router.get('/:userId/readInventorybyId', jwtMiddleware.verifyToken, inventoryController.readInventorybyId);
router.get('/:monkeyId/readMonkeyById', inventoryController.readMonkeyById);
router.post('/:monkeyId/addMonkey', jwtMiddleware.verifyToken, inventoryController.readMonkeyByIdMiddleware, inventoryController.addMonkey);
router.put('/:userId/removeMonkey/:monkeyId', jwtMiddleware.verifyToken, inventoryController.readMonkeyByIdMiddleware, inventoryController.removeMonkey);
router.put('/:user_id/updateUserById', jwtMiddleware.verifyToken, userController.updateUserById);

router.put("/:monkeyId/deductSkillPoints", jwtMiddleware.verifyToken, inventoryController.readMonkeyByIdMiddleware, upgradeController.deductSkillpoints)
router.put("/:monkeyId/:btnId/deductSkillPointsUpgrade", jwtMiddleware.verifyToken, inventoryController.readMonkeyByIdMiddleware, inventoryController.readInventorybyIdMiddleware, upgradeController.deductSkillpointsUpgrade)
router.get("/:userId/readSkillpointsbyId", jwtMiddleware.verifyToken, userController.readSkillpointsbyId)



router.get('/readAllChallenges', challengeController.readAllChallenges);
router.post('/createNewChallenge', jwtMiddleware.verifyToken, challengeController.createNewChallenge);
router.put('/:challengeId/updateChallengeById', jwtMiddleware.verifyToken, challengeController.updateChallengeById); 
router.delete('/:challenge_id/deleteChallengeById', jwtMiddleware.verifyToken, challengeController.deleteChallengeById);
router.post('/:challenge_id/createCompletionForChallenge', jwtMiddleware.verifyToken, challengeController.createCompletionForChallenge); 
router.get('/:challenge_id/getParticipantsByChallengeId', jwtMiddleware.verifyToken, challengeController.getParticipantsByChallengeId);




router.get('/readAllReview', jwtMiddleware.verifyToken,reviewcontroller.readAllReview);
router.post('/createReview', jwtMiddleware.verifyToken,reviewcontroller.createReview);
router.get('/:userId/readReviewById/:id', jwtMiddleware.verifyToken,reviewcontroller.readReviewById);
router.put('/:userId/updateReviewById/:id', jwtMiddleware.verifyToken,reviewcontroller.updateReviewById);
router.delete('/:userId/deleteReviewById/:id', jwtMiddleware.verifyToken,reviewcontroller.deleteReviewById);






module.exports = router;
