const Admin = require('../models/admin');

exports.checkAdmin = async (req, res, next) => {
    try {
        const admin = await Admin.findById(req.user._id);
        if (!admin) {
            return res.status(401).json({ status: 'fail', message: 'Unauthorized user. Admin access required.' });
        }
        next();
    } catch (err) {
        res.status(500).json({ status: 'fail', error: err, message: 'Error in checking admin' });
    }
};
