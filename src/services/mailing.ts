import { sendEmail } from '../utils/mailing';

function messageText(goal: string, link: string) {
  return `<h1>Hi! There,</h1>
    <p>You have recently visited our website and entered your email.<br>
    Please follow the given link to ${goal} <a href="${link}" target="_blank">${goal}</a><br>
    Thanks, if you didn't request this, please ignore this email.</p>`;
}

export const sendVerificationEmail = async (
  to: string,
  token: string,
  resources: 'doctors' | 'patients'
) => {
  const subject = 'Account Verification';
  const link = `${process.env.FRONT_URL}/verify-email/${resources}?token=${token}`;
  const text = messageText('verify your email', link);
  await sendEmail({ to, subject, text });
};

export const sendResetPasswordEmail = async (
  to: string,
  token: string,
  resources: 'doctors' | 'patients'
) => {
  const subject = 'Reset Password';
  const link = `${process.env.FRONT_URL}/reset-password/${resources}?token=${token}`;
  const text = messageText('reset your password', link);
  await sendEmail({ to, subject, text });
};
