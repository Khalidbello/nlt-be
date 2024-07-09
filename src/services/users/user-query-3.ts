import pool from "../../modules/connnect-db";

interface queryUserProfileType {
    user_id: number;
    email: string;
    first_name: string;
    last_name: string;
    joined: string;
    phone_number: string;
    password: string;
    gender: string;
    recent_course_id: number;
    recent_course_date: string;
    email_verified: boolean;
}

const queryUserProfile = (userId: number): Promise<queryUserProfileType> => {
    return new Promise<queryUserProfileType>((resolve, reject) => {
        const query = 'SELECT * FROM users WHERE user_id = ?';

        pool.query(query, [userId], (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result[0])
            }
        })
    })
}


const queryNewEnrollment = (userId: number, courseId: number, payment: 'free' | 'half' | 'full', chapterId: number, lessonId: number): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        const date = new Date();

        const query = `INSERT INTO enrolled (user_id, course_id, payment_type, enrolled_at, last_visited, current_lesson_id, current_chapter_id, current_lesson_number, current_chapter_number, quiz_performance) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        pool.query(query, [userId, courseId, payment, date, date, lessonId, chapterId, 1, 1, 100], (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result.affectedRows > 0)
            }
        })
    })
}


// query to update course enrollment payment type
const updateEnrollmentPaymentType = (userId: number, courseId: number, payment: 'half' | 'full') => {
    return new Promise<boolean>((resolve, reject) => {
        const nowDate = new Date();
        const stringDate = nowDate.toISOString();

        const query = `UPDATE enrolled SET payment_type = ? WHERE user_id = ? AND course_id = ?`;

        pool.query(query, [payment, userId, courseId], (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result.affectedRows > 0)
            }
        })
    })
}


// query to update users recent course
const updateLastVisited = (userId: number, courseId: number): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'UPDATE enrolled SET last_visited = ? WHERE user_id = ? and course_id = ?';
        const date = new Date();

        pool.query(query, [date, userId, courseId], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};


// const function to change user email verified to true
const querySaveEmailVerify = (userId: number, email: string): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'UPDATE users SET email_verified = ?, email = ? WHERE user_id = ?';

        pool.query(query, [true, email, userId], (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result.affectedRows > 0)
            }
        })
    })
}


// query to update user password
const queryUpdatePassword = (userId: number, newPassword: string): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'UPDATE users SET password = ? WHERE user_id = ?';

        pool.query(query, [newPassword, userId], (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result.affectedRows > 0)
            }
        })
    })
}


// query to handle to change user name
const queryUpdateUserNames = (userId: number, firstName: string, lastName: string): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'UPDATE users SET first_name = ?, last_name = ? WHERE user_id = ?';

        pool.query(query, [firstName, lastName, userId], (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result.affectedRows > 0)
            }
        })
    })
}

// query chck if user has dp
const queryUserDp = (userId: number): Promise<any> => {
    return new Promise<any>((resolve, reject) => {
        const query = 'SELECT * FROM user_dp WHERE user_id = ? LIMIT 1';

        pool.query(query, [userId], (err, result) => {
            if (err) return reject(err);

            resolve(result[0]);
        });
    });
};

// query to upload user image
const queryUserSaveDp = (userId: number, imageBuffer: Buffer) => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'INSERT INTO user_dp (user_id, dp) VALUES (?, ?)';

        pool.query(query, [userId, imageBuffer], (err, result) => {
            if (err) return reject(err);

            resolve(result.affectedRows > 0);
        });
    });
};

// to update user dp
const queryUpdateUserDp = (userId: number, imageBuffer: Buffer) => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'UPDATE user_dp SET dp = ? WHERE user_id = ?';

        pool.query(query, [imageBuffer, userId], (err, result) => {
            if (err) return reject(err);

            resolve(result.affectedRows > 0);
        });
    });
};



export {
    queryUserProfile,
    queryNewEnrollment,
    updateLastVisited,
    updateEnrollmentPaymentType,
    querySaveEmailVerify,
    queryUpdatePassword,
    queryUpdateUserNames,
    queryUserSaveDp,
    queryUpdateUserDp,
    queryUserDp,
}

export type {
    queryUserProfileType,
}