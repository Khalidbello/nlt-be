const handleBars = require('handlebars');
const fs = require('fs');
import sendEmail from "./email-sender";

const emailOtpSender = async (userEmail: string, firstName: string, otp: number) => {
    try {
        let courseEnrollTemp: string = await fs.promises.readFile('src/modules/email/email-templates/email-otp-template.hbs', 'utf8',);

        console.log('temp', courseEnrollTemp)
        const compiledTemp = handleBars.compile(courseEnrollTemp);
        const html = compiledTemp({
            name: firstName,
            otp: otp
        });
        console.log('html', html)

        // @ts-ignore
        sendEmail(process.env.ADMIN_EMAIL, process.env.ADMIN_MAIL_P, userEmail, 'Succesfull Course Enrollment', html)
    } catch (err) {
        console.log('errror sending email in corse enroll email', err);
    }
}

export default emailOtpSender;