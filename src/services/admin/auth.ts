import pool from "../../modules/connnect-db";

// query ti fetch admin by id
const queryAdminByEmail = (email: string) => {
    return new Promise<any>((resolve, reject) => {
        const query = 'SELECT * FROM admins WHERE email = ?';

        pool.query(query, [email], (err, result) => {
            if (err) return reject(err);

            resolve(result[0]);
        })
    });
};


export {
    queryAdminByEmail,
}