"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const handleBars = require('handlebars');
const fs = require('fs');
const email_sender_1 = __importDefault(require("./email-sender"));
const courseEnrollEmailSender = (userEmail, firstName, paymentType, courseName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let courseEnrollTemp = yield fs.promises.readFile('email-templates/course-enroll-template.hbs', 'utf8');
        const compiledTemp = handleBars.compile(courseEnrollTemp);
        const html = compiledTemp({
            name: firstName,
            courseName: courseName,
            paymentType: paymentType
        });
        // @ts-ignore
        (0, email_sender_1.default)(process.env.ADMIN_EMAIL, process.env.ADMIN_MAIL_P, userEmail, 'Succesfull Course Enrollment', html);
    }
    catch (err) {
        console.error('errror sending email in corse enroll email', err);
    }
    ;
});
exports.default = courseEnrollEmailSender;
//# sourceMappingURL=course-enroll.js.map