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


export {
    queryGetReviews,
};