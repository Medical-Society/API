const Patient = require('../models/patient');

exports.checkPatient = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.body.user._id);
    //     console.log(patient);
    if (!patient) {
      return res
        .status(404)
        .json({ status: 'fail', message: 'Patient not found' });
    }
    next();
  } catch (err) {
    console.log(err.message);
    res
      .status(500)
      .json({
        status: 'fail',
        error: err,
        message: 'Error in checking Patient',
      });
  }
};
