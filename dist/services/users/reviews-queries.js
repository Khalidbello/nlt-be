"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryUpdateUserReviewed = exports.querySaveReview = exports.queryGetReviews = void 0;
const connnect_db_1 = __importDefault(require("../../modules/connnect-db"));
const queryGetReviews = (pagin, limit) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM reviews LIMIT ? OFFSET ?';
        connnect_db_1.default.query(query, [limit, pagin], (err, result) => {
            if (err)
                return reject(err);
            resolve(result);
        });
    });
};
exports.queryGetReviews = queryGetReviews;
// query to save new review
const querySaveReview = (userId, courseName, review, name) => {
    return new Promise((resolve, reject) => {
        const date = new Date();
        const query = 'INSERT INTO reviews (user_id, name, course_name, review, created_at) VALUES (?, ?, ?, ?, ?)';
        connnect_db_1.default.query(query, [userId, name, courseName, review, date], (err, result) => {
            if (err)
                return reject(err);
            resolve(result.affectedRows > 0);
        });
    });
};
exports.querySaveReview = querySaveReview;
//query to udate user enrolled reviewed to true
const queryUpdateUserReviewed = (courseId, userId) => {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE enrolled SET reviewed = ? WHERE user_id = ? AND course_id = ?';
        connnect_db_1.default.query(query, [true, userId, courseId], (err, result) => {
            if (err)
                return reject(err);
            resolve(result.affectedRows > 0);
        });
    });
};
exports.queryUpdateUserReviewed = queryUpdateUserReviewed;
//# sourceMappingURL=reviews-queries.js.map