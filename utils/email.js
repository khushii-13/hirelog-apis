const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendLoginEmail = async (userEmail, userName) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "New Login Detected - HireLog",
      html: `
        <h3>Hello ${userName},</h3>
        <p>We detected a new login to your HireLog account.</p>
        <p>If this was you, no further action is required. If you did not authorize this login, please contact support.</p>
        <br/>
        <p>Best regards,</p>
        <p>The HireLog Team</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Login email sent: " + info.response);
  } catch (error) {
    console.error("Error sending login email: ", error);
  }
};

module.exports = { sendLoginEmail };
