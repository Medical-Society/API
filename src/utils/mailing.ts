import nodemailer, { SendMailOptions } from 'nodemailer';

export const sendingMail = async ({ to, subject, text }: SendMailOptions) => {
  let mailOptions: SendMailOptions = {
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
};
