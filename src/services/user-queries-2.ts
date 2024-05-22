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

export {
    queryCourseLessonNumber,
    queryCourseChapterNumber,
    queryCourseEnrolledStudent,
    queryEnrolledCourses
}