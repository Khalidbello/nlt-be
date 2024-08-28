import pool from "../../modules/connnect-db";

const queryUserCountUnViewedNoti = (userId: number): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'SELECT COUNT(*) FROM notifications WHERE user_id = ? AND viewed = false';

        pool.query(query, [userId], (err, result: any) => {
            if (err) return reject(err);

            resolve(result[0]['COUNT(*)'])
        });
    });
};


// funcion to query usr notificaions and order it by data in latest to oldest
const queryUserNotifications = (userId: number, limit: number, pagin: number): Promise<any> => {
    return new Promise<any>((resolve, reject) => {
        const query = 'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?';

        pool.query(query, [userId, limit, pagin], (err, result: any) => {
            if (err) return reject(err);

            resolve(result);
        });
    });
};


// query to set all unviewed notification to viewd
const userQueryUpdateNoteToViewed = (userId: number) => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'UPDATE notifications SET viewed = true WHERE user_id = ? AND viewed = false ';
        pool.query(query, [userId], (err, result) => {
            if (err) return reject(err);

            resolve(true);
        });
    });
};


// query to add new notificatiion
const queryAddNewNotification = (userId: number, message: string, type: 'info' | 'success' | 'error'): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        const date = new Date();
        const query = 'INSERT INTO notifications (user_id, message, type, created_at, viewed) VALUES (?, ?, ?, ?, false)';

        pool.query(query, [userId, message, type, date], (err, result: any) => {
            if (err) return reject(err);

            resolve(result.affectedRows > 0);
        });
    });
};


export {
    queryUserCountUnViewedNoti,
    queryUserNotifications,
    userQueryUpdateNoteToViewed,
    queryAddNewNotification,
}