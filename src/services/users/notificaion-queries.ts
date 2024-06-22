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


// funcion to query usr notificaions and order it by data in latest to oldest
const queryUserNotifications = (userId: number, limit: number, pagin: number): Promise<any> => {
    return new Promise<any>((resolve, reject) => {
        const query = 'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?';

        pool.query(query, [userId, limit, pagin], (err, result) => {
            if (err) return reject(err);

            resolve(result);
        });
    });
};


export {
    queryUserCountUnViewedNoti,
    queryUserNotifications,
}