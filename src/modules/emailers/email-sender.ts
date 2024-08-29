// const SibApiV3Sdk = require('sib-api-v3-sdk');
// const defaultClient = SibApiV3Sdk.ApiClient.instance;

// // Configure API key authorization: api-key
// const apiKey = defaultClient.authentications['api-key'];
// apiKey.apiKey = process.env.BREVO_KEY; // Make sure this environment variable is set

// const sendEmail = async (
//     userName: string,
//     password: string,
//     reciever: string,
//     subject: string,
//     htmlContent: string
// ) => {
//     const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

//     // Construct the email object
//     const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail({
//         to: [{ email: reciever, name: userName }],
//         sender: { email: 'sender@example.com', name: 'Sender Name' }, // Replace with actual sender details
//         subject: subject, // Use the passed subject
//         textContent: 'LifeStyleLeverage',
//         htmlContent: htmlContent, // Use the passed HTML content
//     });

//     try {
//         // Log the constructed email object
//         console.log('sendSmtpEmail:', JSON.stringify(sendSmtpEmail, null, 2));

//         // Send the email
//         const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
//         console.log('API called successfully. Returned data: ' + JSON.stringify(data));
//     } catch (error: any) {
//         console.error('Error in sending email:', error.response?.text || error.message);
//     }
// };



import storeErrorMessage from "../error-recorder";
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
    };
};

export default sendEmail;