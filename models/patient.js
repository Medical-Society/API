const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const patientSchema = new Schema(
    {
        patientName: {
            type: String,
            required: [true, 'Name is Mandatory'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is Mandatory'],
            unique: true,
            trim: true,
            match: /^\w+([-+.]\w+)*@((yahoo|gmail)\.com)$/,
        },
        password: {
            type: String,
            required: [true, 'Password is Mandatory'],
            minlength: 6,
            trim: true,
        },
        age: {
            type: Number,
            required: [true, 'Age is Mandatory'],

            validate: {
                validator: function (value) {
                    return value > 0;
                },
                message: 'Age must be greater than zero',
            },
        },
        gender: {
            type: String,
            enum: ['male', 'female'],
            required: [true, 'Gender is Mandatory'],
        },
        address: {
            type: String,
            required: [true, 'Address is Mandatory'],
        },
        mobile: {
            type: String,
            required: [true, 'Mobile is Mandatory'],
            match: /^(010|011|012|015)[0-9]{8}$/,
            minlength: 11,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        photo: {
            type: String,
            default: 'default.jpg',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Patient', patientSchema);
