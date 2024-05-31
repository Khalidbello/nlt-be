import pool from "../modules/connnect-db";

interface queryUserProfileType {
    user_id: number;
    email: string;
    first_name: string;
    last_name: string;
    joined: string;
    phone_number: string;
    password: string;
    gender: string;
    recent_course_id: number;
    recent_course_date: string;
}

const queryUserProfile = (userId: number): Promise<queryUserProfileType> => {
    return new Promise<queryUserProfileType>((resolve, reject) => {
        const query = 'SELECT * FROM users WHERE user_id = ?';

        pool.query(query, [userId], (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result[0])
            }
        })
    })
}


const queryNewEnrollment = (userId: number, courseId: number, payment: 'free' | 'half' | 'full', chapterId: number, lessonId: number): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        const nowDate = new Date();
        const stringDate = nowDate.toISOString();

        const query = `INSERT INTO enrolled (user_id, course_id, payment_type, enrolled_at, last_visited, current_lesson_id, current_chapter_id, current_lesson_number, current_chapter_number, quiz_performance) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        pool.query(query, [userId, courseId, payment, stringDate, stringDate, chapterId, lessonId, 1, 1, 100], (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result.affectedRows > 0)
            }
        })
    })
}


// query to update course enrollment payment type
const updateEnrollmentPaymentType = (userId: number, courseId: number, payment: 'half' | 'full') => {
    return new Promise<boolean>((resolve, reject) => {
        const nowDate = new Date();
        const stringDate = nowDate.toISOString();

        const query = `UPDATE enrolled SET payment_type = ? WHERE user_id = ? AND course_id = ?`;

        pool.query(query, [payment, userId, courseId], (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result.affectedRows > 0)
            }
        })
    })
}


// query to update users recent course
const updateRecentCourse = (userId: number, courseId: number): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'UPDATE users SET recent_course_id = ?, recent_course_date = ? WHERE user_id = ?';
        const date = new Date();
        const dateString = date.toISOString();

        console.log('in update recent', userId, courseId)
        pool.query(query, [courseId, dateString, userId], (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}

export {
    queryUserProfile,
    queryNewEnrollment,
    updateRecentCourse,
    updateEnrollmentPaymentType,
}

export type {
    queryUserProfileType,
}