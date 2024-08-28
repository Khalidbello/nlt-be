import pool from "../../modules/connnect-db";

// query to set user course completion
const queryCourseCompletion = (userId: number, courseId: number): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'UPDATE enrolled SET completed = true WHERE user_id = ? AND course_id = ?';

        pool.query(query, [userId, courseId], (err, result: any) => {
            if (err) return reject(err);

            resolve(result.affectedRows > 0);
        });
    });
};


export {
    queryCourseCompletion,
}