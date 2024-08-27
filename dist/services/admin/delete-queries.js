"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryAdminDeleteLessonByChapterId = exports.queryAdminDeleteChapterById = exports.queryAdminDelEnrolledDatas = exports.queryAdminDeleteLessonByCourseId = exports.queryAdminDelChapterByCourseId = exports.queryAdminDeleteCourse = void 0;
const connnect_db_1 = __importDefault(require("../../modules/connnect-db"));
const queryAdminDeleteCourse = (courseId) => {
    return new Promise((resolve, reject) => {
        const query = 'DELETE FROM courses WHERE course_id = ?';
        connnect_db_1.default.query(query, [courseId], (err, result) => {
            if (err)
                return reject(err);
            resolve(result.affectedRows > 0);
        });
    });
};
exports.queryAdminDeleteCourse = queryAdminDeleteCourse;
// funcion to delete all chapters of a course
const queryAdminDelChapterByCourseId = (courseId) => {
    return new Promise((resolve, reject) => {
        const query = 'DELETE FROM chapters WHERE course_id = ?';
        connnect_db_1.default.query(query, [courseId], (err, result) => {
            if (err)
                return reject(err);
            resolve(result.affectedRows > 0);
        });
    });
};
exports.queryAdminDelChapterByCourseId = queryAdminDelChapterByCourseId;
// function to delete all lessons of a course
const queryAdminDeleteLessonByCourseId = (courseId) => {
    return new Promise((resolve, reject) => {
        const query = 'DELETE FROM lessons WHERE course_id = ?';
        connnect_db_1.default.query(query, [courseId], (err, result) => {
            if (err)
                return reject(err);
            resolve(result.affectedRows > 0);
        });
    });
};
exports.queryAdminDeleteLessonByCourseId = queryAdminDeleteLessonByCourseId;
// function to delete all enrolled uses in course
const queryAdminDelEnrolledDatas = (courseId) => {
    return new Promise((resolve, reject) => {
        const query = 'DELETE FROM enrolled WHERE course_id = ?';
        connnect_db_1.default.query(query, [courseId], (err, result) => {
            if (err)
                return reject(err);
            resolve(result.affectedRows > 0);
        });
    });
};
exports.queryAdminDelEnrolledDatas = queryAdminDelEnrolledDatas;
// function to delete hapter by id
const queryAdminDeleteChapterById = (chapterId) => {
    return new Promise((resolve, reject) => {
        const query = 'DELETE FROM chapters WHERE chapter_id = ?';
        connnect_db_1.default.query(query, [chapterId], (err, result) => {
            if (err)
                return reject(err);
            resolve(result.affectedRows > 0);
        });
    });
};
exports.queryAdminDeleteChapterById = queryAdminDeleteChapterById;
// funciton to delete lessons by id
const queryAdminDeleteLessonByChapterId = (chapterId) => {
    return new Promise((resolve, reject) => {
        const query = 'DELETE FROM lessons WHERE chapter_id = ?';
        connnect_db_1.default.query(query, [chapterId], (err, result) => {
            if (err)
                return reject(err);
            resolve(result.affectedRows > 0);
        });
    });
};
exports.queryAdminDeleteLessonByChapterId = queryAdminDeleteLessonByChapterId;
//# sourceMappingURL=delete-queries.js.map