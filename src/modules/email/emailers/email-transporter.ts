const nodemailer = require('nodemailer');

const transporter = (sender: string, password: string) => {
    const transporter = nodemailer.createTransport({
        host: 'mail.botsub.com.ng', // Replace with your DNS provider's SMTP host
        port: 465, // Replace with appropriate port (e.g., 465 for SSL/TLS)
        secure: true, // Use true for SSL/TLS encryption (recommended)
        auth: {
            user: sender, // Replace with your email address
            pass: password, // Replace with your email password
        },
    });

    return transporter;
}

export default transporter