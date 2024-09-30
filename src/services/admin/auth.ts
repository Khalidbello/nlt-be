import pool from "../../modules/connnect-db";

// query ti fetch admin by id
const queryAdminByEmail = (email: string) => {
    console.log('Email in admin query', email);
    return new Promise<any>((resolve, reject) => {
        const query = 'SELECT * FROM admins WHERE email = ?';

        pool.query(query, [email.trim()], (err, result) => {
            if (err) return reject(err);
            console.log('admin login query result', result);
            resolve(result);
        })
    });
};


export {
    queryAdminByEmail,
}