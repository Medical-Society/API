const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patient');
const multer = require('multer');
// middlewares
const { checkAuth } = require('../middlewares/checkAuth');
const { checkPatient } = require('../middlewares/checkPatient');

const upload = multer({ dest: 'imgs' }); // Destination folder for uploaded files

router.get('/', checkAuth, patientController.getAllPatient); //test done
router.get('/:id', checkAuth, patientController.getPatient);
router.post('/signup', patientController.patientSignUp); // test done
router.get('/verify/:token', patientController.verifyEmail); //test done
router.post('/login', patientController.patientLogin);  //test done
router.patch('/updateMe',checkAuth,checkPatient,patientController.update); // test done
router.post('/reset-password/:token', patientController.resetPassword); //test done
router.post('/forgot-password', patientController.forgotPassword); // test done

module.exports = router;

// documentation
//imgae

// status
