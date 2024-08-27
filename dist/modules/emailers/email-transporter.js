"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer = require('nodemailer');
const transporter = (sender, password) => {
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
};
exports.default = transporter;
//# sourceMappingURL=email-transporter.js.map