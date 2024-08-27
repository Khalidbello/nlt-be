"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryAddEmailToNewsLetter = void 0;
const connnect_db_1 = __importDefault(require("../../modules/connnect-db"));
const queryAddEmailToNewsLetter = (email) => {
    return new Promise((resolve, reject) => {
        const date = new Date();
        const query = 'INSERT INTO news_letter (email, created_at) VALUES (?, ?)';
        connnect_db_1.default.query(query, [email, date], (err, result) => {
            if (err)
                return reject(err);
            resolve(result);
        });
    });
};
exports.queryAddEmailToNewsLetter = queryAddEmailToNewsLetter;
//# sourceMappingURL=news-letter-query.js.map