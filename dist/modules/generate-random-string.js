"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generateRandomAlphanumericCode = (length, onlyNumber) => {
    let characters = onlyNumber ? '123456789' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    ;
    const toReturn = onlyNumber ? parseInt(result) : result;
    return toReturn;
};
exports.default = generateRandomAlphanumericCode;
//# sourceMappingURL=generate-random-string.js.map