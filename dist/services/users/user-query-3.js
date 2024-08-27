"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryUserDp = exports.queryUpdateUserDp = exports.queryUserSaveDp = exports.queryUpdateUserNames = exports.queryUpdatePassword = exports.querySaveEmailVerify = exports.updateEnrollmentPaymentType = exports.updateLastVisited = exports.queryNewEnrollment = exports.queryUserProfile = void 0;
const connnect_db_1 = __importDefault(require("../../modules/connnect-db"));
const queryUserProfile = (userId) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM users WHERE user_id = ?';
        connnect_db_1.default.query(query, [userId], (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result[0]);
            }
        });
    });
};
exports.queryUserProfile = queryUserProfile;
const queryNewEnrollment = (userId, courseId, payment, chapterId, lessonId) => {
    return new Promise((resolve, reject) => {
        const date = new Date();
        const query = `INSERT INTO enrolled (user_id, course_id, payment_type, enrolled_at, last_visited, current_lesson_id, current_chapter_id, current_lesson_number, current_chapter_number, quiz_performance) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        connnect_db_1.default.query(query, [userId, courseId, payment, date, date, lessonId, chapterId, 1, 1, 100], (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result.affectedRows > 0);
            }
        });
    });
};
exports.queryNewEnrollment = queryNewEnrollment;
// query to update course enrollment payment type
const updateEnrollmentPaymentType = (userId, courseId, payment) => {
    return new Promise((resolve, reject) => {
        const nowDate = new Date();
        const stringDate = nowDate.toISOString();
        const query = `UPDATE enrolled SET payment_type = ? WHERE user_id = ? AND course_id = ?`;
        connnect_db_1.default.query(query, [payment, userId, courseId], (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result.affectedRows > 0);
            }
        });
    });
};
exports.updateEnrollmentPaymentType = updateEnrollmentPaymentType;
// query to update users recent course
const updateLastVisited = (userId, courseId) => {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE enrolled SET last_visited = ? WHERE user_id = ? and course_id = ?';
        const date = new Date();
        connnect_db_1.default.query(query, [date, userId, courseId], (err, result) => {
            if (err)
                return reject(err);
            resolve(result);
        });
    });
};
exports.updateLastVisited = updateLastVisited;
// const function to change user email verified to true
const querySaveEmailVerify = (userId, email) => {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE users SET email_verified = ?, email = ? WHERE user_id = ?';
        connnect_db_1.default.query(query, [true, email, userId], (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result.affectedRows > 0);
            }
        });
    });
};
exports.querySaveEmailVerify = querySaveEmailVerify;
// query to update user password
const queryUpdatePassword = (userId, newPassword) => {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE users SET password = ? WHERE user_id = ?';
        connnect_db_1.default.query(query, [newPassword, userId], (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result.affectedRows > 0);
            }
        });
    });
};
exports.queryUpdatePassword = queryUpdatePassword;
// query to handle to change user name
const queryUpdateUserNames = (userId, firstName, lastName) => {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE users SET first_name = ?, last_name = ? WHERE user_id = ?';
        connnect_db_1.default.query(query, [firstName, lastName, userId], (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result.affectedRows > 0);
            }
        });
    });
};
exports.queryUpdateUserNames = queryUpdateUserNames;
// query chck if user has dp
const queryUserDp = (userId) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM user_dp WHERE user_id = ? LIMIT 1';
        connnect_db_1.default.query(query, [userId], (err, result) => {
            if (err)
                return reject(err);
            resolve(result[0]);
        });
    });
};
exports.queryUserDp = queryUserDp;
// query to upload user image
const queryUserSaveDp = (userId, imageBuffer) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO user_dp (user_id, dp) VALUES (?, ?)';
        connnect_db_1.default.query(query, [userId, imageBuffer], (err, result) => {
            if (err)
                return reject(err);
            resolve(result.affectedRows > 0);
        });
    });
};
exports.queryUserSaveDp = queryUserSaveDp;
// to update user dp
const queryUpdateUserDp = (userId, imageBuffer) => {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE user_dp SET dp = ? WHERE user_id = ?';
        connnect_db_1.default.query(query, [imageBuffer, userId], (err, result) => {
            if (err)
                return reject(err);
            resolve(result.affectedRows > 0);
        });
    });
};
exports.queryUpdateUserDp = queryUpdateUserDp;
//# sourceMappingURL=user-query-3.js.map