const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const templatePath = path.join(__dirname, "email-template.html");

const htmlTemplate = fs.readFileSync(templatePath, "utf-8");

const template = handlebars.compile(htmlTemplate);

// Create a transporter object using Gmail SMTP
const transporter = nodemailer.createTransport({
  port: process.env.SERVICE_PORT,
  host: process.env.SERVICE_HOST,
  secure: true, // Enable TLS encryption
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

exports.sendForgotPasswordMail = async (toUser, name, password) => {
  const data = {
    name: name,
    password: password,
  };

  // Email options
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toUser,
    subject: "Forgot your password?",
    html: template(data),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Failed to send email: " + error.message);
      // throw new Error("Failed to send email: " + error.message);
    }
  });
};
