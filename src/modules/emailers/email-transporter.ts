const nodemailer = require('nodemailer');

// const transporter = (sender: string, password: string) => {
//     const transporter = nodemailer.createTransport({
//         host: process.env.EMAIL_HOST, // Replace with your DNS provider's SMTP host
//         port: process.env.EMAIL_PORT, // Replace with appropriate port (e.g., 465 for SSL/TLS)
//         secure: true, // Use true for SSL/TLS encryption (recommended)
//         auth: {
//             user: sender, // Replace with your email address
//             pass: password, // Replace with your email password
//         },
//     });

//     return transporter;
// }



const transporter = (sender: string, password: string) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: '7b224f001@smtp-brevo.com', // your Brevo SMTP login
            pass: 'jA7Usn1t4aGyFJmf', // your Brevo SMTP master password
        },
    });

    return transporter;
};



export default transporter;