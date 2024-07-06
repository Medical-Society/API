import { sendEmail } from '../utils/mail';

function generateHTML(goal: string, link: string) {
  return `<h1>Hi! There,</h1>
    <p>You have recently visited our website and entered your email.<br>
    Please follow the given link to ${goal} <a href="${link}" target="_blank">${goal}</a><br>
    Thanks, if you didn't request this, please ignore this email.</p>
    <img src="https://i.gifer.com/origin/9f/9f0945ca9d3aa50c195c657f0a2a117c_w200.gif" style="width:150px">`;
}

export const sendVerificationEmail = async (
  to: string,
  token: string,
  resources: 'doctors' | 'patients',
) => {
  const subject = 'Account Verification';
  let link = `${process.env.ADMIN_URL}/verify-email/${resources}?token=${token}`;
  let html = '';
  if (resources === 'doctors') {
    link = link.replace(
      `${process.env.ADMIN_URL}`,
      `${process.env.DOCTOR_URL}`,
    );
    html = generateHTML(
      'complete your information and verifiy your email',
      link,
    );
  } else {
    html = generateHTML('verify your email', link);
  }
  console.log(html);
  await sendEmail({ to, subject, html });
};

export const sendResetPasswordEmail = async (
  to: string,
  token: string,
  resources: 'doctors' | 'patients',
) => {
  const subject = 'Reset Password';
  const link = `${process.env.FRONT_URL}/reset-password/${resources}?token=${token}`;
  const html = generateHTML('reset your password', link);
  await sendEmail({ to, subject, html });
};
