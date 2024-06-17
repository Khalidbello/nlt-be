import pool from "../../modules/connnect-db";

const queryAdminDeleteCourse = (courseId: number): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'DELETE FROM courses WHERE course_id = ?';

        pool.query(query, [courseId], (err, result) => {
            if (err) return reject(err);

            resolve(result.affectedRows > 0);
        });
    });
};


// funcion to delete all chapters of a course
const queryAdminDelChapterByCourseId = (courseId: number): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'DELETE FROM chapters WHERE course_id = ?';

        pool.query(query, [courseId], (err, result) => {
            if (err) return reject(err);

            resolve(result.affectedRows > 0);
        });
    });
};


// function to delete all lessons of a course
const queryAdminDeleteLessonByCourseId = (courseId: number): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'DELETE FROM lessons WHERE course_id = ?';

        pool.query(query, [courseId], (err, result) => {
            if (err) return reject(err);

            resolve(result.affectedRows > 0);
        });
    });
};


// function to delete all enrolled uses in course
const queryAdminDelEnrolledDatas = (courseId: number): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'DELETE FROM enrolled WHERE course_id = ?';

        pool.query(query, [courseId], (err, result) => {
            if (err) return reject(err);

            resolve(result.affectedRows > 0);
        });
    });
};


// function to delete hapter by id
const queryAdminDeleteChapterById = (chapterId: number): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'DELETE FROM chapters WHERE chapter_id = ?';

        pool.query(query, [chapterId], (err, result) => {
            if (err) return reject(err);

            resolve(result.affectedRows > 0);
        });
    });
};


// funciton to delete lessons by id
const queryAdminDeleteLessonByChapterId = (chapterId: number): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'DELETE FROM lessons WHERE chapter_id = ?';

        pool.query(query, [chapterId], (err, result) => {
            if (err) return reject(err);

            resolve(result.affectedRows > 0);
        });
    });
};


export {
    queryAdminDeleteCourse,
    queryAdminDelChapterByCourseId,
    queryAdminDeleteLessonByCourseId,
    queryAdminDelEnrolledDatas,
    queryAdminDeleteChapterById,
    queryAdminDeleteLessonByChapterId,
}