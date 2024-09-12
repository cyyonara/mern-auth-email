import { transporter } from '../config/nodemailer';

const sendOtpToEmail = async (otp: string, receiver: string) => {
  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: receiver,
    subject: 'Verify your account',
    html: `<h1 style="background-color: pink; padding: 10px;">Here is your OTP: ${otp}</h1>`,
  });
};

export default sendOtpToEmail;
