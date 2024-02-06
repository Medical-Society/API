const Patient = require('../models/patient');

const validation = require('../validation/valid');

const bcrypt = require('bcryptjs');
const { sendingMail } = require('../utils/mailing');

const jwt = require('jsonwebtoken');
// Varaibles
const key = process.env.JWT_SECRET || 'H+MbQeThWmZq3t6w9z$C&F';

const patientSignUp = async (req, res) => {
    try {
        const { patientName, email, password, confirmPassword, age, gender, address, mobile } = req.body;

        // Check if the user already exists

        let foundPatient = await Patient.findOne({ email: email });
        if (foundPatient) {
            return res.status(409).json({
                message: 'Email is already signed up,try login ',
            });
        }
        if (password.length < 6) {
            return res.status(403).json({
                message: 'password must be at least 6 characters',
            });
        }
        if (password != confirmPassword) {
            return res.status(403).json({
                message: 'Password is not equal to the confirm password try again please',
            });
        }

        // Hash the password
        req.body.password = await bcrypt.hash(req.body.password, 10);

        // Create a new Patient

        const newPatient = new Patient(req.body);

        // Save the Patient to the database

        await newPatient.save();

        // Generate a token
        const token = jwt.sign({ _id: newPatient._id }, key);
        if (token) {
            sendingMail({
                to: email,
                // Subject of Email
                subject: 'Email Verification',

                // This would be the text of email body
                text: `Hi ${patientName}! There, You have recently visited 
		our website and entered your email. 
		Please follow the given link to verify your email 
		${process.env.BASE_URL}/api/v1/patients/verify/${token} 
		Thanks`,
            });
        } else {
            //if token is not created, send a status of 400

            return res.status(400).send('token not created');
        }
        // Return the response with token and user data

        const result = { token: token, user: newPatient };
        return res.status(201).json({
            status: 'success',
            data: result,
        });
    } catch (err) {
        return res.status(404).json({
            status: 'failed',
            message: err.message,
        });
    }
};
// verify Email

const verifyEmail = async (req, res) => {
    const { token } = req.params;
    jwt.verify(token, key, async (err, decoded) => {
        if (err) {
            return res.status(400).json({ status: 'fail', message: 'Invalid token' });
        }
        const patient = await Patient.findById(decoded._id);
        if (!patient) {
            return res.status(400).json({ status: 'fail', message: 'Patient not found' });
        }
        patient.isVerified = true;
        await patient.save();
        res.status(200).json({ status: 'success', message: 'Patient verified successfully' });
    });
};

// For Admin

const getAllUsers = async (req, res) => {
    try {
        const user = await Patient.find();
        return res.status(200).json({
            status: 'success',
            results: user.length,
            data: {
                user,
            },
        });
    } catch (err) {
        return res.status(500).json({
            status: 'fail',
            message: err.message,
        });
    }
};
const getUser = async (req, res) => {
    try {
        const user = await Patient.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'not found!!',
            });
        }
        return res.status(200).json({
            status: 'success',
            data: {
                user,
            },
        });
    } catch (err) {
        return res.status(500).json({
            status: 'fail',
            message: err.message,
        });
    }
};

module.exports = {
    patientSignUp,
    getAllUsers,
    verifyEmail
};
