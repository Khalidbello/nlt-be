import pool from "../modules/connnect-db";

const queryDeleteOtp = (userId: number): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'DELETE FROM otp WHERE user_id = ?';

        pool.query(query, [userId], (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result.affectedRows > 0);
            }
        })
    })
}

const querySaveOtp = async (userId: number, otp: number): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        const date = new Date();
        const query = 'INSERT INTO otp (user_id, otp, date) VALUES (?, ?, ?)';

        pool.query(query, [userId, otp, date], (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result.affectedRows > 0);
            }
        })
    })
}


interface queryOtpType {
    user_id: number;
    otp: number;
    date: Date
}

const queryOtp = async (userId: number): Promise<queryOtpType> => {
    return new Promise<queryOtpType>((resolve, reject) => {
        const query = 'SELECT user_id, otp, date FROM otp WHERE user_id = ?'

        pool.query(query, [userId], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result[0])
            }
        })
    })
}


export {
    queryDeleteOtp,
    querySaveOtp,
    queryOtp,
}