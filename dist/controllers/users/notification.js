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
exports.setNotToViewed = exports.getNotifications = exports.checkUnViewedNotiication = void 0;
const notificaion_queries_1 = require("../../services/users/notificaion-queries");
const checkUnViewedNotiication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.id;
        // @ts-ignore
        const notificationExists = yield (0, notificaion_queries_1.queryUserCountUnViewedNoti)(userId);
        if (!notificationExists)
            return res.json({ status: false });
        res.json({ status: true });
    }
    catch (err) {
        console.error('an error occured check if notification exists', err);
        res.status(500).json({ message: err });
    }
    ;
});
exports.checkUnViewedNotiication = checkUnViewedNotiication;
const getNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        // @ts-ignore
        const userId = (_b = req.session.user) === null || _b === void 0 ? void 0 : _b.id;
        const limit = parseInt(req.params.limit);
        const pagin = parseInt(req.params.pagin);
        const notificaions = yield (0, notificaion_queries_1.queryUserNotifications)(userId, limit, pagin);
        res.json(notificaions);
        (0, notificaion_queries_1.userQueryUpdateNoteToViewed)(userId);
    }
    catch (err) {
        console.error('an error occured fetch lessons', err);
        res.status(500).json({ message: err });
    }
    ;
});
exports.getNotifications = getNotifications;
// function to set all user notification to viewed
const setNotToViewed = (req, res) => {
    var _a;
    try {
        // @ts-ignore
        const userId = (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.id;
        const updated = (0, notificaion_queries_1.userQueryUpdateNoteToViewed)(userId);
        res.json({ message: 'notifications updated' });
    }
    catch (err) {
        console.error('error in updating all notifiaion to viwed', err);
        res.status(500).json({ message: err });
    }
    ;
};
exports.setNotToViewed = setNotToViewed;
//# sourceMappingURL=notification.js.map