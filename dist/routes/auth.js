"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../controllers/users/auth");
const auth_2 = require("../controllers/admin/auth");
const router = (0, express_1.Router)();
router.post('/login', (req, res) => (0, auth_1.logInHandler)(req, res));
router.post('/create-account', (req, res) => (0, auth_1.createAccountHandler)(req, res));
router.post('/admin-login', (req, res) => (0, auth_2.adminLoginHandler)(req, res));
router.post('/password-recovery-email', (req, res) => (0, auth_1.passwordRecoveryCheckUser)(req, res));
router.post('/password-recovery-otp', (req, res) => (0, auth_1.passwordRecoveryConfirmOtp)(req, res));
exports.default = router;
//# sourceMappingURL=auth.js.map