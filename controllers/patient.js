const Patient = require('../models/patient');

const validation = require('../validation/valid');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
// Varaibles
const key = process.env.JWT_SECRET || 'eman mohamed';

const patientSignUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        validation.validFunction(name, email, password);

        // Check if the user already exists
        let foundUser = await User.findOne({ email: email });
        if (foundUser) {
            return res.status(409).json({
                message: 'Email is already in use',
            });
        }

        // Hash the password
        req.body.password = await bcrypt.hash(req.body.password, 10);

        // Create a new user
        const newUser = new User(req.body);

        // Save the user to the database
        await newUser.save();

        // Generate a token
        const token = jwt.sign({ _id: newUser._id }, key);

        // Store the token in the user document
        newUser.token = token;
        // console.log(newUser.token);
        await newUser.save();

        // Return the response with token and user data
        const result = { token: token, user: newUser };
        return res.status(201).json({
            status: 'success',
            data: result,
        });
    } catch (err) {
        return res.status(404).json({
            status: 'failed',
            message: err.message,
        });
    }
};

module.exports = {
    patientSignUp,
};
