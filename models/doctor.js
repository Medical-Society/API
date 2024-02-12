const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
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
            unique: true,
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
            default: 'Not provided',
        },
        nationalID: {
            type: String,
            required: [true, 'National ID is mandatory'],
            minlength: 14,
            maxlength: 14,
        },
        phoneNumber: {
            type: String,
            required: [true, 'Phone number is mandatory'],
            match: /^01(0|1|2|5)[0-9]{8}$/,
            minlength: 11,
        },
        age: {
            type: Number,
            required: [true, 'Age is mandatory'],
            validate: {
                validator: function (v) {
                    return v >= 18;
                },
                message: 'Age must be +18',
            },
        },
        gender: {
            type: String,
            enum: ['male', 'female'],
            required: [true, 'Gender is mandatory'],
        },
        status: {
            type: String,
            enum: ['pending', 'in progress', 'accepted', 'rejected'],
            default: 'pending',
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Doctor', doctorSchema);
