import pool from "../modules/connnect-db";

interface queryUserProfileType {

}

const queryUserProfile = () => {
    return new Promise((resolve, reject) => {
        const query = '';

        pool.query(query, [], (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result[0])
            }
        })
    })
}


const queryNewEnrollment = (userId: number, courseId: number, payment: 'free' | 'half' | 'full') => {
    return new Promise((resolve, reject) => {
        const nowDate = new Date();
        const stringDate = nowDate.toISOString();

        const query = `INSERT INTO enrolled (user_id, course_id, payment_type, enrolled_at, last_visited, current_lesson_id, current_chapter_id, current_lesson_number, current_chapter_number, quiz_performance) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        pool.query(query, [userId, courseId, payment, stringDate, stringDate, 0, 0, 0, 0, 0], (err, result) => {
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
    queryNewEnrollment
}

export type { queryUserProfileType }