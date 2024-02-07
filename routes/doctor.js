const express = require('express');

// controllers
const doctorController = require('../controllers/doctor');

// middlewares
const { checkAuth } = require('../middlewares/checkAuth');
const { checkDoctor } = require('../middlewares/checkDoctor');

const router = express.Router();

router.get('/', checkAuth);
router.get('/:id', checkAuth);
router.post('/signup', doctorController.signup);
router.post('/login', doctorController.login);
router.get('/verify/:token', doctorController.verifyEmail);

module.exports = router;
