const jwt = require('jsonwebtoken');
require('dotenv').config();

const key = process.env.JWT_SECRET || 'mina magdy';

exports.checkAuth = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ status: 'fail', message: 'Please login first' });
    }
    jwt.verify(token, key, (err, decoded) => {
        if (err) {
            return res.status(401).json({ status: 'fail', message: 'Invalid token' });
        }
        req.user = decoded;
        next();
    });
};
