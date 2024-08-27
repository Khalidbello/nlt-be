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
const email_transporter_1 = __importDefault(require("./email-transporter"));
const sendEmail = (userName, password, reciever, subject, htmlContent) => __awaiter(void 0, void 0, void 0, function* () {
    const transport = (0, email_transporter_1.default)(userName, password);
    const mailOptions = {
        from: userName, // Replace with your email address
        to: reciever,
        subject,
        html: htmlContent,
    };
    try {
        const info = yield transport.sendMail(mailOptions);
        console.log('Email sent successfully:', info.response);
    }
    catch (error) {
        console.error('Error sending email:', error);
    }
    ;
});
exports.default = sendEmail;
//# sourceMappingURL=email-sender.js.map