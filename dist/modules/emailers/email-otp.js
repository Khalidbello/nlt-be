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
const error_recorder_1 = __importDefault(require("../error-recorder"));
const email_sender_1 = __importDefault(require("./email-sender"));
const emailOtpSender = (userEmail, firstName, otp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let courseEnrollTemp = yield fs.promises.readFile('email-templates/email-otp-template.hbs', 'utf8');
        //console.log('temp', courseEnrollTemp)
        const compiledTemp = handleBars.compile(courseEnrollTemp);
        const html = compiledTemp({
            name: firstName,
            otp: otp
        });
        //console.log('html', html)
        // @ts-ignore
        (0, email_sender_1.default)(process.env.ADMIN_EMAIL, process.env.ADMIN_MAIL_P, userEmail, 'One time password', html);
    }
    catch (err) {
        (0, error_recorder_1.default)(err);
        console.error('errror sending email in corse enroll email', err);
    }
});
exports.default = emailOtpSender;
//# sourceMappingURL=email-otp.js.map