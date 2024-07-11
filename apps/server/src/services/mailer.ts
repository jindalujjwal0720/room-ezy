import nodemailer from 'nodemailer';
import templates from './../views/emails';

const transporter = nodemailer.createTransport({
  service: process.env.MAILING_SERVICE_PROVIDER,
  host: process.env.MAILING_SERVICE_HOST,
  port: process.env.MAILING_SERVICE_PORT,
  auth: {
    user: process.env.MAILING_SERVICE_USER,
    pass: process.env.MAILING_SERVICE_USER_PASSWORD,
  },
} as nodemailer.TransportOptions);

class Mailer {
  static async sendMail({
    from,
    to,
    subject,
    text,
    html,
  }: {
    from: string;
    to: string;
    subject: string;
    text?: string;
    html?: string;
  }) {
    return await new Promise((resolve, reject) => {
      transporter.sendMail({ from, to, subject, text, html }, (err, info) => {
        if (err) {
          reject(err);
        }
        resolve(info);
      });
    });
  }

  static async sendLoginOTP({ email, otp }: { email: string; otp: string }) {
    return await Mailer.sendMail({
      from: process.env.MAILING_SERVICE_USER as string,
      to: email,
      subject: 'Login OTP for your RoomEzy account',
      html: templates.otpVerification({
        otp,
        expiryDuration: Number(process.env.LOGIN_OTP_EXPIRY_DURATION || 0) / 60,
        supportEmail: process.env.MAILING_SUPPORT_EMAIL as string,
      }),
    });
  }
}

export default Mailer;
