const express = require('express');

// controllers
const doctorController = require('../controllers/doctor');

// middlewares
const { checkAuth } = require('../middlewares/checkAuth');
const { checkDoctor } = require('../middlewares/checkDoctor');
const { checkAdmin } = require('../middlewares/checkAdmin');

const router = express.Router();

router.get('/', checkAuth, doctorController.getAllDoctors);
router.get('/:id', checkAuth, doctorController.getDoctor);
router.post('/signup', doctorController.signup);
router.post('/login', doctorController.login);
router.get('/verify/:token', doctorController.verifyEmail);
router.post('/forgot-password', doctorController.forgotPassword);
router.post('/reset-password', doctorController.resetPassword);
router.post('/status/:id', checkAuth, checkAdmin, doctorController.changeStatus);
router.delete('/:id', checkAuth, checkAdmin, doctorController.deleteDoctor);

module.exports = router;
