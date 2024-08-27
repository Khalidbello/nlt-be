"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryUpdateCourseStatus = exports.queryLessonChapNumUpdate = exports.queryAdminLectureUpdate = exports.queryAdminLecture = exports.queryAdminCreateLesson = exports.queryAdminLectureExist = exports.queryUpdateChapter = exports.queryChapter = exports.queryChapterExist = exports.queryAdminCourses = exports.queryCreteChapter = exports.queryUpdateCourse = exports.queryCreateNewCourse = void 0;
const connnect_db_1 = __importDefault(require("../../modules/connnect-db"));
const queryCreateNewCourse = (imageBuffer, courseName, title, aboutCourse, price, discount) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO courses (image, course_name, course_title, course_description, price, full_price_discount, created_at, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const date = new Date();
        connnect_db_1.default.query(query, [imageBuffer, courseName, title, aboutCourse, price, discount, date, 'deactivated'], (err, result) => {
            if (err)
                return reject(err);
            resolve(result);
        });
    });
};
exports.queryCreateNewCourse = queryCreateNewCourse;
// query to get recomended courses for for admin
const queryAdminCourses = (pagin, limit) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT course_id, image, course_name, course_title, course_description, created_at, status FROM courses ORDER BY created_at DESC LIMIT  ? OFFSET  ?';
        connnect_db_1.default.query(query, [limit, pagin], (err, result) => {
            if (err)
                return reject(err);
            resolve(result);
        });
    });
};
exports.queryAdminCourses = queryAdminCourses;
// query to update course data 
const queryUpdateCourse = (courseId, imageBuffer, courseName, title, aboutCourse, price, discount) => {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE courses SET image = ?, course_name = ?, course_title = ?, course_description = ?, price = ?, full_price_discount = ? WHERE course_id = ? ';
        connnect_db_1.default.query(query, [imageBuffer, courseName, title, aboutCourse, price, discount, courseId], (err, result) => {
            if (err)
                return reject(err);
            resolve(result.affectedRows > 0);
        });
    });
};
exports.queryUpdateCourse = queryUpdateCourse;
// query to create a new chapter
const queryCreteChapter = (courseId, chaptertitle, chapterNum) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO chapters (course_id, chapter_title, chapter_number) VALUES (?, ?, ?)';
        connnect_db_1.default.query(query, [courseId, chaptertitle, chapterNum], (err, result) => {
            if (err)
                return reject(err);
            resolve(result.affectedRows > 0);
        });
    });
};
exports.queryCreteChapter = queryCreteChapter;
// query t check if chapter exists
const queryChapterExist = (courseId, chapterNum) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT chapter_id FROM chapters WHERE course_id = ? AND chapter_number =  ?';
        connnect_db_1.default.query(query, [courseId, chapterNum], (err, result) => {
            if (err)
                return reject(err);
            resolve(result.length > 0);
        });
    });
};
exports.queryChapterExist = queryChapterExist;
;
// query to get course data
const queryChapter = (courseId, chapterId) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT chapter_id, course_id, chapter_title, chapter_number FROM chapters WHERE course_id = ? AND chapter_id = ?';
        connnect_db_1.default.query(query, [courseId, chapterId], (err, result) => {
            if (err)
                return reject(err);
            resolve(result[0]);
        });
    });
};
exports.queryChapter = queryChapter;
// query to update chapter
const queryUpdateChapter = (courseId, chapterId, chapterNumber, chapterTitle) => {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE chapters SET chapter_title = ?, chapter_number = ? WHERE course_id = ? AND chapter_id = ?';
        connnect_db_1.default.query(query, [chapterTitle, chapterNumber, courseId, chapterId], (err, result) => {
            if (err)
                return reject(err);
            resolve(result.affectedRows > 0);
        });
    });
};
exports.queryUpdateChapter = queryUpdateChapter;
// query to update lessons under a specific chapter when the chapter is updated
const queryLessonChapNumUpdate = (courseId, chapterId, chapterNumber) => {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE lessons SET chapter_number = ? WHERE course_id = ? AND chapter_id = ?';
        connnect_db_1.default.query(query, [chapterNumber, courseId, chapterId], (err, result) => {
            if (err)
                return reject(err);
            resolve(result.affectedRows > 0);
        });
    });
};
exports.queryLessonChapNumUpdate = queryLessonChapNumUpdate;
// query to check if lecture exist
const queryAdminLectureExist = (courseId, chapterId, lessonNumber) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT lesson_id FROM lessons WHERE course_id = ? AND chapter_id = ? AND lesson_number = ?';
        connnect_db_1.default.query(query, [courseId, chapterId, lessonNumber], (err, result) => {
            if (err)
                return reject(err);
            resolve(result.length > 0);
        });
    });
};
exports.queryAdminLectureExist = queryAdminLectureExist;
// query to created new lesson
const queryAdminCreateLesson = (courseId, chapterId, chapterNumber, lessonNumber, lessonTitle, openingNote, closingNote, audio) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO lessons (course_id, chapter_id, chapter_number, lesson_number, lesson_title, opening_note, closing_note, audio) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        connnect_db_1.default.query(query, [courseId, chapterId, chapterNumber, lessonNumber, lessonTitle, openingNote, closingNote, audio], (err, result) => {
            if (err)
                return reject(err);
            resolve(result.affectedRows > 0);
        });
    });
};
exports.queryAdminCreateLesson = queryAdminCreateLesson;
// cquery to update lesson
const queryAdminLectureUpdate = (courseId, chapterId, lessonId, lessonNumber, lessonTitle, openingNote, closingNote, audio) => {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE lessons SET lesson_number = ?, lesson_title = ?, opening_note = ?, closing_note = ?, audio = ? WHERE course_id = ? AND chapter_id = ? AND lesson_id = ?';
        connnect_db_1.default.query(query, [lessonNumber, lessonTitle, openingNote, closingNote, audio, courseId, chapterId, lessonId], (err, result) => {
            if (err)
                return reject(err);
            resolve(result.affectedRows > 0);
        });
    });
};
exports.queryAdminLectureUpdate = queryAdminLectureUpdate;
const queryAdminLecture = (courseId, chapterId, lessonId) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT opening_note, closing_note, course_id, chapter_id, chapter_number, lesson_number, lesson_title, lesson_id, audio FROM lessons WHERE course_id = ? AND chapter_id = ? AND lesson_id = ?';
        connnect_db_1.default.query(query, [courseId, chapterId, lessonId], (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result[0]);
            }
            ;
        });
    });
};
exports.queryAdminLecture = queryAdminLecture;
const queryUpdateCourseStatus = (courseId, status) => {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE courses SET status = ? WHERE course_id = ?';
        connnect_db_1.default.query(query, [status, courseId], (err, result) => {
            if (err)
                return reject(err);
            resolve(result.affectedRows > 0);
        });
    });
};
exports.queryUpdateCourseStatus = queryUpdateCourseStatus;
//# sourceMappingURL=course-queries.js.map