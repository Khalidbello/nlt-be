"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryAdminDeleteQuestion = exports.queryAdminEditQustion = exports.queryAdminCreateQuiz = void 0;
const connnect_db_1 = __importDefault(require("../../modules/connnect-db"));
// function to create new quiz 
const queryAdminCreateQuiz = (courseId, chapterId, lessonId, question, option1, option2, option3, option4, answer) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO questions (course_id, chapter_id, lesson_id, question, option_a, option_b, option_c, option_d, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        connnect_db_1.default.query(query, [courseId, chapterId, lessonId, question, option1, option2, option3, option4, answer], (err, result) => {
            if (err)
                return reject(err);
            resolve(result.affectedRows > 0);
        });
    });
};
exports.queryAdminCreateQuiz = queryAdminCreateQuiz;
// query to edit question
const queryAdminEditQustion = (questionId, question, option1, option2, option3, option4, answer) => {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE questions SET question = ?, option_a = ?, option_b = ?, option_c = ?, option_d = ?, correct_option = ? WHERE question_id = ?';
        connnect_db_1.default.query(query, [question, option1, option2, option3, option4, answer, questionId], (err, result) => {
            if (err)
                return reject(err);
            resolve(result.affectedRows > 0);
        });
    });
};
exports.queryAdminEditQustion = queryAdminEditQustion;
// query to delete question
const queryAdminDeleteQuestion = (questionId) => {
    return new Promise((resolve, reject) => {
        const query = 'DELETE FROM questions WHERE question_id = ?';
        connnect_db_1.default.query(query, [questionId], (err, result) => {
            if (err)
                return reject(err);
            resolve(result.affectedRows > 0);
        });
    });
};
exports.queryAdminDeleteQuestion = queryAdminDeleteQuestion;
//# sourceMappingURL=quiz-queries.js.map