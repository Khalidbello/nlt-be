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
exports.queryOtp = exports.querySaveOtp = exports.queryDeleteOtp = void 0;
const connnect_db_1 = __importDefault(require("../modules/connnect-db"));
const queryDeleteOtp = (userId) => {
    return new Promise((resolve, reject) => {
        const query = 'DELETE FROM otp WHERE user_id = ?';
        connnect_db_1.default.query(query, [userId], (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result.affectedRows > 0);
            }
        });
    });
};
exports.queryDeleteOtp = queryDeleteOtp;
const querySaveOtp = (userId, otp) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const date = new Date();
        const query = 'INSERT INTO otp (user_id, otp, date) VALUES (?, ?, ?)';
        connnect_db_1.default.query(query, [userId, otp, date], (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result.affectedRows > 0);
            }
        });
    });
});
exports.querySaveOtp = querySaveOtp;
const queryOtp = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const query = 'SELECT user_id, otp, date FROM otp WHERE user_id = ?';
        connnect_db_1.default.query(query, [userId], (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result[0]);
            }
        });
    });
});
exports.queryOtp = queryOtp;
//# sourceMappingURL=otp-queries.js.map