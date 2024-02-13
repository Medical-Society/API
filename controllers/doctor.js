// Third party modules
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
        req.body.isVerified = false;
        req.body.status = 'pending';
        req.body.password = await bcrypt.hash(req.body.password, 10);
        const doctor = await new Doctor(req.body).save();
        const token = jwt.sign({ _id: doctor._id }, key, { expiresIn: '1d' });
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
            Thanks, if you didn't request this, please ignore this email.`,
        });
        doctor.password = undefined;
        res.status(201).json({
            status: 'success',
            message: `Dr. ${doctor.englishFullName} signed up successfully, Please verify your email`,
        });
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ status: 'fail', message: err.message });
        }
        res.status(500).json({ status: 'fail', error: err, message: 'Error in doctor signup' });
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
        if (doctor.status !== 'accepted') {
            return res.status(400).json({ status: 'fail', message: 'Your account is still pending' });
        }
        const token = jwt.sign({ _id: doctor._id }, key);
        if (!token) {
            return res.status(500).json({ status: 'fail', message: 'Error in token generation' });
        }
        doctor.password = undefined;
        res.status(200).json({
            status: 'success',
            data: { token, doctor },
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 'fail', error: err, message: 'Error in doctor login' });
    }
};

exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        jwt.verify(token, key, async (err, decoded) => {
            if (err) {
                return res.status(404).send('Invalid token');
            }
            const doctor = await Doctor.findById(decoded._id);
            if (!doctor) {
                return res.status(404).send('Doctor not found');
            }
            if (doctor.isVerified) {
                return res.status(400).send('Email already verified');
            }
            doctor.isVerified = true;
            await doctor.save();
            res.status(200).send('Email verified successfully');
        });
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(404).send('Doctor not found');
        }
        res.status(500).json({ status: 'fail', error: err, message: 'Error in verifying email' });
    }
};

exports.getAllDoctors = async (req, res) => {
    try {
        const count = await Doctor.countDocuments();
        const limit = 20;
        const page = Math.min(Math.ceil(count / limit), req.query.page * 1 || 1);
        const doctors = await Doctor.find()
            .select('-password')
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
        doctor.password = undefined;
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
            // send 200 for not exist email to prevent email enumeration
            return res.status(200).json({
                status: 'success',
                message: `Reset password link sent to ${email}`,
            });
        }
        const secret = doctor.password + '-' + key;
        const token = jwt.sign({ _id: doctor._id }, secret, { expiresIn: '15m' });
        if (!token) {
            return res.status(500).json({ status: 'fail', message: 'Error in token generation' });
        }
        const link = `${process.env.FRONT_URL}/reset-password/${doctor._id}/${token}`;
        await sendingMail({
            to: doctor.email,
            subject: 'Reset Password',
            text: `Hi! There, You have recently visited
            our website and entered your email.
            Please follow the given link to reset your password ${link}
            Thanks, if you didn't request this, please ignore this email.`,
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
    const { id, token, password, confirmPassword } = req.body;
    if (!id || !token || !password || !confirmPassword) {
        return res.status(400).json({ status: 'fail', message: 'You must fill all fields' });
    }
    if (password != confirmPassword) {
        return res.status(400).json({ status: 'fail', message: 'confirm password not the same as password' });
    }
    if (password.length < 6) {
        return res.status(400).json({ status: 'fail', message: 'password must be more than 6 characters' });
    }
    const doctor = await Doctor.findById(id);
    if (!doctor) {
        return res.status(404).json({ status: 'fail', message: 'Doctor not found' });
    }
    if (!doctor.isVerified) {
        return res.status(400).json({ status: 'fail', message: 'Please verify your email' });
    }
    const secret = doctor.password + '-' + key;
    jwt.verify(token, secret, async (err, payload) => {
        if (err) {
            return res.status(404).json({ status: 'fail', message: 'Invalid token' });
        }
        if (payload._id != id) {
            return res.status(404).json({ status: 'fail', message: 'Invalid token' });
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

exports.update = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.user._id);
        const updates = Object.keys(req.body);
        const allowedUpdates = ['specialization', 'clinicAddress', 'phoneNumber'];
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
        if (!isValidOperation) {
            return res.status(400).json({ status: 'fail', message: 'Invalid updates' });
        }
        updates.forEach((update) => (doctor[update] = req.body[update]));
        await doctor.save();
        doctor.password = undefined;
        res.status(200).json({ status: 'success', data: { doctor } });
    } catch (err) {
        res.status(500).json({ status: 'fail', error: err, message: 'Error in updating doctor' });
    }
};

exports.deleteMyAccount = async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndDelete(req.user._id);
        if (!doctor) {
            return res.status(404).json({ status: 'fail', message: 'Doctor not found' });
        }
        res.status(204).json({ status: 'success', message: 'Doctor deleted successfully' });
    } catch (err) {
        res.status(500).json({ status: 'fail', error: err, message: 'Error in deleting doctor my account' });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body;
        if (!oldPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ status: 'fail', message: 'You must fill all fields' });
        }
        const doctor = await Doctor.findById(req.user._id);
        if (!doctor) {
            return res.status(404).json({ status: 'fail', message: 'Doctor not found' });
        }
        const isMatch = await bcrypt.compare(oldPassword, doctor.password);
        if (!isMatch) {
            return res.status(400).json({ status: 'fail', message: 'Invalid old password' });
        }
        if (newPassword != confirmPassword) {
            return res.status(400).json({ status: 'fail', message: 'confirm password not the same as password' });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ status: 'fail', message: 'password must be more than 6 characters' });
        }
        doctor.password = await bcrypt.hash(newPassword, 10);
        await doctor.save();
        res.status(200).json({ status: 'success', message: 'Password changed successfully' });
    } catch (err) {
        res.status(500).json({ status: 'fail', error: err, message: 'Error in changing password' });
    }
};
