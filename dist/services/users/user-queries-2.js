"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryLessonByChapterAndNUmber = exports.updateUserEnrolledCurrentLessonAndChapter = exports.queryByLessonId = exports.queryQuiz = exports.updateCurrentLessonAndChapter = exports.queryLecture = exports.queryLessons = exports.queryEnrolledCourses = exports.queryCourseEnrolledStudent = exports.queryCourseChapterNumber = exports.queryCourseLessonNumber = void 0;
const connnect_db_1 = __importDefault(require("../../modules/connnect-db"));
//get course number of lesons
const queryCourseLessonNumber = (courseId) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT COUNT(*) FROM lessons WHERE course_id = ?';
        connnect_db_1.default.query(query, [courseId], (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result[0]['COUNT(*)']);
            }
        });
    });
};
exports.queryCourseLessonNumber = queryCourseLessonNumber;
// get course numbe rof chapters
const queryCourseChapterNumber = (courseId) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT COUNT(*) FROM chapters WHERE course_id = ?';
        connnect_db_1.default.query(query, [courseId], (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result[0]['COUNT(*)']);
            }
        });
    });
};
exports.queryCourseChapterNumber = queryCourseChapterNumber;
// get number of enrolled students
const queryCourseEnrolledStudent = (courseId) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT COUNT(*) FROM enrolled WHERE course_id = ?';
        connnect_db_1.default.query(query, [courseId], (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result[0]['COUNT(*)']);
            }
        });
    });
};
exports.queryCourseEnrolledStudent = queryCourseEnrolledStudent;
// query to get courses user have enrolled for 
const queryEnrolledCourses = (userId, pagin, limit) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT course_id, payment_type, current_lesson_id, current_lesson_number, current_chapter_number, quiz_performance, enrolled_at, last_visited FROM enrolled WHERE user_id = ?  ORDER BY last_visited DESC LIMIT ? OFFSET ?';
        connnect_db_1.default.query(query, [userId, limit, pagin], (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result);
            }
            ;
        });
    });
};
exports.queryEnrolledCourses = queryEnrolledCourses;
const queryLessons = (courseId, chapterId) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT lesson_id, lesson_number, lesson_title, chapter_number, course_id,chapter_id FROM lessons WHERE  course_id = ? AND chapter_id = ?  ORDER BY lesson_number ASC';
        connnect_db_1.default.query(query, [courseId, chapterId], (err, result) => {
            if (err) {
                reject(err), '';
            }
            else {
                resolve(result);
            }
        });
    });
};
exports.queryLessons = queryLessons;
const queryLecture = (courseId, chapterNumber, lessonNumber) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT opening_note, closing_note, course_id, chapter_id, chapter_number, lesson_number, lesson_title, lesson_id, audio FROM lessons WHERE course_id = ? AND chapter_number = ? AND lesson_number = ?';
        connnect_db_1.default.query(query, [courseId, chapterNumber, lessonNumber], (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result[0]);
            }
        });
    });
};
exports.queryLecture = queryLecture;
// function to update users current lessons and current chapter
const updateCurrentLessonAndChapter = (userId, courseId, newChapter, newLesson, newLessonId) => {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE enrolled SET current_chapter_number = ?, current_lesson_number = ?, current_lesson_id = ? WHERE user_id = ? AND course_id = ?';
        connnect_db_1.default.query(query, [newChapter, newLesson, newLessonId, userId, courseId], (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result);
            }
        });
    });
};
exports.updateCurrentLessonAndChapter = updateCurrentLessonAndChapter;
const queryQuiz = (courseId, chapterId, lessonId) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT question_id, question, option_a, option_b, option_c, option_d, correct_option FROM questions WHERE course_id = ? AND chapter_id = ? AND lesson_id = ?';
        connnect_db_1.default.query(query, [courseId, chapterId, lessonId], (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result);
            }
        });
    });
};
exports.queryQuiz = queryQuiz;
// query lesson by lesson id 
const queryByLessonId = (courseId, chapterId, lessonId) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT lesson_id, lesson_number, lesson_title, chapter_number, course_id,chapter_id FROM lessons WHERE  course_id = ? AND chapter_id = ? AND lesson_id = ?';
        connnect_db_1.default.query(query, [courseId, chapterId, lessonId], (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result[0]);
            }
        });
    });
};
exports.queryByLessonId = queryByLessonId;
// update user enrolled to next lesson 
const updateUserEnrolledCurrentLessonAndChapter = (userId, courseId, nextChapterId, nextLessonId, nextchapterNumber, nextLessonNumber, quizPerfomace) => {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE enrolled SET current_chapter_number = ?, current_lesson_number = ?, current_lesson_id = ?, current_chapter_id = ?, quiz_performance = ? WHERE user_id = ? AND course_id = ?';
        connnect_db_1.default.query(query, [nextchapterNumber, nextLessonNumber, nextLessonId, nextChapterId, quizPerfomace, userId, courseId], (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result.affectedRows > 0);
            }
            ;
        });
    });
};
exports.updateUserEnrolledCurrentLessonAndChapter = updateUserEnrolledCurrentLessonAndChapter;
// query lesson by chapter and number
const queryLessonByChapterAndNUmber = (courseId, chapterNumber, lessonNumber) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT lesson_id, chapter_id FROM lessons WHERE  course_id = ? AND chapter_number = ? AND lesson_number = ?';
        connnect_db_1.default.query(query, [courseId, chapterNumber, lessonNumber], (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result[0]);
            }
        });
    });
};
exports.queryLessonByChapterAndNUmber = queryLessonByChapterAndNUmber;
//# sourceMappingURL=user-queries-2.js.map