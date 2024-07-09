const handleBars = require('handlebars');
const fs = require('fs');
import sendEmail from "./email-sender";

const courseEnrollEmailSender = async (userEmail: string, firstName: string, paymentType: string, courseName: string) => {
    try {
        let courseEnrollTemp: string = await fs.promises.readFile('email-templates/course-enroll-template.hbs', 'utf8',);

        const compiledTemp = handleBars.compile(courseEnrollTemp);
        const html = compiledTemp({
            name: firstName,
            courseName: courseName,
            paymentType: paymentType
        });

        // @ts-ignore
        sendEmail(process.env.ADMIN_EMAIL, process.env.ADMIN_MAIL_P, userEmail, 'Succesfull Course Enrollment', html)
    } catch (err) {
        console.error('errror sending email in corse enroll email', err);
    };
};

export default courseEnrollEmailSender;