const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController.js');
const isLoggedIn = require('../utils/jwtAuth.js');

// route for searching files: /api/search/:query (method GET)

router.route('/:query')
    .all(isLoggedIn) // validate user ID for all requests
    .get(fileController.searchFiles);
module.exports = router;