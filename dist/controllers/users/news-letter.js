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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsLetter = void 0;
const news_letter_query_1 = require("../../services/users/news-letter-query");
const NewsLetter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        res.json({ message: 'news letter subcription successful.' });
        (0, news_letter_query_1.queryAddEmailToNewsLetter)(email);
    }
    catch (err) {
        console.error('error in adding email to news letter', err);
    }
    ;
});
exports.NewsLetter = NewsLetter;
//# sourceMappingURL=news-letter.js.map