const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

// Define your admin routes here
router.post('/login', adminController.login);
// router.post('/signup', adminController.signup);

module.exports = router;
