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


const queryNewEnrollment = (userId: number, courseId: number, payment: 'free' | 'half' | 'full', chapterId: number, lessonId: number) => {
    return new Promise((resolve, reject) => {
        const nowDate = new Date();
        const stringDate = nowDate.toISOString();

        const query = `INSERT INTO enrolled (user_id, course_id, payment_type, enrolled_at, last_visited, current_lesson_id, current_chapter_id, current_lesson_number, current_chapter_number, quiz_performance) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        pool.query(query, [userId, courseId, payment, stringDate, stringDate, chapterId, lessonId, 1, 1, 100], (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
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
}

export type {
    queryUserProfileType,
}