const nodemailer = require("nodemailer");
require("dotenv").config();

async function test() {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.verify();
    console.log("✅ Gmail SMTP LOGIN SUCCESSFUL");
  } catch (error) {
    console.log("❌ Gmail SMTP LOGIN FAILED");
    console.log(error.message);
  }
}

test();