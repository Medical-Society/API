const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patient');
const multer = require('multer');
// middlewares
const { checkAuth } = require('../middlewares/checkAuth');
const { checkPatient } = require('../middlewares/checkPatient');
const {checkAdmin } = require('../middlewares/checkAdmin');

const upload = multer({ dest: 'imgs' }); // Destination folder for uploaded files

//route for Admin 
router.get('/', checkAuth,checkAdmin, patientController.getAllPatient); 
router.get('/:id', checkAuth,checkAdmin, patientController.getPatient); 
router.delete('/delete/:id',checkAuth,checkAdmin, patientController.deletePatient);

router.post('/signup', patientController.patientSignUp);  //test done
router.get('/verify/:token', patientController.verifyEmail); //test done 
router.post('/login', patientController.patientLogin);  //test done 
router.patch('/updateMe',checkAuth,checkPatient,patientController.updateMe); 
router.post('/reset-password', patientController.resetPassword); 
router.post('/forgot-password', patientController.forgotPassword);


module.exports = router;

// documentation
//imgae

// status
