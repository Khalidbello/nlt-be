"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryAddNewNotification = exports.userQueryUpdateNoteToViewed = exports.queryUserNotifications = exports.queryUserCountUnViewedNoti = void 0;
const connnect_db_1 = __importDefault(require("../../modules/connnect-db"));
const queryUserCountUnViewedNoti = (userId) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT COUNT(*) FROM notifications WHERE user_id = ? AND viewed = false';
        connnect_db_1.default.query(query, [userId], (err, result) => {
            if (err)
                return reject(err);
            resolve(result[0]['COUNT(*)']);
        });
    });
};
exports.queryUserCountUnViewedNoti = queryUserCountUnViewedNoti;
// funcion to query usr notificaions and order it by data in latest to oldest
const queryUserNotifications = (userId, limit, pagin) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?';
        connnect_db_1.default.query(query, [userId, limit, pagin], (err, result) => {
            if (err)
                return reject(err);
            resolve(result);
        });
    });
};
exports.queryUserNotifications = queryUserNotifications;
// query to set all unviewed notification to viewd
const userQueryUpdateNoteToViewed = (userId) => {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE notifications SET viewed = true WHERE user_id = ? AND viewed = false ';
        connnect_db_1.default.query(query, [userId], (err, result) => {
            if (err)
                return reject(err);
            resolve(true);
        });
    });
};
exports.userQueryUpdateNoteToViewed = userQueryUpdateNoteToViewed;
// query to add new notificatiion
const queryAddNewNotification = (userId, message, type) => {
    return new Promise((resolve, reject) => {
        const date = new Date();
        const query = 'INSERT INTO notifications (user_id, message, type, created_at, viewed) VALUES (?, ?, ?, ?, false)';
        connnect_db_1.default.query(query, [userId, message, type, date], (err, resuult) => {
            if (err)
                return reject(err);
            resolve(resuult.affectedRows > 0);
        });
    });
};
exports.queryAddNewNotification = queryAddNewNotification;
//# sourceMappingURL=notificaion-queries.js.map