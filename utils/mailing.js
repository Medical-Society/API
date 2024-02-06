const nodemailer = require('nodemailer');
require('dotenv').config();

module.exports.sendingMail = async ({ to, subject, text }) => {
    try {
        let mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to,
            subject,
            text,
        };
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.PASSWORD,
            },
        });

        return await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log(error);
    }
};
