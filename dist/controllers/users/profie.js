"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.getUserDp = exports.userDpUpload = exports.handleChangeNames = exports.handleChangePassword = exports.getUserProfileData = void 0;
const user_query_3_1 = require("../../services/users/user-query-3");
const fs = __importStar(require("fs/promises"));
const formidable_1 = __importDefault(require("formidable"));
const form = (0, formidable_1.default)();
const getUserProfileData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.id;
        //@ts-ignore
        const userData = yield (0, user_query_3_1.queryUserProfile)(userId);
        res.json(userData);
    }
    catch (err) {
        console.error('error in get user prodile data', err);
        res.status(500).json({ messagge: err });
    }
});
exports.getUserProfileData = getUserProfileData;
// function to handle password changing
const handleChangePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const userId = (_b = req.session.user) === null || _b === void 0 ? void 0 : _b.id;
        const { password, newPassword } = req.body;
        if (!userId || !password || !newPassword)
            return res.status(402).json({ message: 'incomplete data sent to server for processing' });
        const profileData = yield (0, user_query_3_1.queryUserProfile)(userId);
        if (profileData.password !== password || password.length < 8 || newPassword.length < 8)
            return res.status(401).json({ message: 'Incorrect password entered' });
        const updated = yield (0, user_query_3_1.queryUpdatePassword)(userId, newPassword);
        if (!updated)
            throw 'something went wrong updatig user Names';
        res.json({ status: updated });
    }
    catch (err) {
        console.error('error changing user password', err);
        res.status(500).json({ message: err });
    }
});
exports.handleChangePassword = handleChangePassword;
// fuunction to handle change name
const handleChangeNames = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const userId = (_c = req.session.user) === null || _c === void 0 ? void 0 : _c.id;
        const { firstName, lastName } = req.body;
        if (!userId || !firstName || !lastName)
            return res.status(402).json({ message: 'incomplete data sent to server for processing' });
        const updated = yield (0, user_query_3_1.queryUpdateUserNames)(userId, firstName, lastName);
        if (!updated)
            throw 'something went wrong updatig user Names';
        res.json({ status: updated });
    }
    catch (err) {
        console.error('error in changing user names password', err);
        res.status(500).json({ message: err });
    }
    ;
});
exports.handleChangeNames = handleChangeNames;
// funcition to haanle user dp upload
const userDpUpload = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    try {
        const data = yield new Promise((resolve, reject) => {
            form.parse(req, (err, formFields, formFiles) => {
                if (err) {
                    return reject(err);
                }
                resolve({ fields: formFields, files: formFiles });
            });
        });
        const userId = (_d = req.session.user) === null || _d === void 0 ? void 0 : _d.id;
        // @ts-ignore
        const file = data.files.dp[0];
        if (!userId || !file)
            return res.status(400).json({ message: 'Incomplete data sent to server for processing' });
        const imageBuffer = yield fs.readFile(file.filepath);
        // @ts-ignore
        const dpExists = yield (0, user_query_3_1.queryUserDp)(parseInt(userId));
        let saved;
        if (dpExists) {
            saved = (0, user_query_3_1.queryUpdateUserDp)(userId, imageBuffer);
        }
        else {
            saved = (0, user_query_3_1.queryUserSaveDp)(userId, imageBuffer);
        }
        ;
        if (!saved)
            throw 'Error saving user dp';
        res.json({ message: 'image uploaded succesfully' });
    }
    catch (err) {
        console.error('error user image upload', err);
        res.status(500).json({ message: err });
    }
    ;
});
exports.userDpUpload = userDpUpload;
// route to retunr user profile pucture 
const getUserDp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    try {
        const userId = (_e = req.session.user) === null || _e === void 0 ? void 0 : _e.id;
        // @ts-ignore
        const userDp = yield (0, user_query_3_1.queryUserDp)(userId);
        if (!userDp)
            return res.status(404).json({ message: 'not dp found' });
        userDp.dp = Buffer.from(userDp.dp).toString('base64');
        res.json(userDp);
    }
    catch (err) {
        console.error('error user image upload', err);
        res.status(500).json({ message: err });
    }
    ;
});
exports.getUserDp = getUserDp;
//# sourceMappingURL=profie.js.map