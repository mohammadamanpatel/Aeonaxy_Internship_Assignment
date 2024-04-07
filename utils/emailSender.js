const nodemailer = require('nodemailer');

const mailSender = async function (email, title, body) {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        });

        let info = await transporter.sendMail({
            from: 'Aman bhai',
            to: email,
            subject: title,
            html: body,
        });

        console.log("Email sent:", info.response);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error; // Rethrow the error to propagate it to the caller
    }
}



module.exports = { mailSender };


