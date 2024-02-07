const express = require('express');
const doctorController = require('../controllers/doctor');

const router = express.Router();

router.get('/');
router.get('/:id');
router.post('/signup', doctorController.signup);
router.post('/login', doctorController.login);
router.get('/verify/:token', doctorController.verifyEmail);

module.exports = router;
