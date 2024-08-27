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
exports.adminLoginHandler = void 0;
const auth_1 = require("../../services/admin/auth");
const adminLoginHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const response = yield (0, auth_1.queryAdminByEmail)(email);
        if (response.length > 0 && response[0].password === password) {
            req.session.user = {
                email: email,
                type: 'admin',
                id: response[0].id
            };
            return res.status(200).json({ message: 'logged in succesfully' });
        }
        ;
        res.status(404).json({ message: 'admin with cridentials not found' });
    }
    catch (err) {
        console.error('error signing in admin', err);
        res.status(500).json({ message: err });
    }
    ;
});
exports.adminLoginHandler = adminLoginHandler;
//# sourceMappingURL=auth.js.map