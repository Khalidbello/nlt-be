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
const otp_queries_1 = require("../services/otp-queries");
const generate_random_string_1 = __importDefault(require("./generate-random-string"));
const otpGenerator = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield (0, otp_queries_1.queryDeleteOtp)(userId);
            // @ts-ignore
            const otp = (0, generate_random_string_1.default)(4, true);
            const saved = yield (0, otp_queries_1.querySaveOtp)(userId, otp);
            if (!saved)
                throw 'failed to save new otp';
            resolve(otp);
        }
        catch (err) {
            reject(err);
        }
    }));
});
exports.default = otpGenerator;
//# sourceMappingURL=otp-generator.js.map