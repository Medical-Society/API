import { createTransport, SendMailOptions } from 'nodemailer';

const transporter = createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.PASSWORD,
  },
});

export const sendEmail = async (payload: SendMailOptions) => {
  let mailOptions: SendMailOptions = {
    from: process.env.EMAIL_USERNAME,
    ...payload,
  };
  return await transporter.sendMail(mailOptions);
};
