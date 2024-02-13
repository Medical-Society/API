// Third party modules

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// local modules

const Patient = require('../models/patient');
const { sendingMail } = require('../utils/mailing');
const doctor = require('../models/doctor');

// Varaibles

const key = process.env.JWT_SECRET;

// signup

const patientSignUp = async (req, res) => {
    try {
        // console.log(req.file);
        // console.log(req.body);

        const { email, password, confirmPassword } = req.body;
        console.log(email, password);
        //check if all fields are filled

        if (!password || !confirmPassword || !email) {
            return res.status(400).json({ status: 'fail', message: 'You must fill all fields' });
        }

        // Check if the user already exists

        let foundPatient = await Patient.findOne({ email: email });
        if (foundPatient) {
            return res.status(400).json({
                status: 'fail',
                message: 'Email is already signed up,try login ',
            });
        }
        if (password.length < 6) {
            return res.status(400).json({
                status: 'fail',
                message: 'password must be at least 6 characters',
            });
        }
        if (password != confirmPassword) {
            return res.status(400).json({
                status: 'fail',
                message: 'Password is not equal to the confirm password try again please',
            });
        }

        // Hash the password
        req.body.password = await bcrypt.hash(req.body.password, 10);

        // Create a new Patient
        req.body.isVerified = false;
        const patient = new Patient(req.body);

        // Save the Patient to the database

        await patient.save();

        // Generate a token
        const token = jwt.sign({ _id: patient._id }, key);
        if (!token) {
            return res.status(500).json({ status: 'fail', message: 'Error in token generation' });
        }
        // sending email

        sendingMail({
            to: patient.email,
            // Subject of Email
            subject: 'Email Verification',

            // This would be the text of email body
            text: `Hi ${patient.patientName}! There, You have recently visited 
		our website and entered your email. 
		Please follow the given link to verify your email 
		${process.env.BASE_URL}/api/v1/patients/verify/${token} 
		Thanks`,
        });

        // Return the response with token and user data

        return res.status(201).json({
            status: 'success',
            data: { patient },
        });
    } catch (err) {
        res.status(500).json({ status: 'fail', error: err, message: 'Error in patient signup' });
    }
};

// log in

const patientLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: 'fail',
                message: 'All the fields are mandatory',
            });
        }
        const patient = await Patient.findOne({ email: email });
        if (!patient) {
            return res.status(400).json({
                status: 'fail',
                message: 'The Email is not exist',
            });
        }
        const passwordMatch = await bcrypt.compare(password, patient.password);
        if (!passwordMatch) {
            return res.status(400).json({
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
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ status: 'fail', message: 'You must fill all fields' });
        }
        const patient = await Patient.findOne({ email });
        if (!patient) {
            res.status(200).json({
                status: 'success',
                message: `Reset password link sent to ${patient.email}`,
            });
        }
        const secret = patient.password + '-' + patient.createdAt;

        console.log(patient.createdAt);

        const token = jwt.sign({ _id: patient._id }, secret, { expiresIn: '15m' });

        if (!token) {
            return res.status(500).json({ status: 'fail', message: 'Error in token generation' });
        }

        const link = `${process.env.BASE_URL}/api/v1/patients/reset-password/${token}`;
        await sendingMail({
            to: patient.email,
            subject: 'Reset Password',
            text: `Hi! There, You have recently visited
            our website and entered your email.
            Please follow the given link to reset your password ${link}
            Thanks`,
        });
        res.status(200).json({
            status: 'success',
            message: `Reset password link sent to ${patient.email}`,
        });
    } catch (err) {
        res.status(500).json({ status: 'fail', error: err, message: 'Error in forgot password' });
    }
};
const resetPassword = async (req, res) => {
    // console.log(token);
    const { id, token, password, confirmPassword } = req.body;

    if (!id || !token || !password || !confirmPassword) {
        return res.status(400).json({ status: 'fail', message: 'You must fill all fields' });
    }
    if (password.length < 6) {
        return res.status(400).json({ status: 'fail', message: 'password must be more than 6 characters' });
    }
    if (password != confirmPassword) {
        return res.status(400).json({ status: 'fail', message: 'confirm password not the same as password' });
    }
    const patient = await Patient.findById(id);
    if (!patient) {
        return res.status(404).json({ status: 'fail', message: 'Patient not found reset' });
    }
    if (!patient.isVerified) {
        return res.status(400).json({
            status: 'fail',
            message: 'Please verify your Email ',
        });
    }
    // console.log(decoded._id);
    const secret = patient.password + '-' + patient.createdAt;

    jwt.verify(token, secret, async (err, decoded) => {
        if (err) {
            return res.status(404).json({ status: 'fail', message: 'Invalid token' });
        }
        patient.password = await bcrypt.hash(password, 10);
        await patient.save();
        res.status(200).json({
            status: 'success',
            message: `${patient.patientName} password reset successfully`,
        });
    });
};

//upload image

const uploadImage = async (req, res) => {
    try {
        const { originalName, buffer, mimeType } = req.file;
        const image = new Patient({
            data: buffer,
            contentType: mimeType,
        });

        await image.save();

        res.status(201).send('Image uploaded successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

const updateMe = async (req, res) => {
    try {
        // Filtered out unwanted fields names that are not allowed to be updated

        //put fields that you want to update in filterObj function below

        if (req.body.email || req.body.password || req.body.confirmPassword || req.body.gender) {
            return res.status(404).json({
                status: 'fail',
                message:
                    'you are not allowed to update Email or Gender or password,if you want to change password go to change password please!!,',
            });
        }
        const filteredBody = filterObj(req.body, 'patientName', 'age', 'address', 'mobile');

        const patient = await Patient.findByIdAndUpdate(req.user._id, filteredBody, { new: true });
        return res.status(200).json({
            status: 'success',
            data: {
                patient,
            },
        });
    } catch (err) {
        return res.status(500).json({
            status: 'fail',
            message: 'Error in updating patient',
        });
    }
};

// For Admin

const getAllPatient = async (req, res) => {
    try {
        const count = await Patient.countDocuments();
        const limit = 20;
        const page = Math.min(Math.ceil(count / limit), req.query.page * 1 || 1);

        const patient = await Patient.find()
            .limit(limit)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });
        return res.status(200).json({
            status: 'success',
            results: patient.length,
            data: {
                patient,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
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
                message: 'Patient not found!!',
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
            message: 'error in getting patient',
        });
    }
};
const deletePatient = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndDelete(req.params.id);
        if (!patient) {
            return res.status(404).json({
                status: 'fail',
                message: 'Patient not found!!',
            });
        }
        return res.status(204).json({});
    } catch (err) {
        return res.status(500).json({
            status: 'fail',
            message: 'error in deleting patient',
        });
    }
};

module.exports = {
    patientSignUp,
    getAllPatient,
    getPatient,
    verifyEmail,
    patientLogin,
    forgotPassword,
    resetPassword,
    updateMe,
    deletePatient,
};

// delete patient
// fix reset password
