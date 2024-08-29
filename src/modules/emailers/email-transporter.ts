const nodemailer = require('nodemailer');

const transporter = (sender: string, password: string) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST, // Replace with your DNS provider's SMTP host
        port: process.env.EMAIL_PORT, // Replace with appropriate port (e.g., 465 for SSL/TLS)
        secure: true, // Use true for SSL/TLS encryption (recommended)
        auth: {
            user: sender, // Replace with your email address
            pass: password, // Replace with your email password
        },
    });

    return transporter;
}

export default transporter