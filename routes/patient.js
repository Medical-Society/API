const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patient');

router.post('/signup', patientController.patientSignUp);
router.get('/', patientController.getAllUsers);
router.get('/verify/:token', patientController.verifyEmail);

module.exports = router;
