"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryAdminByEmail = void 0;
const connnect_db_1 = __importDefault(require("../../modules/connnect-db"));
// query ti fetch admin by id
const queryAdminByEmail = (email) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM admins WHERE email = ?';
        connnect_db_1.default.query(query, [email], (err, result) => {
            if (err)
                return reject(err);
            resolve(result);
        });
    });
};
exports.queryAdminByEmail = queryAdminByEmail;
//# sourceMappingURL=auth.js.map