const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patient');
const multer = require('multer');
// middlewares
const { checkAuth } = require('../middlewares/checkAuth');
const { checkPatient } = require('../middlewares/checkPatient');

// const upload = multer({ dest: '/uploads' }); // Destination folder for uploaded files

// router.post('/upload',upload.single('image'),patientController.uploadImgae);

router.get('/', checkAuth, patientController.getAllPatient);
router.get('/:id', checkAuth, patientController.getPatient);
router.post('/signup', patientController.patientSignUp);
router.get('/verify/:token', patientController.verifyEmail);
router.post('/login', patientController.patientLogin);
router.post('/reset-password/:token', patientController.resetPassword);
router.post('/forgot-password', patientController.forgotPassword);
module.exports = router;

// documentation
//imgae

// status
