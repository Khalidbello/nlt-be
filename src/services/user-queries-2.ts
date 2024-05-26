
import pool from "../modules/connnect-db";
import { enrolledType } from "./user-queries";

//get course number of lesons
const queryCourseLessonNumber = (courseId: number): Promise<number> => {
    return new Promise<number>((resolve, reject) => {
        const query = 'SELECT COUNT(*) FROM lessons WHERE course_id = ?';

        pool.query(query, [courseId], (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result[0]['COUNT(*)'])
            }
        })
    })
}


// get course numbe rof chapters
const queryCourseChapterNumber = (courseId: number): Promise<number> => {
    return new Promise<number>((resolve, reject) => {
        const query = 'SELECT COUNT(*) FROM chapters WHERE course_id = ?';

        pool.query(query, [courseId], (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result[0]['COUNT(*)'])
            }
        })
    })
}

// get number of enrolled students
const queryCourseEnrolledStudent = (courseId: number): Promise<number> => {
    return new Promise<number>((resolve, reject) => {
        const query = 'SELECT COUNT(*) FROM enrolled WHERE course_id = ?';

        pool.query(query, [courseId], (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result[0]['COUNT(*)'])
            }
        })
    })
}


// query to get courses user have enrolled for 
const queryEnrolledCourses = (userId: number, pagin: number, limit: number): Promise<enrolledType[]> => {
    return new Promise<enrolledType[]>((resolve, reject) => {
        const query = 'SELECT course_id, payment_type, current_lesson_id, current_lesson_number, current_chapter_number, quiz_performance, enrolled_at, last_visited FROM enrolled WHERE user_id = ?  ORDER BY last_visited DESC LIMIT ? OFFSET ?';
        pool.query(query, [userId, limit, pagin], (err, result) => {
            if (err) {
                reject(err)
            } else {
                console.log('user enrolled courses query', result);
                resolve(result);
            }
        })
    })
}

interface queryLessonsType {
    lesson_id: number;
    lesson_number: number;
    lesson_title: string;
    chapter_number: number;
    course_id: number;
    chapter_id: number;
}

const queryLessons = (courseId: number, chapterId: number): Promise<queryLessonsType[]> => {
    return new Promise<queryLessonsType[]>((resolve, reject) => {
        const query = 'SELECT lesson_id, lesson_number, lesson_title, chapter_number, course_id,chapter_id FROM lessons WHERE  course_id = ? AND chapter_id = ?  ORDER BY lesson_number ASC';

        pool.query(query, [courseId, chapterId], (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result);
            }
        })
    })
}


interface lectureType {
    open_note: string;
    close_note: string;
    chapter_number: number;
    lesson_number: number;
    lesson_title: string;
    course_id: number;
    chapter_id: number;
    lesson_id: number;
    audio: Blob;
}

const queryLecture = (courseId: number, chapterNumber: number, lessonNumber: number): Promise<lectureType> => {
    return new Promise<lectureType>((resolve, reject) => {
        const query = 'SELECT open_note, close_note, course_id, chapter_id, chapter_number, lesson_number, lesson_title, lesson_id, audio FROM lessons WHERE course_id = ? AND chapter_number = ? AND lesson_number = ?';

        pool.query(query, [courseId, chapterNumber, lessonNumber], (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result[0]);
            }
        })
    })
}


// function to update users current lessons and current chapter
const updateCurrentLessonAndChapter = (userId: number, courseId: number, newChapter: number, newLesson: number, newLessonId: number): Promise<[]> => {
    return new Promise<[]>((resolve, reject) => {
        const query = 'UPDATE enrolled SET current_chapter_number = ?, current_lesson_number = ?, current_lesson_id = ? WHERE user_id = ? AND course_id = ?';


        pool.query(query, [newChapter, newLesson, newLessonId, userId, courseId], (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result);
            }
        })
    })
}

interface queryQuizType {
    question_id: string;
    question: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    correct_option: string;
}

const queryQuiz = (courseId: number, chapterId: number, lessonId: number): Promise<queryQuizType[]> => {
    return new Promise<queryQuizType[]>((resolve, reject) => {
        const query = 'SELECT question_id, question, option_a, option_b, option_c, option_d, correct_option FROM questions WHERE course_id = ? AND chapter_id = ? AND lesson_id = ?';

        pool.query(query, [courseId, chapterId, lessonId], (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result);
            }
        })
    })
}


// query lesson by lesson id 
const queryByLessonId = (courseId: number, chapterId: number, lessonId: number): Promise<queryLessonsType> => {
    return new Promise<queryLessonsType>((resolve, reject) => {
        const query = 'SELECT lesson_id, lesson_number, lesson_title, chapter_number, course_id,chapter_id FROM lessons WHERE  course_id = ? AND chapter_id = ? AND lesson_id = ?';

        pool.query(query, [courseId, chapterId, lessonId], (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result[0]);
            }
        })
    })
}


// update user enrolled to next lesson 
const updateUserEnrolledCurrentLessonAndChapter = (
    userId: number, courseId: number, nextChapterId: number, nextLessonId: number, nextchapterNumber: number, nextLessonNumber: number, quizPerfomace: number
): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'UPDATE enrolled SET current_chapter_number = ?, current_lesson_number = ?, current_lesson_id = ?, current_chapter_id = ?, quiz_performance = ? WHERE user_id = ? AND course_id = ?';

        pool.query(query, [nextchapterNumber, nextLessonNumber, nextLessonId, nextChapterId, quizPerfomace, userId, courseId], (err, result) => {
            if (err) {
                reject(err)
            } else {
                console.log('in updateUserEnrolledCurrentLessonAndChapter', result);
                resolve(result.affectedRows > 0);
            }
        })
    })
}


interface queryLessonByChapterAndNUmberType {
    chapter_id: number;
    lesson_id: number;
}

// query lesson by chapter and number
const queryLessonByChapterAndNUmber = (courseId: number, chapterNumber: number, lessonNumber: number): Promise<queryLessonByChapterAndNUmberType> => {
    return new Promise<queryLessonByChapterAndNUmberType>((resolve, reject) => {
        const query = 'SELECT lesson_id, chapter_id FROM lessons WHERE  course_id = ? AND chapter_number = ? AND lesson_number = ?';

        pool.query(query, [courseId, chapterNumber, lessonNumber], (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result[0]);
            }
        })
    })
}


export {
    queryCourseLessonNumber,
    queryCourseChapterNumber,
    queryCourseEnrolledStudent,
    queryEnrolledCourses,
    queryLessons,
    queryLecture,
    updateCurrentLessonAndChapter,
    queryQuiz,
    queryByLessonId,
    updateUserEnrolledCurrentLessonAndChapter,
    queryLessonByChapterAndNUmber,
}

export type {
    lectureType,
    queryQuizType,
}