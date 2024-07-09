import pool from "../../modules/connnect-db";

const queryGetReviews = (pagin: number, limit: number) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM reviews LIMIT ? OFFSET ?';

        pool.query(query, [limit, pagin], (err, result) => {
            if (err) return reject(err);

            resolve(result);
        });
    });
};


// query to save new review
const querySaveReview = (userId: number, courseName: string, review: string, name: string) => {
    return new Promise<boolean>((resolve, reject) => {
        const date = new Date();
        const query = 'INSERT INTO reviews (user_id, name, course_name, review, created_at) VALUES (?, ?, ?, ?, ?)';

        pool.query(query, [userId, name, courseName, review, date], (err, result) => {
            if (err) return reject(err);

            resolve(result.affectedRows > 0);
        });
    });
};


//query to udate user enrolled reviewed to true
const queryUpdateUserReviewed = (courseId: number, userId: number) => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'UPDATE enrolled SET reviewed = ? WHERE user_id = ? AND course_id = ?';

        pool.query(query, [true, userId, courseId], (err, result) => {
            if (err) return reject(err);

            resolve(result.affectedRows > 0);
        });
    });
};


export {
    queryGetReviews,
    querySaveReview,
    queryUpdateUserReviewed,
};