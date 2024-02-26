import nodemailer, { SendMailOptions } from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.PASSWORD,
  },
});

export const sendEmail = async ({ to, subject, text }: SendMailOptions) => {
  let mailOptions: SendMailOptions = {
    from: process.env.EMAIL_USERNAME,
    to,
    subject,
    text,
  };
  return await transporter.sendMail(mailOptions);
};
