const mongoose = require('mongoose');

const doctorScheme = new mongoose.Schema(
    {
        englishFullName: {
            type: String,
            required: [true, 'English fullname is mandatory'],
        },
        arabicFullName: {
            type: String,
            required: [true, 'Arabic fullname as National id card is mandatory'],
        },
        email: {
            type: String,
            required: [true, 'Email is mandatory'],
            match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'Password is mandatory'],
            minlength: 6,
            trim: true,
        },
        specialization: {
            type: String,
            required: [true, 'specialization is mandatory'],
            minlength: 3,
        },
        clinicAddress: {
            type: String,
        },
        nationalID: {
            type: String,
            required: [true, 'National ID is mandatory'],
        },
        phoneNumber: {
            type: String,
            required: [true, 'Phone number is mandatory'],
        },
        Age: {
            type: Number,
            required: [true, 'Age is mandatory'],
        },
        Gender: {
            type: String,
            enum: ['male', 'female'],
            required: [true, 'Gender is mandatory'],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Doctor', doctorScheme);
