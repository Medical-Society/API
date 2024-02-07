// Third party modules

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// local modules

const Patient = require('../models/patient');
const validation = require('../validation/valid');
const { sendingMail } = require('../utils/mailing');

// Varaibles

const key = process.env.JWT_SECRET;

// decryptPassword

function decryptPassword(encryptedPassword, key) {
    const decipher = crypto.createDecipher('aes-256-cbc', key);
    let decryptedPassword = decipher.update(encryptedPassword, 'hex', 'utf8');
    decryptedPassword += decipher.final('utf8');
    return decryptedPassword;
}

// signup

const patientSignUp = async (req, res) => {
    try {
        const { email, password, confirmPassword } = req.body;
        console.log(email, password);
        //check if all fields are filled

        if (!password || !confirmPassword || !email) {
            return res.status(400).json({ status: 'fail', message: 'You must fill all fields' });
        }

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

        // sending email

        if (token) {
            sendingMail({
                to: newPatient.email,
                // Subject of Email
                subject: 'Email Verification',

                // This would be the text of email body
                text: `Hi ${newPatient.patientName}! There, You have recently visited 
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

        return res.status(201).json({
            status: 'success',
            data: { token, newPatient },
        });
    } catch (err) {
        return res.status(404).json({
            status: 'failed',
            message: err.message,
        });
    }
};

// log in

const patientLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json(400).json({
                status: 'fail',
                message: 'All the fields are mandatory',
            });
        }
        const patient = await Patient.findOne({ email: email });
        if (!patient) {
            return res.json(401).json({
                status: 'fail',
                message: 'The Email is not exist',
            });
        }
        const passwordMatch = await bcrypt.compare(password, patient.password);
        if (!passwordMatch) {
            return res.status(401).json({
                status: 'fail',
                message: 'Password is wrong',
            });
        }
        if (!patient.isVerified) {
            return res.status(400).json({ status: 'fail', message: 'Please verify your email' });
        }
        const token = jwt.sign({ _id: patient._id }, key);
        if (!token) {
            return res.status(500).json({ status: 'fail', message: 'Error in token generation' });
        }

        res.status(200).json({
            status: 'success',
            data: { token, patient },
        });
    } catch (err) {
        return res.status(500).json({
            status: 'error',
            error: err.message,
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

// forgor password

// For Admin

const getAllPatient = async (req, res) => {
    try {
        const patient = await Patient.find();
        return res.status(200).json({
            status: 'success',
            results: patient.length,
            data: {
                patient,
            },
        });
    } catch (err) {
        return res.status(500).json({
            status: 'fail',
            message: err.message,
        });
    }
};
const getPatient = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).json({
                status: 'fail',
                message: 'not found!!',
            });
        }
        return res.status(200).json({
            status: 'success',
            data: {
                patient,
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
    getAllPatient,
    verifyEmail,
    getPatient,
    patientLogin,
};
