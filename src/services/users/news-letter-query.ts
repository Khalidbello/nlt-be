import pool from "../../modules/connnect-db";

const queryAddEmailToNewsLetter = (email: string) => {
    return new Promise((resolve, reject) => {
        const date = new Date();
        const query = 'INSERT INTO news_letter (email, created_at) VALUES (?, ?)';

        pool.query(query, [email, date], (err, result) => {
            if (err) return reject(err);

            resolve(result);
        });
    });
};


export {
    queryAddEmailToNewsLetter
};