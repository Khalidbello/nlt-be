import pool from '../modules/connnect-db';
import { checkUserExistType } from '../types/general';
import {
    queryCourseLessonNumber,
    queryCourseChapterNumber,
    queryCourseEnrolledStudent,
    queryEnrolledCourses,
    queryLessons,
    queryLecture,
    updateCurrentLessonAndChapter,
    lectureType,
    queryQuiz,
    queryQuizType,
    queryByLessonId,
    updateUserEnrolledCurrentLessonAndChapter,
    queryLessonByChapterAndNUmber,
} from './user-queries-2'; //  all this import are re-exported from this file

import {
    queryNewEnrollment,
    updateRecentCourse,
} from './user-query-3';

// function to check if user exists
const checkUserExist = async (email: string | undefined): Promise<[checkUserExistType]> => {
    return new Promise<[checkUserExistType]>((resolve, reject) => {
        // Use parameterized query to prevent SQL injection
        const query = 'SELECT user_id, password, first_name, last_name FROM users WHERE email = ?';

        pool.query(query, [email], (err, result) => {
            if (err) {
                console.error('An error occurred in checkUserExist:', err);
                reject(err); // Reject the promise with the error
            } else {
                resolve(result); // Resolve the promise with the boolean result
            }
        });
    });
};


// function to create new user
const createNewUser = async (firstName: string, lastName: string, email: string, password: string, phoneNumber: string, gender: string, joined: string): Promise<[]> => {
    return new Promise<[]>((resolve, reject) => {
        const query = 'INSERT INTO users (first_name, last_name, email, password, phone_number, gender, joined) VALUES (?, ?, ?, ?, ?, ?, ?)';

        pool.query(query, [firstName, lastName, email, password, phoneNumber, gender, joined], (err, result) => {
            if (err) {
                console.log('an eror occured in create User', err);
                reject(err);
            } else {
                resolve(result);
            }
        })
    });
};

// query to fetch a specifc course data
const queryCourse = async (courseId: number): Promise<courseType> => {
    return new Promise<courseType>((resolve, reject) => {
        const query = 'SELECT course_name, course_id, course_title, course_description, created_at, price FROM courses WHERE course_id = ?';

        pool.query(query, [courseId], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result[0]);
            }
        })
    })
}

// query user to get recent course and date
const queryRecentcourse = async (userId: number): Promise<recentType> => {
    return new Promise<recentType>((resolve, reject) => {
        const query = 'SELECT recent_course_id, recent_course_date FROM users WHERE user_id = ?';

        pool.query(query, [userId], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result[0]);
            }
        })
    })
}


// query to get all chapters of a course
const getChapters = (courseId: number): Promise<chaptersType[]> => {
    return new Promise<chaptersType[]>((resolve, reject) => {
        const query = 'SELECT chapter_id, chapter_title, chapter_number FROM chapters WHERE course_id = ? ORDER BY chapter_number ASC';

        pool.query(query, [courseId], (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}

// query length of lessons in a chapter
const querychapterLessonNumber = (chapterId: number): Promise<number> => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT COUNT(*) FROM lessons  WHERE chapter_id = ?'

        pool.query(query, [chapterId], (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result[0]['COUNT(*)'])
            }
        })
    })
}


// query enrolled to get wherre user stopped in their study
const queryEnrolled = (userId: number, courseId: number): Promise<enrolledType> => {
    return new Promise<enrolledType>((resolve, reject) => {
        const query = 'SELECT payment_type, current_lesson_id, current_chapter_id, current_lesson_number, current_chapter_number, quiz_performance, enrolled_at, last_visited FROM enrolled WHERE user_id = ? AND course_id = ?';

        pool.query(query, [userId, courseId], (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result[0])
            }
        })
    })
}


// query to get recomended courses for user
const queryCourses = (pagin: number, limit: number): Promise<courseType[]> => {
    return new Promise<courseType[]>((resolve, reject) => {
        const query = 'SELECT course_id, course_name, course_title, course_description, created_at FROM courses ORDER BY created_at DESC LIMIT  ? OFFSET  ?';

        pool.query(query, [limit, pagin], (err, result) => {
            if (err) {
                reject(err)
            } else {
                console.log('in  count query', result);
                resolve(result)
            }
        })
    })
}


// types defination
interface courseType {
    course_name: string;
    course_title: string;
    course_description: string;
    created_at: string;
    course_id: number;
    price: number;
}

interface recentType {
    recent_course_id: number;
    recent_course_date: string;
    user_id: number;
}

interface chaptersType {
    chapter_id: number;
    chapter_title: string;
    chapter_number: number;
    completed: 'finished' | 'ongoing' | 'pending'; // this value woud be assigned in calcprogress
}

interface enrolledType {
    course_id: number;
    payment_type: string;
    current_lesson_id: number;
    current_chapter_id: number;
    current_chapter_number: number;
    current_lesson_number: number;
    quiz_performance: number;
    enrolled_at: string;
    last_visited: string;
}

export {
    checkUserExist,
    createNewUser,
    queryRecentcourse,
    getChapters,
    querychapterLessonNumber,
    queryEnrolled,
    queryCourse,
    queryCourses,
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
    queryNewEnrollment,
    updateRecentCourse
}

export type {
    courseType,
    recentType,
    chaptersType,
    enrolledType,
    lectureType,
    queryQuizType,
}