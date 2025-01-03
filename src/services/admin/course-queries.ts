import pool from "../../modules/connnect-db";
import { courseType } from "../users/user-queries";

const queryCreateNewCourse = (imageBuffer: any, courseName: string, title: string, aboutCourse: string, price: number, discount: number) => {
    return new Promise<any>((resolve, reject) => {
        const query = 'INSERT INTO courses (image, course_name, course_title, course_description, price, full_price_discount, created_at, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const date = new Date();

        pool.query(query, [imageBuffer, courseName, title, aboutCourse, price, discount, date, 'deactivated'], (err, result) => {
            if (err) return reject(err);

            resolve(result);
        })
    })
};


// query to get recomended courses for for admin
const queryAdminCourses = (pagin: number, limit: number): Promise<courseType[]> => {
    return new Promise<courseType[]>((resolve, reject) => {
        const query = 'SELECT course_id, image, course_name, course_title, course_description, created_at, status FROM courses ORDER BY created_at DESC LIMIT  ? OFFSET  ?';

        pool.query(query, [limit, pagin], (err, result: any) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};


// query to update course data 
const queryUpdateCourse = (courseId: number, imageBuffer: Buffer, courseName: string, title: string, aboutCourse: string, price: number, discount: number): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'UPDATE courses SET image = ?, course_name = ?, course_title = ?, course_description = ?, price = ?, full_price_discount = ? WHERE course_id = ? ';

        pool.query(query, [imageBuffer, courseName, title, aboutCourse, price, discount, courseId], (err, result: any) => {
            if (err) return reject(err);

            resolve(result.affectedRows > 0)
        })
    })
};


// query to create a new chapter
const queryCreteChapter = (courseId: number, chaptertitle: string, chapterNum: number): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'INSERT INTO chapters (course_id, chapter_title, chapter_number) VALUES (?, ?, ?)';

        pool.query(query, [courseId, chaptertitle, chapterNum], (err, result: any) => {
            if (err) return reject(err);

            resolve(result.affectedRows > 0);
        })
    })
}

// query t check if chapter exists
const queryChapterExist = (courseId: number, chapterNum: number): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'SELECT chapter_id FROM chapters WHERE course_id = ? AND chapter_number =  ?';

        pool.query(query, [courseId, chapterNum], (err, result: any) => {
            if (err) return reject(err);

            resolve(result.length > 0);
        })
    })
};


interface queryChapterType {
    chapter_id: number;
    course_id: number;
    chapter_title: string;
    chapter_number: number
};

// query to get course data
const queryChapter = (courseId: number, chapterId: number): Promise<queryChapterType> => {
    return new Promise<queryChapterType>((resolve, reject) => {
        const query = 'SELECT chapter_id, course_id, chapter_title, chapter_number FROM chapters WHERE course_id = ? AND chapter_id = ?';

        pool.query(query, [courseId, chapterId], (err, result: any) => {
            if (err) return reject(err);

            resolve(result[0]);
        });
    });
};


// query to update chapter
const queryUpdateChapter = (courseId: number, chapterId: number, chapterNumber: number, chapterTitle: string): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'UPDATE chapters SET chapter_title = ?, chapter_number = ? WHERE course_id = ? AND chapter_id = ?';

        pool.query(query, [chapterTitle, chapterNumber, courseId, chapterId], (err, result: any) => {
            if (err) return reject(err);

            resolve(result.affectedRows > 0);
        });
    });
};

// query to update lessons under a specific chapter when the chapter is updated
const queryLessonChapNumUpdate = (courseId: number, chapterId: number, chapterNumber: number): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'UPDATE lessons SET chapter_number = ? WHERE course_id = ? AND chapter_id = ?';

        pool.query(query, [chapterNumber, courseId, chapterId], (err, result: any) => {
            if (err) return reject(err);

            resolve(result.affectedRows > 0);
        });
    });
};

// query to check if lecture exist
const queryAdminLectureExist = (courseId: number, chapterId: number, lessonNumber: number): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'SELECT lesson_id FROM lessons WHERE course_id = ? AND chapter_id = ? AND lesson_number = ?';

        pool.query(query, [courseId, chapterId, lessonNumber], (err, result: any) => {
            if (err) return reject(err);

            resolve(result.length > 0);
        });
    });
};

// query to created new lesson
const queryAdminCreateLesson = (courseId: number, chapterId: number, chapterNumber: number, lessonNumber: number, lessonTitle: string, openingNote: string, closingNote: string, audio: Buffer) => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'INSERT INTO lessons (course_id, chapter_id, chapter_number, lesson_number, lesson_title, opening_note, closing_note, audio) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

        pool.query(query, [courseId, chapterId, chapterNumber, lessonNumber, lessonTitle, openingNote, closingNote, audio], (err, result: any) => {
            if (err) return reject(err);

            resolve(result.affectedRows > 0);
        });
    });
};

// cquery to update lesson
const queryAdminLectureUpdate = (courseId: number, chapterId: number, lessonId: number, lessonNumber: number, lessonTitle: string, openingNote: string, closingNote: string, audio: Buffer) => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'UPDATE lessons SET lesson_number = ?, lesson_title = ?, opening_note = ?, closing_note = ?, audio = ? WHERE course_id = ? AND chapter_id = ? AND lesson_id = ?';

        pool.query(query, [lessonNumber, lessonTitle, openingNote, closingNote, audio, courseId, chapterId, lessonId], (err, result: any) => {
            if (err) return reject(err);

            resolve(result.affectedRows > 0);
        });
    });
};


interface lectureType {
    opening_note: string;
    closing_note: string;
    chapter_number: number;
    lesson_number: number;
    lesson_title: string;
    course_id: number;
    chapter_id: number;
    lesson_id: number;
    audio: Blob;
}

const queryAdminLecture = (courseId: number, chapterId: number, lessonId: number): Promise<lectureType> => {
    return new Promise<lectureType>((resolve, reject) => {
        const query = 'SELECT opening_note, closing_note, course_id, chapter_id, chapter_number, lesson_number, lesson_title, lesson_id, audio FROM lessons WHERE course_id = ? AND chapter_id = ? AND lesson_id = ?';

        pool.query(query, [courseId, chapterId, lessonId], (err, result: any) => {
            if (err) {
                reject(err)
            } else {
                resolve(result[0]);
            };
        });
    });
};


const queryUpdateCourseStatus = (courseId: number, status: string) => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'UPDATE courses SET status = ? WHERE course_id = ?';

        pool.query(query, [status, courseId], (err, result: any) => {
            if (err) return reject(err);

            console.log('status update result', result);
            resolve(result.affectedRows > 0);
        });
    });
};


export {
    queryCreateNewCourse,
    queryUpdateCourse,
    queryCreteChapter,
    queryAdminCourses,
    queryChapterExist,
    queryChapter,
    queryUpdateChapter,
    queryAdminLectureExist,
    queryAdminCreateLesson,
    queryAdminLecture,
    queryAdminLectureUpdate,
    queryLessonChapNumUpdate,
    queryUpdateCourseStatus,
}