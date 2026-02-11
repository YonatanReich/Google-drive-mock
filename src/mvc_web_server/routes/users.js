const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const isLoggedIn = require('../utils/jwtAuth.js');

router.put("/newSettings/:username", isLoggedIn, userController.updateMySettings);
router.get("/me", isLoggedIn, userController.getMySettings);
router.patch("/update", isLoggedIn, userController.updateSettingsById);

// Route for Registration
router.route('/')
    .post(userController.register);

router.get('/by-username/:username', isLoggedIn, userController.getUserByUsername);

// Route for User Profile
router.route('/:id')
    .get(userController.getUserDetails);

module.exports = router;