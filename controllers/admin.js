const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Admin = require('../models/admin');

const key = process.env.JWT_SECRET;

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ status: 'fail', message: 'You must fill all fields' });
        }
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ status: 'fail', message: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ status: 'fail', message: 'Invalid email or password' });
        }
        const token = jwt.sign({ _id: admin._id }, key);
        res.status(200).json({
            status: 'success',
            data: { token },
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 'fail', error: err, message: 'Error in admin login' });
    }
};

exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ status: 'fail', message: 'You must fill all fields' });
        }
        const founded = await Admin.findOne({ email });
        if (founded) {
            return res.status(400).json({ status: 'fail', message: 'Admin already exists' });
        }
        if (password.length < 8) {
            return res.status(400).json({ status: 'fail', message: 'password must be more than 8 characters' });
        }
        req.body.password = await bcrypt.hash(req.body.password, 10);
        const admin = await Admin(req.body).save();
        res.status(201).json({
            status: 'success',
            data: { admin },
        });
    } catch (err) {
        res.status(500).json({ status: 'fail', error: err, message: 'Error in admin signup' });
    }
};
