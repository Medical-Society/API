const Patient = require('../models/patient');

exports.checkPatient = async (req, res, next) => {
    try {
        const patient = await Patient.findById(req.user._id);
        if (!patient) {
            return res.status(404).json({ status: 'fail', message: 'Patient not found' });
        }
        next();
    } catch (err) {
        res.status(500).json({ status: 'fail', error: err, message: 'Error in checking Patient' });
    }
};
