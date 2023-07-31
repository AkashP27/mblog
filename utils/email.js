const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
	// 1) Create Transporter
	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.EMAIL_USERNAME,
			pass: process.env.EMAIL_PASSWORD,
		},
	});

	// 2) Define the mail options
	const mailOptions = {
		from: process.env.EMAIL_USERNAME,
		to: options.email,
		subject: options.subject,
		text: options.message,
	};

	// 3) Actually send the email
	await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
