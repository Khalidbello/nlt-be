import pool from "../../modules/connnect-db";

const queryUserCountUnViewedNoti = (userId: number): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'SELECT COUNT(*) FROM notifications WHERE user_id = ? AND viewed = false';

        pool.query(query, [userId], (err, result) => {
            if (err) return reject(err);

            resolve(result[0]['COUNT(*)'])
        });
    });
};


export {
    queryUserCountUnViewedNoti,
}