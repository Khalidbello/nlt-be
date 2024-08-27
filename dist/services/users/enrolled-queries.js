"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryCourseCompletion = void 0;
const connnect_db_1 = __importDefault(require("../../modules/connnect-db"));
// query to set user course completion
const queryCourseCompletion = (userId, courseId) => {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE enrolled SET completed = true WHERE user_id = ? AND course_id = ?';
        connnect_db_1.default.query(query, [userId, courseId], (err, result) => {
            if (err)
                return reject(err);
            resolve(result.affectedRows > 0);
        });
    });
};
exports.queryCourseCompletion = queryCourseCompletion;
//# sourceMappingURL=enrolled-queries.js.map