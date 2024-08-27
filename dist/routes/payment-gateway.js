"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const gateway_1 = require("../controllers/gateway");
const router = (0, express_1.Router)();
router.get('/generate-account-number/:courseId/:paymentType', (req, res) => (0, gateway_1.generateOneTimeAcc)(req, res));
router.post('/webhook', (req, res) => (0, gateway_1.webhookHandler)(req, res));
exports.default = router;
//# sourceMappingURL=payment-gateway.js.map