const nodemailer = require('nodemailer');

const transporter = (sender: string, password: string) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.ADMIN_MAIL_LOGIN, // your Brevo SMTP login
            pass: process.env.ADMIN_MAIL_P, // your Brevo SMTP master password
        },
    });

    return transporter;
};



export default transporter; 