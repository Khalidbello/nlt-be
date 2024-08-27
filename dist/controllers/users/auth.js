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
exports.passwordRecoveryConfirmOtp = exports.passwordRecoveryCheckUser = exports.createAccountHandler = exports.logInHandler = void 0;
const user_queries_1 = require("../../services/users/user-queries");
const email_otp_1 = __importDefault(require("../../modules/emailers/email-otp"));
const otp_generator_1 = __importDefault(require("../../modules/otp-generator"));
const otp_queries_1 = require("../../services/otp-queries");
// function to handle user login
const logInHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const response = yield (0, user_queries_1.checkUserExist)(email);
        if (response.length > 0 && response[0].password === password) {
            req.session.user = {
                email: email,
                type: 'normal',
                id: response[0].user_id
            };
            return res.status(200).json({ message: 'logged in succesfully' });
        }
        ;
        res.status(404).json({ message: 'user with cridentials not found' });
    }
    catch (err) {
        console.error('error in login handler', err);
        res.status(500).json({ message: err });
    }
    ;
});
exports.logInHandler = logInHandler;
// function to handle creating of new accont 
const createAccountHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, password, phoneNumber, gender } = req.body;
    const date = new Date();
    try {
        const response = yield (0, user_queries_1.checkUserExist)(email);
        if (response.length > 0) {
            return res.status(409).json({ message: 'user exist' });
        }
        ;
        const created = yield (0, user_queries_1.createNewUser)(firstName, lastName, email, password, phoneNumber, gender, date);
        if (created.affectedRows > 0) {
            req.session.user = {
                email: email,
                type: 'normal',
                // @ts-ignore
                id: created.insertId
            };
            return res.json({ message: 'account created successfully' });
        }
        ;
        throw 'unable to create new user';
    }
    catch (err) {
        console.error('error in create accont handler', err);
        res.status(500).json({ message: 'An error occured trying to create acount' });
    }
    ;
});
exports.createAccountHandler = createAccountHandler;
// function to checkif user exist 
const passwordRecoveryCheckUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const exist = yield (0, user_queries_1.checkUserExist)(email);
        if (!exist[0])
            return res.status(404).json({ message: 'user with credentials not found.' });
        // ts-ignore
        const opt = yield (0, otp_generator_1.default)(exist[0].user_id);
        // send otp email
        (0, email_otp_1.default)(email, exist[0].first_name, opt);
        res.json({ message: 'user exist' });
    }
    catch (err) {
        console.error('error in passwordRecoveryCheckUser', err);
        res.status(500).json({ message: 'An error occured trying to find account' });
    }
    ;
});
exports.passwordRecoveryCheckUser = passwordRecoveryCheckUser;
// function to confirm otp if valid retrun user password
const passwordRecoveryConfirmOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const otp = req.body.otp;
        const email = req.body.email;
        if (!email || !otp)
            return res.status(400).json({ message: 'incomlete data sent to server' });
        const user = yield (0, user_queries_1.checkUserExist)(email);
        const dbOtp = yield (0, otp_queries_1.queryOtp)(user[0].user_id);
        const equal = otp === (dbOtp === null || dbOtp === void 0 ? void 0 : dbOtp.otp);
        if (!equal)
            return res.status(401).json({ status: equal });
        yield (0, otp_queries_1.queryDeleteOtp)(user[0].user_id);
        res.json({ password: user[0].password });
    }
    catch (err) {
        console.error('error in passwordRecoveryCheckUser', err);
        res.status(500).json({ message: 'An error occured tryng get user password' });
    }
    ;
});
exports.passwordRecoveryConfirmOtp = passwordRecoveryConfirmOtp;
//# sourceMappingURL=auth.js.map