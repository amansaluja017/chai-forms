import nodemailer from 'nodemailer';
import {logger} from "@repo/logger";

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS
  }
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  const mailOptions = {
    from: process.env.NODEMAILER_USER,
    to,
    subject,
    html
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error: any) {
    logger.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};
