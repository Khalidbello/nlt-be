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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLastVisited = exports.queryNewEnrollment = exports.queryLessonByChapterAndNUmber = exports.updateUserEnrolledCurrentLessonAndChapter = exports.queryByLessonId = exports.queryQuiz = exports.updateCurrentLessonAndChapter = exports.queryLecture = exports.queryLessons = exports.queryEnrolledCourses = exports.queryCourseEnrolledStudent = exports.queryCourseChapterNumber = exports.queryCourseLessonNumber = exports.queryCourses = exports.queryCourse = exports.queryEnrolled = exports.querychapterLessonNumber = exports.getChapters = exports.queryRecentcourse = exports.createNewUser = exports.checkUserExist = void 0;
const connnect_db_1 = __importDefault(require("../../modules/connnect-db"));
const user_queries_2_1 = require("./user-queries-2"); //  all this import are re-exported from this file
Object.defineProperty(exports, "queryCourseLessonNumber", { enumerable: true, get: function () { return user_queries_2_1.queryCourseLessonNumber; } });
Object.defineProperty(exports, "queryCourseChapterNumber", { enumerable: true, get: function () { return user_queries_2_1.queryCourseChapterNumber; } });
Object.defineProperty(exports, "queryCourseEnrolledStudent", { enumerable: true, get: function () { return user_queries_2_1.queryCourseEnrolledStudent; } });
Object.defineProperty(exports, "queryEnrolledCourses", { enumerable: true, get: function () { return user_queries_2_1.queryEnrolledCourses; } });
Object.defineProperty(exports, "queryLessons", { enumerable: true, get: function () { return user_queries_2_1.queryLessons; } });
Object.defineProperty(exports, "queryLecture", { enumerable: true, get: function () { return user_queries_2_1.queryLecture; } });
Object.defineProperty(exports, "updateCurrentLessonAndChapter", { enumerable: true, get: function () { return user_queries_2_1.updateCurrentLessonAndChapter; } });
Object.defineProperty(exports, "queryQuiz", { enumerable: true, get: function () { return user_queries_2_1.queryQuiz; } });
Object.defineProperty(exports, "queryByLessonId", { enumerable: true, get: function () { return user_queries_2_1.queryByLessonId; } });
Object.defineProperty(exports, "updateUserEnrolledCurrentLessonAndChapter", { enumerable: true, get: function () { return user_queries_2_1.updateUserEnrolledCurrentLessonAndChapter; } });
Object.defineProperty(exports, "queryLessonByChapterAndNUmber", { enumerable: true, get: function () { return user_queries_2_1.queryLessonByChapterAndNUmber; } });
const user_query_3_1 = require("../users/user-query-3");
Object.defineProperty(exports, "queryNewEnrollment", { enumerable: true, get: function () { return user_query_3_1.queryNewEnrollment; } });
Object.defineProperty(exports, "updateLastVisited", { enumerable: true, get: function () { return user_query_3_1.updateLastVisited; } });
// function to check if user exists
const checkUserExist = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        // Use parameterized query to prevent SQL injection
        const query = 'SELECT user_id, password, first_name, last_name FROM users WHERE email = ?';
        connnect_db_1.default.query(query, [email], (err, result) => {
            if (err) {
                console.error('An error occurred in checkUserExist:', err);
                reject(err); // Reject the promise with the error
            }
            else {
                resolve(result); // Resolve the promise with the boolean result
            }
        });
    });
});
exports.checkUserExist = checkUserExist;
// function to create new user
const createNewUser = (firstName, lastName, email, password, phoneNumber, gender, joined) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO users (first_name, last_name, email, password, phone_number, gender, joined, email_verified) VALUES (?, ?, ?, ?, ?, ?, ?, false)';
        connnect_db_1.default.query(query, [firstName, lastName, email, password, phoneNumber, gender, joined], (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result);
            }
            ;
        });
    });
});
exports.createNewUser = createNewUser;
// query to fetch a specifc course data
const queryCourse = (courseId) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const query = 'SELECT course_name, course_id, image, course_title, course_description, created_at, price, full_price_discount, status FROM courses WHERE course_id = ?';
        connnect_db_1.default.query(query, [courseId], (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result[0]);
            }
        });
    });
});
exports.queryCourse = queryCourse;
// query user to get recent course and date
const queryRecentcourse = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM enrolled WHERE user_id = ? ORDER BY last_visited DESC LIMIT 1';
        connnect_db_1.default.query(query, [userId], (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result[0]);
            }
        });
    });
});
exports.queryRecentcourse = queryRecentcourse;
// query to get all chapters of a course
const getChapters = (courseId) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT chapter_id, chapter_title, chapter_number FROM chapters WHERE course_id = ? ORDER BY chapter_number ASC';
        connnect_db_1.default.query(query, [courseId], (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result);
            }
        });
    });
};
exports.getChapters = getChapters;
// query length of lessons in a chapter
const querychapterLessonNumber = (chapterId) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT COUNT(*) FROM lessons  WHERE chapter_id = ?';
        connnect_db_1.default.query(query, [chapterId], (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result[0]['COUNT(*)']);
            }
        });
    });
};
exports.querychapterLessonNumber = querychapterLessonNumber;
// query enrolled to get wherre user stopped in their study
const queryEnrolled = (userId, courseId) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM enrolled WHERE user_id = ? AND course_id = ?';
        connnect_db_1.default.query(query, [userId, courseId], (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result[0]);
            }
        });
    });
};
exports.queryEnrolled = queryEnrolled;
// query to get recomended courses for user
const queryCourses = (pagin, limit) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT course_id, image, course_name, course_title, course_description, created_at, status FROM courses WHERE status = ? OR ? ORDER BY created_at DESC LIMIT  ? OFFSET  ?';
        connnect_db_1.default.query(query, ['active', 'pending', limit, pagin], (err, result) => {
            if (err)
                return reject(err);
            resolve(result);
        });
    });
};
exports.queryCourses = queryCourses;
//# sourceMappingURL=user-queries.js.map