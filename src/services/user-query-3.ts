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
        const date = new Date();

        const query = `INSERT INTO enrolled (user_id, course_id, payment_type, enrolled_at, last_visited, current_lesson_id, current_chapter_id, current_lesson_number, current_chapter_number, quiz_performance) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        pool.query(query, [userId, courseId, payment, date, date, lessonId, chapterId, 1, 1, 100], (err, result) => {
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
const updateLastVisited = (userId: number, courseId: number): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'UPDATE enrolled SET last_visited = ? WHERE user_id = ? and course_id = ?';
        const date = new Date();


        console.log('in update recent', userId, courseId)
        pool.query(query, [date, userId, courseId], (err, result) => {
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
    updateLastVisited,
    updateEnrollmentPaymentType,
}

export type {
    queryUserProfileType,
}