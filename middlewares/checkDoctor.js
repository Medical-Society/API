const Doctor = require('../models/doctor');

exports.checkDoctor = async (req, res, next) => {
    try {
        const doctor = await Doctor.findById(req.user._id);
        if (!doctor) {
            return res.status(404).json({ status: 'fail', message: 'Please login as a doctor first' });
        }
        if (doctor.status !== 'accepted') {
            return res.status(403).json({ status: 'fail', message: 'You are not authorized' });
        }
        next();
    } catch (err) {
        res.status(500).json({ status: 'fail', error: err, message: 'Error in checking doctor' });
    }
};
