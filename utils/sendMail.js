import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendEmail = async (options) => {
  try {
    const transporterConfig = process.env.EMAIL_SERVICE
      ? {
          service: process.env.EMAIL_SERVICE,
          auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASS,
          },
        }
      : {
          host: process.env.EMAIL_HOST,
          port: Number(process.env.EMAIL_PORT) || 587,
          secure: process.env.EMAIL_SECURE === "true", // true = 465, false = 587
          auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASS,
          },
        };

    const transporter = nodemailer.createTransport(transporterConfig);

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USERNAME,
      to: options.to,
      subject: options.subject,
      text: options.text || "",
      html: options.html || options.text || "",
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.messageId);
    return info;
  } catch (err) {
    console.error("❌ Email sending failed:", err.message);
    throw err;
  }
};
