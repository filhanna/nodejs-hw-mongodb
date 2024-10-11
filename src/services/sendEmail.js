import nodemailer from "nodemailer";

import { env } from "../utils/env.js";

import { generateResetToken } from "../utils/generateResetToken.js";

export const sendResetPasswordEmail = async (email) => {
  const server = env("SMTPSERVER");
  const port = env("PORT");
  const masterPassword = env("MASTERPASSWORD");
  const login = env("LOGIN");
  const frontendUrl = env("APP_DOMAIN");
  const token = generateResetToken(email);

  const transporter = nodemailer.createTransport({
    host: server,
    port: Number(port),
    auth: {
      user: login,
      pass: masterPassword,
    },
  });
  const resetUrl = `${frontendUrl}/resetPassword?token=${token}`;

  const mailOptions = {
    from: "Support <filimonenkohanna@gmail.com>",
    to: email,
    subject: "Reset your password",
    html: `<p>To reset your password, please click on the link below:</p>
           <a href="${resetUrl}">Reset Password</a>
           <p>This link will expire in 5 minutes.</p>`,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log("Reset password email sent to:", email);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send reset password email.");
  }
};
