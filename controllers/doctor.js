// Third party modules
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// local modules
const Doctor = require('../models/doctor');
const { sendingMail } = require('../utils/mailing');

const key = process.env.JWT_SECRET;

exports.signup = async (req, res) => {
    try {
        const { email, password, confirmPassword } = req.body;
        if (!password || !confirmPassword || !email) {
            return res.status(400).json({ status: 'fail', message: 'You must fill all fields' });
        }
        const founded = await Doctor.findOne({ email });
        if (founded) {
            return res.status(400).json({ status: 'fail', message: 'This email already exist' });
        }
        if (password != confirmPassword) {
            return res.status(400).json({ status: 'fail', message: 'confirm password not the same as password' });
        }
        if (password.length < 6) {
            return res.status(400).json({ status: 'fail', message: 'password must be more than 6 characters' });
        }
        req.body.password = await bcrypt.hash(req.body.password, 10);
        const doctor = await new Doctor(req.body).save();
        const token = jwt.sign({ _id: doctor._id }, key);
        if (!token) {
            return res.status(500).json({ status: 'fail', message: 'Error in token generation' });
        }
        const link = `${process.env.BASE_URL}/api/v1/doctors/verify/${token}`;
        await sendingMail({
            to: doctor.email,
            subject: 'Email Verification',
            text: `Hi! There, You have recently visited
            our website and entered your email.
            Please follow the given link to verify your email ${link}
            Thanks`,
        });
        res.status(201).json({
            status: 'success',
            data: { doctor },
        });
    } catch (err) {
        let statusCode = 500;
        if (err.name === 'ValidationError') {
            statusCode = 400;
        }
        res.status(statusCode).json({ status: 'fail', error: err, message: 'Error in doctor signup' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ status: 'fail', message: 'You must fill all fields' });
        }
        const doctor = await Doctor.findOne({ email });
        if (!doctor) {
            return res.status(400).json({ status: 'fail', message: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.compare(password, doctor.password);
        if (!isMatch) {
            return res.status(400).json({ status: 'fail', message: 'Invalid email or password' });
        }
        if (!doctor.isVerified) {
            return res.status(400).json({ status: 'fail', message: 'Please verify your email' });
        }
        const token = jwt.sign({ _id: doctor._id }, key);
        if (!token) {
            return res.status(500).json({ status: 'fail', message: 'Error in token generation' });
        }
        res.status(200).json({
            status: 'success',
            data: { token, doctor },
        });
    } catch (err) {
        res.status(500).json({ status: 'fail', error: err, message: 'Error in doctor login' });
    }
};

exports.verifyEmail = async (req, res) => {
    const { token } = req.params;
    jwt.verify(token, key, async (err, decoded) => {
        if (err) {
            return res.status(404).json({ status: 'fail', message: 'Invalid token' });
        }
        const doctor = await Doctor.findById(decoded._id);
        if (!doctor) {
            return res.status(404).json({ status: 'fail', message: 'Doctor not found' });
        }
        doctor.isVerified = true;
        await doctor.save();
        res.status(200).json({ status: 'success', message: `Dr. ${doctor.englishFullName} verified successfully` });
    });
};

exports.getAllDoctors = async (req, res) => {
    try {
        const count = await Doctor.countDocuments();
        const limit = 20;
        const page = Math.min(Math.ceil(count / limit), req.query.page * 1 || 1);
        const doctors = await Doctor.find()
            .limit(limit)
            .skip((page - 1) * limit)
            .sort({ createdAt: 1 });
        if (doctors.length === 0) {
            return res.status(404).json({ status: 'fail', message: 'No doctors found' });
        }
        res.status(200).json({
            status: 'success',
            data: { doctors, totalPages: Math.ceil(count / limit), currentPage: page },
        });
    } catch (err) {
        res.status(500).json({ status: 'fail', error: err, message: 'Error in getting all doctors' });
    }
};

exports.getDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            return res.status(404).json({ status: 'fail', message: 'Doctor not found' });
        }
        res.status(200).json({ status: 'success', data: { doctor } });
    } catch (err) {
        res.status(500).json({ status: 'fail', error: err, message: 'Error in getting doctor' });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ status: 'fail', message: 'You must fill all fields' });
        }
        const doctor = await Doctor.findOne({ email });
        if (!doctor) {
            return res.status(404).json({ status: 'fail', message: 'Doctor not found' });
        }
        const token = jwt.sign({ _id: doctor._id }, key);
        if (!token) {
            return res.status(500).json({ status: 'fail', message: 'Error in token generation' });
        }
        const link = `${process.env.BASE_URL}/api/v1/doctors/reset-password/${token}`;
        await sendingMail({
            to: doctor.email,
            subject: 'Reset Password',
            text: `Hi! There, You have recently visited
            our website and entered your email.
            Please follow the given link to reset your password ${link}
            Thanks`,
        });
        res.status(200).json({
            status: 'success',
            message: `Reset password link sent to ${doctor.email}`,
        });
    } catch (err) {
        res.status(500).json({ status: 'fail', error: err, message: 'Error in forgot password' });
    }
};

exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    jwt.verify(token, key, async (err, decoded) => {
        if (err) {
            return res.status(404).json({ status: 'fail', message: 'Invalid token' });
        }
        const { password, confirmPassword } = req.body;
        if (!password || !confirmPassword) {
            return res.status(400).json({ status: 'fail', message: 'You must fill all fields' });
        }
        if (password != confirmPassword) {
            return res.status(400).json({ status: 'fail', message: 'confirm password not the same as password' });
        }
        if (password.length < 6) {
            return res.status(400).json({ status: 'fail', message: 'password must be more than 6 characters' });
        }
        const doctor = await Doctor.findById(decoded._id);
        if (!doctor) {
            return res.status(404).json({ status: 'fail', message: 'Doctor not found' });
        }
        doctor.password = await bcrypt.hash(password, 10);
        await doctor.save();
        res.status(200).json({
            status: 'success',
            message: `Dr. ${doctor.englishFullName} password reset successfully`,
        });
    });
};

exports.changeStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ status: 'fail', message: 'You must fill all fields' });
        }
        const doctor = await Doctor.findById(id);
        if (!doctor) {
            return res.status(404).json({ status: 'fail', message: 'Doctor not found' });
        }
        doctor.status = status;
        await doctor.save();
        res.status(200).json({
            status: 'success',
            message: `Dr. ${doctor.englishFullName} status changed to ${status}`,
        });
    } catch (err) {
        res.status(500).json({ status: 'fail', error: err, message: 'Error in changing status' });
    }
};

exports.deleteDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const doctor = await Doctor.findByIdAndDelete(id);
        if (!doctor) {
            return res.status(404).json({ status: 'fail', message: 'Doctor not found' });
        }
        res.status(204).json({ status: 'success', message: 'Doctor deleted successfully' });
    } catch (err) {
        res.status(500).json({ status: 'fail', error: err, message: 'Error in deleting doctor' });
    }
};
