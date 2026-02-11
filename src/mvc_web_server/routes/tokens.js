const express = require('express');
const router = express.Router();
const tokenController = require('../controllers/tokenController.js');

// Route for Registration
router.route('/')
    .post(tokenController.doesUserExist);

module.exports = router;