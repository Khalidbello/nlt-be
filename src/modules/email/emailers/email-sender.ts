import transporter from "./email-transporter";

const sendEmail = async (userName: string, password: string, reciever: string, subject: string, htmlContent: string) => {
    const transport = transporter(userName, password);

    const mailOptions = {
        from: userName, // Replace with your email address
        to: reciever,
        subject,
        html: htmlContent,
    };

    try {
        const info = await transport.sendMail(mailOptions);
        console.log('Email sent successfully:', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};


export default sendEmail;